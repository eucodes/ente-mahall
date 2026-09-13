import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { FormFieldType, FormVersionStatus } from "@mahalle/types";
import type { Prisma } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import type { RequestContext } from "../platform/platform.service";
import { CreateFormTemplateDto } from "./dto/create-form-template.dto";
import { UpdateFormTemplateDto } from "./dto/update-form-template.dto";
import { UpsertFormFieldDto } from "./dto/upsert-form-field.dto";
import { SetFormAssignmentDto } from "./dto/set-form-assignment.dto";

export interface FormFieldSummary {
  id: string;
  key: string;
  label: string;
  type: FormFieldType;
  description: string | null;
  required: boolean;
  order: number;
  options: string[] | null;
}

export interface FormVersionSummary {
  id: string;
  version: number;
  status: FormVersionStatus;
  publishedAt: Date | null;
  fields: FormFieldSummary[];
}

export interface FormTemplateSummary {
  id: string;
  key: string;
  name: string;
  description: string | null;
  category: string | null;
  isPlatformWide: boolean;
  createdAt: Date;
  latestVersion: { id: string; version: number; status: FormVersionStatus } | null;
  assignedTenantCount: number;
}

export interface FormTemplateDetail extends FormTemplateSummary {
  versions: FormVersionSummary[];
  assignedTenantIds: string[];
}

const VERSION_WITH_FIELDS = {
  fields: { orderBy: { order: "asc" as const } }
} satisfies Prisma.FormVersionInclude;

