import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards, Req } from "@nestjs/common";
import type { Request } from "express";
import type { PlatformMembership } from "@mahalle/database";
import { PlatformRole } from "@mahalle/types";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PlatformContextGuard } from "../platform/guards/platform-context.guard";
import { CurrentPlatformMembership } from "../platform/decorators/current-platform-membership.decorator";
import { RequirePlatformRole } from "../common/decorators/require-platform-role.decorator";
import { FormsService } from "./forms.service";
import { CreateFormTemplateDto } from "./dto/create-form-template.dto";
import { UpdateFormTemplateDto } from "./dto/update-form-template.dto";
import { UpsertFormFieldDto } from "./dto/upsert-form-field.dto";
import { SetFormAssignmentDto } from "./dto/set-form-assignment.dto";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("platform/forms")
@UseGuards(JwtAuthGuard, PlatformContextGuard)
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Get()
  async list() {
    const forms = await this.formsService.listTemplates();
    return { forms };
  }

  @Get(":templateId")
  async detail(@Param("templateId") templateId: string) {
    const form = await this.formsService.getTemplate(templateId);
    return { form };
  }

  @Post()
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  async create(
    @Body() dto: CreateFormTemplateDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const form = await this.formsService.createTemplate(dto, membership.userId, requestContext(req));
    return { form };
  }

  @Patch(":templateId")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param("templateId") templateId: string,
    @Body() dto: UpdateFormTemplateDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const form = await this.formsService.updateTemplateMeta(templateId, dto, membership.userId, requestContext(req));
    return { form };
  }

  @Delete(":templateId")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param("templateId") templateId: string,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    await this.formsService.deleteTemplate(templateId, membership.userId, requestContext(req));
    return { success: true };
  }

  @Post(":templateId/versions")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  async createDraftVersion(
    @Param("templateId") templateId: string,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const version = await this.formsService.createDraftVersion(templateId, membership.userId, requestContext(req));
    return { version };
  }

  @Post("versions/:versionId/publish")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async publish(
    @Param("versionId") versionId: string,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const version = await this.formsService.publishVersion(versionId, membership.userId, requestContext(req));
    return { version };
  }

  @Post("versions/:versionId/fields")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  async addField(
    @Param("versionId") versionId: string,
    @Body() dto: UpsertFormFieldDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const field = await this.formsService.addField(versionId, dto, membership.userId, requestContext(req));
    return { field };
  }

  @Patch("fields/:fieldId")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async updateField(
    @Param("fieldId") fieldId: string,
    @Body() dto: UpsertFormFieldDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const field = await this.formsService.updateField(fieldId, dto, membership.userId, requestContext(req));
    return { field };
  }

  @Delete("fields/:fieldId")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async removeField(
    @Param("fieldId") fieldId: string,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    await this.formsService.deleteField(fieldId, membership.userId, requestContext(req));
    return { success: true };
  }

  @Patch(":templateId/assignment")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async setAssignment(
    @Param("templateId") templateId: string,
    @Body() dto: SetFormAssignmentDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const form = await this.formsService.setAssignment(templateId, dto, membership.userId, requestContext(req));
    return { form };
  }
}
