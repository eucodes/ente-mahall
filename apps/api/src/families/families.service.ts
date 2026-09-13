import { Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import { HousesService } from "../houses/houses.service";
import { CertificateService } from "../registers/certificates/certificate.service";
import type { CreateFamilyDto } from "./dto/create-family.dto";
import type { UpdateFamilyDto } from "./dto/update-family.dto";
import type { ListFamiliesQueryDto } from "./dto/list-families-query.dto";

const HOUSE_INCLUDE = { house: { select: { id: true, displayNumber: true, divisionId: true } } } as const;

export type FamilyWithHouse = Prisma.FamilyGetPayload<{ include: typeof HOUSE_INCLUDE }>;

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

interface ActorContext {
  userId: string;
  tenantId: string;
}

export interface FamilySummary {
  totalFamilies: number;
  activeFamilies: number;
  inactiveFamilies: number;
  unassignedFamilies: number;
}

/** Same tenant-scoping pattern as MembersService — see its comment for why. */
@Injectable()
export class FamiliesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly housesService: HousesService,
    private readonly certificates: CertificateService
  ) {}

  async list(
    tenantId: string,
    page: number,
    pageSize: number,
    query: Pick<ListFamiliesQueryDto, "houseId" | "divisionId" | "q" | "status" | "sortBy" | "sortDir">
  ): Promise<{ families: FamilyWithHouse[]; total: number }> {
    const status = query.status ?? "active";

    let divisionName: string | undefined;
    if (query.divisionId) {
      const division = await this.prisma.tenantDivision.findFirst({
        where: { id: query.divisionId, tenantId },
        select: { name: true }
      });
      divisionName = division?.name;
    }

    const where: Prisma.FamilyWhereInput = {
      tenantId,
      ...(status !== "all" ? { isActive: status === "active" } : {}),
      ...(query.houseId ? { houseId: query.houseId } : {}),
      ...(query.divisionId
        ? {
            OR: [
              { house: { divisionId: query.divisionId } },
              ...(divisionName
                ? [
                    { notes: { contains: `Ward: ${divisionName}`, mode: "insensitive" as const } },
                    { notes: { contains: `Division: ${divisionName}`, mode: "insensitive" as const } },
                    { notes: { contains: `Area: ${divisionName}`, mode: "insensitive" as const } },
                    { notes: { contains: `Zone: ${divisionName}`, mode: "insensitive" as const } }
                  ]
                : [])
            ]
          }
        : {}),
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q, mode: "insensitive" } },
              { familyNumber: { contains: query.q, mode: "insensitive" } },
              { house: { displayNumber: { contains: query.q, mode: "insensitive" } } }
            ]
          }
        : {})
    };

    const sortBy = query.sortBy ?? "name";
    const sortDir = query.sortDir ?? "asc";

    const [families, total] = await Promise.all([
      this.prisma.family.findMany({
        where,
        include: HOUSE_INCLUDE,
        orderBy: { [sortBy]: sortDir },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      this.prisma.family.count({ where })
    ]);
    return { families, total };
  }

  async summary(tenantId: string): Promise<FamilySummary> {
    const [totalFamilies, activeFamilies, inactiveFamilies, unassignedFamilies] = await Promise.all([
      this.prisma.family.count({ where: { tenantId } }),
      this.prisma.family.count({ where: { tenantId, isActive: true } }),
      this.prisma.family.count({ where: { tenantId, isActive: false } }),
      this.prisma.family.count({ where: { tenantId, isActive: true, houseId: null } })
    ]);
    return { totalFamilies, activeFamilies, inactiveFamilies, unassignedFamilies };
  }

  async findOne(tenantId: string, familyId: string): Promise<FamilyWithHouse> {
    const family = await this.prisma.family.findFirst({
      where: { id: familyId, tenantId },
      include: HOUSE_INCLUDE
    });
    if (!family) {
      throw new NotFoundException("Family not found");
    }
    return family;
  }

  /** Throws if houseId is set but doesn't belong to this tenant — never trust a foreign key from the client without re-checking its tenant scope. */
  private async assertHouseInTenant(tenantId: string, houseId: string | undefined): Promise<void> {
    if (houseId) {
      await this.housesService.findOne(tenantId, houseId);
    }
  }

  async create(actor: ActorContext, dto: CreateFamilyDto, context: RequestContext): Promise<FamilyWithHouse> {
    await this.assertHouseInTenant(actor.tenantId, dto.houseId);
    // Auto-generated, never client-supplied — the family number is the
    // stable identifier and must never collide or be reused (reuses the
    // same sequential-counter mechanism as certificate numbers).
    const familyNumber = await this.certificates.nextNumber(actor.tenantId, "FAMILY", "F");
    const family = await this.prisma.family.create({
      data: { ...dto, familyNumber, tenantId: actor.tenantId },
      include: HOUSE_INCLUDE
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "family.create",
      targetType: "Family",
      targetId: family.id,
      metadata: { familyNumber, houseId: dto.houseId },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return family;
  }

  async update(actor: ActorContext, familyId: string, dto: UpdateFamilyDto, context: RequestContext): Promise<FamilyWithHouse> {
    const before = await this.findOne(actor.tenantId, familyId);
    await this.assertHouseInTenant(actor.tenantId, dto.houseId);
    const family = await this.prisma.family.update({
      where: { id: familyId },
      data: dto,
      include: HOUSE_INCLUDE
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "family.update",
      targetType: "Family",
      targetId: family.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    // House reassignment is worth its own audit trail — it's the kind of
    // change that historical Mahallu records may need to reconstruct later.
    if (dto.houseId !== undefined && dto.houseId !== before.houseId) {
      await this.audit.record({
        actorUserId: actor.userId,
        tenantId: actor.tenantId,
        action: "family.house_changed",
        targetType: "Family",
        targetId: family.id,
        metadata: {
          previousHouseId: before.houseId,
          previousHouseNumber: before.house?.displayNumber ?? null,
          newHouseId: family.houseId,
          newHouseNumber: family.house?.displayNumber ?? null
        },
        ipAddress: context.ipAddress,
        userAgent: context.userAgent
      });
    }

    return family;
  }

  async remove(actor: ActorContext, familyId: string, context: RequestContext): Promise<void> {
    await this.findOne(actor.tenantId, familyId);
    await this.prisma.family.update({ where: { id: familyId }, data: { isActive: false } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "family.deactivate",
      targetType: "Family",
      targetId: familyId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  async reactivate(actor: ActorContext, familyId: string, context: RequestContext): Promise<FamilyWithHouse> {
    const family = await this.prisma.family.findFirst({ where: { id: familyId, tenantId: actor.tenantId } });
    if (!family) throw new NotFoundException("Family not found");
    if (!family.isActive) {
      await this.prisma.family.update({ where: { id: familyId }, data: { isActive: true } });
      await this.audit.record({
        actorUserId: actor.userId,
        tenantId: actor.tenantId,
        action: "family.reactivate",
        targetType: "Family",
        targetId: familyId,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent
      });
    }
    return this.findOne(actor.tenantId, familyId);
  }
}
