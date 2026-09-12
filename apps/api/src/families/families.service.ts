import { Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import { HousesService } from "../houses/houses.service";
import type { CreateFamilyDto } from "./dto/create-family.dto";
import type { UpdateFamilyDto } from "./dto/update-family.dto";

const HOUSE_INCLUDE = { house: { select: { id: true, displayNumber: true } } } as const;

export type FamilyWithHouse = Prisma.FamilyGetPayload<{ include: typeof HOUSE_INCLUDE }>;

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

interface ActorContext {
  userId: string;
  tenantId: string;
}

/** Same tenant-scoping pattern as MembersService — see its comment for why. */
@Injectable()
export class FamiliesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly housesService: HousesService
  ) {}

  async list(tenantId: string, page: number, pageSize: number): Promise<{ families: FamilyWithHouse[]; total: number }> {
    const [families, total] = await Promise.all([
      this.prisma.family.findMany({
        where: { tenantId, isActive: true },
        orderBy: { name: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: HOUSE_INCLUDE
      }),
      this.prisma.family.count({ where: { tenantId, isActive: true } })
    ]);
    return { families, total };
  }

  async findOne(tenantId: string, familyId: string): Promise<FamilyWithHouse> {
    const family = await this.prisma.family.findFirst({
      where: { id: familyId, tenantId, isActive: true },
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
    const family = await this.prisma.family.create({
      data: { ...dto, tenantId: actor.tenantId },
      include: HOUSE_INCLUDE
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "family.create",
      targetType: "Family",
      targetId: family.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return family;
  }

  async update(actor: ActorContext, familyId: string, dto: UpdateFamilyDto, context: RequestContext): Promise<FamilyWithHouse> {
    await this.findOne(actor.tenantId, familyId);
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
    return family;
  }

  async remove(actor: ActorContext, familyId: string, context: RequestContext): Promise<void> {
    await this.findOne(actor.tenantId, familyId);
    await this.prisma.family.update({ where: { id: familyId }, data: { isActive: false } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "family.delete",
      targetType: "Family",
      targetId: familyId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }
}
