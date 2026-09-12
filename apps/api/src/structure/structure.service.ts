import { Injectable, NotFoundException } from "@nestjs/common";
import type { Tenant, TenantDivision } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import type { CreateDivisionDto, UpdateDivisionDto } from "./dto/division.dto";
import type { UpdateStructureDto } from "./dto/update-structure.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

interface ActorContext {
  userId: string;
  tenantId: string;
}

/** Structure (divisions + house-numbering method) is per-tenant configuration data, never a hard-coded term — see Tenant.divisionTerm. */
@Injectable()
export class StructureService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  async get(tenantId: string): Promise<{ tenant: Tenant; divisions: TenantDivision[] }> {
    const [tenant, divisions] = await Promise.all([
      this.prisma.tenant.findUniqueOrThrow({ where: { id: tenantId } }),
      this.prisma.tenantDivision.findMany({ where: { tenantId }, orderBy: { order: "asc" } })
    ]);
    return { tenant, divisions };
  }

  async update(actor: ActorContext, dto: UpdateStructureDto, context: RequestContext): Promise<Tenant> {
    const tenant = await this.prisma.tenant.update({ where: { id: actor.tenantId }, data: dto });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "structure.update",
      targetType: "Tenant",
      targetId: tenant.id,
      metadata: { ...dto },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return tenant;
  }

  private async findDivisionOrThrow(tenantId: string, divisionId: string): Promise<TenantDivision> {
    const division = await this.prisma.tenantDivision.findFirst({ where: { id: divisionId, tenantId } });
    if (!division) {
      throw new NotFoundException("Division not found");
    }
    return division;
  }

  async createDivision(actor: ActorContext, dto: CreateDivisionDto, context: RequestContext): Promise<TenantDivision> {
    const order = dto.order ?? (await this.prisma.tenantDivision.count({ where: { tenantId: actor.tenantId } }));
    const division = await this.prisma.tenantDivision.create({
      data: { ...dto, order, tenantId: actor.tenantId }
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "structure.division.create",
      targetType: "TenantDivision",
      targetId: division.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return division;
  }

  async updateDivision(
    actor: ActorContext,
    divisionId: string,
    dto: UpdateDivisionDto,
    context: RequestContext
  ): Promise<TenantDivision> {
    await this.findDivisionOrThrow(actor.tenantId, divisionId);
    const division = await this.prisma.tenantDivision.update({ where: { id: divisionId }, data: dto });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "structure.division.update",
      targetType: "TenantDivision",
      targetId: division.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return division;
  }

  async removeDivision(actor: ActorContext, divisionId: string, context: RequestContext): Promise<void> {
    await this.findDivisionOrThrow(actor.tenantId, divisionId);
    // Houses in this division are not deleted — Prisma's onDelete: SetNull unlinks them, they just become undivided.
    await this.prisma.tenantDivision.delete({ where: { id: divisionId } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "structure.division.delete",
      targetType: "TenantDivision",
      targetId: divisionId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }
}