@Injectable()
export class FormsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  private serializeField(field: {
    id: string;
    key: string;
    label: string;
    type: string;
    description: string | null;
    required: boolean;
    order: number;
    options: Prisma.JsonValue;
  }): FormFieldSummary {
    return {
      id: field.id,
      key: field.key,
      label: field.label,
      type: field.type as FormFieldType,
      description: field.description,
      required: field.required,
      order: field.order,
      options: Array.isArray(field.options) ? (field.options as string[]) : null
    };
  }

  async listTemplates(): Promise<FormTemplateSummary[]> {
    const templates = await this.prisma.formTemplate.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        versions: { orderBy: { version: "desc" }, take: 1 },
        _count: { select: { assignments: true } }
      }
    });

    return templates.map((t) => ({
      id: t.id,
      key: t.key,
      name: t.name,
      description: t.description,
      category: t.category,
      isPlatformWide: t.isPlatformWide,
      createdAt: t.createdAt,
      latestVersion: t.versions[0]
        ? { id: t.versions[0].id, version: t.versions[0].version, status: t.versions[0].status as FormVersionStatus }
        : null,
      assignedTenantCount: t._count.assignments
    }));
  }

  private async findTemplateOrThrow(templateId: string) {
    const template = await this.prisma.formTemplate.findUnique({ where: { id: templateId } });
    if (!template) {
      throw new NotFoundException("Form not found");
    }
    return template;
  }

  async getTemplate(templateId: string): Promise<FormTemplateDetail> {
    const template = await this.prisma.formTemplate.findUnique({
      where: { id: templateId },
      include: {
        versions: { orderBy: { version: "desc" }, include: VERSION_WITH_FIELDS },
        assignments: { select: { tenantId: true } }
      }
    });
    if (!template) {
      throw new NotFoundException("Form not found");
    }

    const versions: FormVersionSummary[] = template.versions.map((v) => ({
      id: v.id,
      version: v.version,
      status: v.status as FormVersionStatus,
      publishedAt: v.publishedAt,
      fields: v.fields.map((f) => this.serializeField(f))
    }));

    return {
      id: template.id,
      key: template.key,
      name: template.name,
      description: template.description,
      category: template.category,
      isPlatformWide: template.isPlatformWide,
      createdAt: template.createdAt,
      latestVersion: versions[0] ? { id: versions[0].id, version: versions[0].version, status: versions[0].status } : null,
      assignedTenantCount: template.assignments.length,
      versions,
      assignedTenantIds: template.assignments.map((a) => a.tenantId)
    };
  }

  /** Creates a template and its first (empty) draft version in one step. */
  async createTemplate(
    dto: CreateFormTemplateDto,
    actorUserId: string,
    context: RequestContext
  ): Promise<FormTemplateDetail> {
    const existing = await this.prisma.formTemplate.findUnique({ where: { key: dto.key } });
    if (existing) {
      throw new ConflictException("A form with this key already exists");
    }

    const template = await this.prisma.formTemplate.create({
      data: {
        key: dto.key,
        name: dto.name,
        description: dto.description,
        category: dto.category,
        isPlatformWide: dto.isPlatformWide ?? false,
        versions: { create: { version: 1, status: FormVersionStatus.DRAFT } }
      }
    });

    await this.audit.record({
      actorUserId,
      tenantId: null,
      action: "platform.form.create",
      targetType: "FormTemplate",
      targetId: template.id,
      metadata: { key: template.key, name: template.name },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return this.getTemplate(template.id);
  }

  async updateTemplateMeta(
    templateId: string,
    dto: UpdateFormTemplateDto,
    actorUserId: string,
    context: RequestContext
  ): Promise<FormTemplateDetail> {
    const existing = await this.findTemplateOrThrow(templateId);
    await this.prisma.formTemplate.update({ where: { id: templateId }, data: dto });

    await this.audit.record({
      actorUserId,
      tenantId: null,
      action: "platform.form.update",
      targetType: "FormTemplate",
      targetId: templateId,
      metadata: { key: existing.key, changes: dto },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return this.getTemplate(templateId);
  }

  /** Only a template with no PUBLISHED version can be deleted — once live, a form's history is kept (Section N). */
  async deleteTemplate(templateId: string, actorUserId: string, context: RequestContext): Promise<void> {
    const template = await this.findTemplateOrThrow(templateId);
    const publishedCount = await this.prisma.formVersion.count({
      where: { templateId, status: FormVersionStatus.PUBLISHED }
    });
    if (publishedCount > 0) {
      throw new BadRequestException("Can't delete a form that has a published version — it has usable history");
    }

    await this.prisma.formTemplate.delete({ where: { id: templateId } });

    await this.audit.record({
      actorUserId,
      tenantId: null,
      action: "platform.form.delete",
      targetType: "FormTemplate",
      targetId: templateId,
      metadata: { key: template.key, name: template.name },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  private async findDraftVersionOrThrow(versionId: string) {
    const version = await this.prisma.formVersion.findUnique({ where: { id: versionId } });
    if (!version) {
      throw new NotFoundException("Form version not found");
    }
    if (version.status !== FormVersionStatus.DRAFT) {
      throw new BadRequestException("Only a draft version can be edited — published versions are immutable");
    }
    return version;
  }

  async addField(
    versionId: string,
    dto: UpsertFormFieldDto,
    actorUserId: string,
    context: RequestContext
  ): Promise<FormFieldSummary> {
    const version = await this.findDraftVersionOrThrow(versionId);
    const existing = await this.prisma.formField.findUnique({
      where: { versionId_key: { versionId, key: dto.key } }
    });
    if (existing) {
      throw new ConflictException("A field with this key already exists on this version");
    }

    const field = await this.prisma.formField.create({
      data: {
        versionId,
        key: dto.key,
        label: dto.label,
        type: dto.type,
        description: dto.description,
        required: dto.required ?? false,
        order: dto.order,
        options: dto.options ?? undefined
      }
    });

    await this.audit.record({
      actorUserId,
      tenantId: null,
      action: "platform.form.field.add",
      targetType: "FormVersion",
      targetId: version.id,
      metadata: { templateId: version.templateId, fieldKey: field.key },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return this.serializeField(field);
  }

  async updateField(
    fieldId: string,
    dto: UpsertFormFieldDto,
    actorUserId: string,
    context: RequestContext
  ): Promise<FormFieldSummary> {
    const existingField = await this.prisma.formField.findUnique({ where: { id: fieldId } });
    if (!existingField) {
      throw new NotFoundException("Field not found");
    }
    const version = await this.findDraftVersionOrThrow(existingField.versionId);

    if (dto.key !== existingField.key) {
      const clash = await this.prisma.formField.findUnique({
        where: { versionId_key: { versionId: version.id, key: dto.key } }
      });
      if (clash) {
        throw new ConflictException("A field with this key already exists on this version");
      }
    }

    const field = await this.prisma.formField.update({
      where: { id: fieldId },
      data: {
        key: dto.key,
        label: dto.label,
        type: dto.type,
        description: dto.description,
        required: dto.required ?? false,
        order: dto.order,
        options: dto.options ?? undefined
      }
    });

    await this.audit.record({
      actorUserId,
      tenantId: null,
      action: "platform.form.field.update",
      targetType: "FormVersion",
      targetId: version.id,
      metadata: { templateId: version.templateId, fieldKey: field.key },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return this.serializeField(field);
  }

  async deleteField(fieldId: string, actorUserId: string, context: RequestContext): Promise<void> {
    const existingField = await this.prisma.formField.findUnique({ where: { id: fieldId } });
    if (!existingField) {
      throw new NotFoundException("Field not found");
    }
    const version = await this.findDraftVersionOrThrow(existingField.versionId);

    await this.prisma.formField.delete({ where: { id: fieldId } });

    await this.audit.record({
      actorUserId,
      tenantId: null,
      action: "platform.form.field.delete",
      targetType: "FormVersion",
      targetId: version.id,
      metadata: { templateId: version.templateId, fieldKey: existingField.key },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  /** Freezes a draft version forever. Requires at least one field — an empty form isn't publishable. */
  async publishVersion(versionId: string, actorUserId: string, context: RequestContext): Promise<FormVersionSummary> {
    const version = await this.prisma.formVersion.findUnique({
      where: { id: versionId },
      include: VERSION_WITH_FIELDS
    });
    if (!version) {
      throw new NotFoundException("Form version not found");
    }
    if (version.status !== FormVersionStatus.DRAFT) {
      throw new BadRequestException("This version is already published");
    }
    if (version.fields.length === 0) {
      throw new BadRequestException("Add at least one field before publishing");
    }

    const published = await this.prisma.formVersion.update({
      where: { id: versionId },
      data: { status: FormVersionStatus.PUBLISHED, publishedAt: new Date() },
      include: VERSION_WITH_FIELDS
    });

    await this.audit.record({
      actorUserId,
      tenantId: null,
      action: "platform.form.publish",
      targetType: "FormVersion",
      targetId: versionId,
      metadata: { templateId: version.templateId, version: version.version },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return {
      id: published.id,
      version: published.version,
      status: published.status as FormVersionStatus,
      publishedAt: published.publishedAt,
      fields: published.fields.map((f) => this.serializeField(f))
    };
  }

  /**
   * Opens a new editable version on top of the latest published one, cloning
   * its fields as a starting point (Section N: v1 -> v2 -> v3, never edited
   * in place). Refused while a draft is already open on this template.
   */
  async createDraftVersion(
    templateId: string,
    actorUserId: string,
    context: RequestContext
  ): Promise<FormVersionSummary> {
    await this.findTemplateOrThrow(templateId);

    const existingDraft = await this.prisma.formVersion.findFirst({
      where: { templateId, status: FormVersionStatus.DRAFT }
    });
    if (existingDraft) {
      throw new ConflictException("This form already has an open draft version");
    }

    const latest = await this.prisma.formVersion.findFirst({
      where: { templateId },
      orderBy: { version: "desc" },
      include: VERSION_WITH_FIELDS
    });

    const nextVersion = (latest?.version ?? 0) + 1;
    const draft = await this.prisma.formVersion.create({
      data: {
        templateId,
        version: nextVersion,
        status: FormVersionStatus.DRAFT,
        fields: latest
          ? {
              create: latest.fields.map((f) => ({
                key: f.key,
                label: f.label,
                type: f.type,
                description: f.description,
                required: f.required,
                order: f.order,
                options: f.options ?? undefined
              }))
            }
          : undefined
      },
      include: VERSION_WITH_FIELDS
    });

    await this.audit.record({
      actorUserId,
      tenantId: null,
      action: "platform.form.new_draft",
      targetType: "FormVersion",
      targetId: draft.id,
      metadata: { templateId, version: nextVersion },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return {
      id: draft.id,
      version: draft.version,
      status: draft.status as FormVersionStatus,
      publishedAt: draft.publishedAt,
      fields: draft.fields.map((f) => this.serializeField(f))
    };
  }

  /** Replaces a form's assignment scope — platform-wide, or an explicit set of Mahalles. */
  async setAssignment(
    templateId: string,
    dto: SetFormAssignmentDto,
    actorUserId: string,
    context: RequestContext
  ): Promise<FormTemplateDetail> {
    await this.findTemplateOrThrow(templateId);

    if (!dto.isPlatformWide && dto.tenantIds.length > 0) {
      const found = await this.prisma.tenant.count({ where: { id: { in: dto.tenantIds } } });
      if (found !== dto.tenantIds.length) {
        throw new BadRequestException("One or more selected Mahalles don't exist");
      }
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.formTemplate.update({ where: { id: templateId }, data: { isPlatformWide: dto.isPlatformWide } });
      await tx.formAssignment.deleteMany({ where: { templateId } });
      if (!dto.isPlatformWide && dto.tenantIds.length > 0) {
        await tx.formAssignment.createMany({
          data: dto.tenantIds.map((tenantId) => ({ templateId, tenantId }))
        });
      }
    });

    await this.audit.record({
      actorUserId,
      tenantId: null,
      action: "platform.form.assignment.update",
      targetType: "FormTemplate",
      targetId: templateId,
      metadata: { isPlatformWide: dto.isPlatformWide, tenantIds: dto.tenantIds },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return this.getTemplate(templateId);
  }
}
