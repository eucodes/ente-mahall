import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, type Tenant, type TenantDivision, type TenantFamilyStatus } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import type { CreateDivisionDto, UpdateDivisionDto } from "./dto/division.dto";
import type { CreateFamilyStatusDto, UpdateFamilyStatusDto } from "./dto/family-status.dto";
import type { UpdateStructureDto } from "./dto/update-structure.dto";
import type { ReorderDivisionsDto } from "./dto/reorder-divisions.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

interface ActorContext {
  userId: string;
  tenantId: string;
}

export interface StructureSummary {
  totalDivisions: number;
  totalHouses: number;
  activeHouses: number;
  inactiveHouses: number;
  unassignedHouses: number;
}

/** Structure (divisions + house-numbering method) is per-tenant configuration data, never a hard-coded term — see Tenant.divisionTerm. */
@Injectable()
export class StructureService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  /** Every division & family status, active or not — Settings management screen needs both. */
  async get(tenantId: string): Promise<{ tenant: Tenant; divisions: TenantDivision[]; familyStatuses: TenantFamilyStatus[] }> {
    const [tenant, divisions, familyStatuses] = await Promise.all([
      this.prisma.tenant.findUniqueOrThrow({ where: { id: tenantId } }),
      this.prisma.tenantDivision.findMany({ where: { tenantId }, orderBy: { order: "asc" } }),
      this.prisma.tenantFamilyStatus.findMany({ where: { tenantId }, orderBy: { order: "asc" } })
    ]);
    return { tenant, divisions, familyStatuses };
  }

  /** Only active divisions — for House/Family creation pickers, which shouldn't offer a deactivated division. */
  async listActive(tenantId: string): Promise<TenantDivision[]> {
    return this.prisma.tenantDivision.findMany({ where: { tenantId, isActive: true }, orderBy: { order: "asc" } });
  }

  /** Only active family statuses — for Family creation/editing pickers. */
  async listActiveFamilyStatuses(tenantId: string): Promise<TenantFamilyStatus[]> {
    return this.prisma.tenantFamilyStatus.findMany({ where: { tenantId, isActive: true }, orderBy: { order: "asc" } });
  }

  async summary(tenantId: string): Promise<StructureSummary> {
    const [totalDivisions, totalHouses, activeHouses, inactiveHouses, unassignedHouses] = await Promise.all([
      this.prisma.tenantDivision.count({ where: { tenantId, isActive: true } }),
      this.prisma.house.count({ where: { tenantId } }),
      this.prisma.house.count({ where: { tenantId, isActive: true } }),
      this.prisma.house.count({ where: { tenantId, isActive: false } }),
      this.prisma.house.count({ where: { tenantId, isActive: true, divisionId: null } })
    ]);
    return { totalDivisions, totalHouses, activeHouses, inactiveHouses, unassignedHouses };
  }

  async update(actor: ActorContext, dto: UpdateStructureDto, context: RequestContext): Promise<Tenant> {
    const before = await this.prisma.tenant.findUniqueOrThrow({ where: { id: actor.tenantId } });
    const tenant = await this.prisma.tenant.update({ where: { id: actor.tenantId }, data: dto });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "structure.update",
      targetType: "Tenant",
      targetId: tenant.id,
      metadata: {
        ...dto,
        ...(dto.divisionTerm !== undefined && dto.divisionTerm !== before.divisionTerm
          ? { previousDivisionTerm: before.divisionTerm }
          : {}),
        ...(dto.houseNumberingMethod !== undefined && dto.houseNumberingMethod !== before.houseNumberingMethod
          ? { previousHouseNumberingMethod: before.houseNumberingMethod }
          : {})
      },
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
    let division: TenantDivision;
    try {
      division = await this.prisma.tenantDivision.create({
        data: { ...dto, order, tenantId: actor.tenantId }
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new ConflictException("A division with this code already exists.");
      }
      throw err;
    }
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "structure.division.create",
      targetType: "TenantDivision",
      targetId: division.id,
      metadata: { name: dto.name, code: dto.code },
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
    let division: TenantDivision;
    try {
      division = await this.prisma.tenantDivision.update({ where: { id: divisionId }, data: dto });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new ConflictException("A division with this code already exists.");
      }
      throw err;
    }
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "structure.division.update",
      targetType: "TenantDivision",
      targetId: division.id,
      metadata: { ...dto },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return division;
  }

  /**
   * Soft-deactivate only — a division is never hard-deleted, since houses
   * (and historical announcements) may still reference it. Deactivated
   * divisions drop out of pickers for new houses but existing houses keep
   * their link.
   */
  async deactivateDivision(actor: ActorContext, divisionId: string, context: RequestContext): Promise<TenantDivision> {
    const division = await this.findDivisionOrThrow(actor.tenantId, divisionId);
    if (!division.isActive) return division;
    const updated = await this.prisma.tenantDivision.update({ where: { id: divisionId }, data: { isActive: false } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "structure.division.deactivate",
      targetType: "TenantDivision",
      targetId: divisionId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return updated;
  }

  async reactivateDivision(actor: ActorContext, divisionId: string, context: RequestContext): Promise<TenantDivision> {
    const division = await this.findDivisionOrThrow(actor.tenantId, divisionId);
    if (division.isActive) return division;
    const updated = await this.prisma.tenantDivision.update({ where: { id: divisionId }, data: { isActive: true } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "structure.division.reactivate",
      targetType: "TenantDivision",
      targetId: divisionId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return updated;
  }

  async reorderDivisions(actor: ActorContext, dto: ReorderDivisionsDto, context: RequestContext): Promise<TenantDivision[]> {
    const existing = await this.prisma.tenantDivision.findMany({ where: { tenantId: actor.tenantId, id: { in: dto.orderedIds } } });
    if (existing.length !== dto.orderedIds.length) {
      // Never trust the client's id list at face value — every id must resolve to a division in THIS tenant.
      throw new BadRequestException("One or more divisions were not found for this Mahalle.");
    }
    await this.prisma.$transaction(
      dto.orderedIds.map((id, index) => this.prisma.tenantDivision.update({ where: { id }, data: { order: index } }))
    );
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "structure.division.reorder",
      targetType: "TenantDivision",
      metadata: { orderedIds: dto.orderedIds },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return this.prisma.tenantDivision.findMany({ where: { tenantId: actor.tenantId }, orderBy: { order: "asc" } });
  }

  private async findFamilyStatusOrThrow(tenantId: string, statusId: string): Promise<TenantFamilyStatus> {
    const status = await this.prisma.tenantFamilyStatus.findFirst({ where: { id: statusId, tenantId } });
    if (!status) {
      throw new NotFoundException("Family status not found");
    }
    return status;
  }

  async createFamilyStatus(actor: ActorContext, dto: CreateFamilyStatusDto, context: RequestContext): Promise<TenantFamilyStatus> {
    const order = dto.order ?? (await this.prisma.tenantFamilyStatus.count({ where: { tenantId: actor.tenantId } }));
    let status: TenantFamilyStatus;
    try {
      status = await this.prisma.tenantFamilyStatus.create({
        data: { ...dto, order, tenantId: actor.tenantId }
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new ConflictException("A family status with this name or code already exists.");
      }
      throw err;
    }
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "structure.family_status.create",
      targetType: "TenantFamilyStatus",
      targetId: status.id,
      metadata: { name: dto.name, code: dto.code },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return status;
  }

  async updateFamilyStatus(
    actor: ActorContext,
    statusId: string,
    dto: UpdateFamilyStatusDto,
    context: RequestContext
  ): Promise<TenantFamilyStatus> {
    await this.findFamilyStatusOrThrow(actor.tenantId, statusId);
    let status: TenantFamilyStatus;
    try {
      status = await this.prisma.tenantFamilyStatus.update({ where: { id: statusId }, data: dto });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new ConflictException("A family status with this name or code already exists.");
      }
      throw err;
    }
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "structure.family_status.update",
      targetType: "TenantFamilyStatus",
      targetId: status.id,
      metadata: { ...dto },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return status;
  }

  async deactivateFamilyStatus(actor: ActorContext, statusId: string, context: RequestContext): Promise<TenantFamilyStatus> {
    const status = await this.findFamilyStatusOrThrow(actor.tenantId, statusId);
    if (!status.isActive) return status;
    const updated = await this.prisma.tenantFamilyStatus.update({ where: { id: statusId }, data: { isActive: false } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "structure.family_status.deactivate",
      targetType: "TenantFamilyStatus",
      targetId: statusId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return updated;
  }

  async reactivateFamilyStatus(actor: ActorContext, statusId: string, context: RequestContext): Promise<TenantFamilyStatus> {
    const status = await this.findFamilyStatusOrThrow(actor.tenantId, statusId);
    if (status.isActive) return status;
    const updated = await this.prisma.tenantFamilyStatus.update({ where: { id: statusId }, data: { isActive: true } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "structure.family_status.reactivate",
      targetType: "TenantFamilyStatus",
      targetId: statusId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return updated;
  }

  async reorderFamilyStatuses(actor: ActorContext, dto: ReorderDivisionsDto, context: RequestContext): Promise<TenantFamilyStatus[]> {
    const existing = await this.prisma.tenantFamilyStatus.findMany({ where: { tenantId: actor.tenantId, id: { in: dto.orderedIds } } });
    if (existing.length !== dto.orderedIds.length) {
      throw new BadRequestException("One or more family statuses were not found for this Mahalle.");
    }
    await this.prisma.$transaction(
      dto.orderedIds.map((id, index) => this.prisma.tenantFamilyStatus.update({ where: { id }, data: { order: index } }))
    );
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "structure.family_status.reorder",
      targetType: "TenantFamilyStatus",
      metadata: { orderedIds: dto.orderedIds },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return this.prisma.tenantFamilyStatus.findMany({ where: { tenantId: actor.tenantId }, orderBy: { order: "asc" } });
  }
}
