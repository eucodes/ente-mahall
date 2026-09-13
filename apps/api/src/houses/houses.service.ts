import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, type House } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import type { CreateHouseDto } from "./dto/create-house.dto";
import type { UpdateHouseDto } from "./dto/update-house.dto";
import type { ListHousesQueryDto } from "./dto/list-houses-query.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

interface ActorContext {
  userId: string;
  tenantId: string;
}

export interface HouseSummary {
  totalHouses: number;
  activeHouses: number;
  inactiveHouses: number;
  unassignedHouses: number;
}

const HOUSE_INCLUDE = { division: true } as const;
export type HouseWithDivision = Prisma.HouseGetPayload<{ include: typeof HOUSE_INCLUDE }>;

/** Natural (numeric-aware) comparator for house numbers like "12" vs "9" vs "A-102" — a plain string sort would put "12" before "9". */
function naturalCompare(a: string, b: string): number {
  const chunk = (s: string) => s.match(/\d+|\D+/g) ?? [s];
  const ac = chunk(a);
  const bc = chunk(b);
  const len = Math.max(ac.length, bc.length);
  for (let i = 0; i < len; i++) {
    const av = ac[i] ?? "";
    const bv = bc[i] ?? "";
    const an = Number(av);
    const bn = Number(bv);
    if (!Number.isNaN(an) && !Number.isNaN(bn) && av !== "" && bv !== "") {
      if (an !== bn) return an - bn;
    } else if (av !== bv) {
      return av < bv ? -1 : 1;
    }
  }
  return 0;
}

/** Same tenant-scoping pattern as FamiliesService — see its comment for why. */
@Injectable()
export class HousesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  async list(
    tenantId: string,
    page: number,
    pageSize: number,
    query: Pick<ListHousesQueryDto, "divisionId" | "q" | "status" | "sortBy" | "sortDir">
  ): Promise<{ houses: HouseWithDivision[]; total: number }> {
    const status = query.status ?? "active";
    const where: Prisma.HouseWhereInput = {
      tenantId,
      ...(status !== "all" ? { isActive: status === "active" } : {}),
      ...(query.divisionId ? { divisionId: query.divisionId } : {}),
      ...(query.q
        ? {
            OR: [
              { displayNumber: { contains: query.q, mode: "insensitive" } },
              { name: { contains: query.q, mode: "insensitive" } },
              { address: { contains: query.q, mode: "insensitive" } }
            ]
          }
        : {})
    };

    const sortBy = query.sortBy ?? "displayNumber";
    const sortDir = query.sortDir ?? "asc";

    // House numbers are free-text (format is a per-tenant choice — see
    // Tenant.houseNumberingMethod), so a DB-level text sort would put "12"
    // before "9". Sorting this one field naturally means pulling the
    // filtered set into memory rather than paginating in SQL — acceptable
    // for a Mahallu's house directory (hundreds, not millions, of rows)
    // without building a numeric-cast SQL expression for a free-text column.
    if (sortBy === "displayNumber") {
      const all = await this.prisma.house.findMany({ where, include: HOUSE_INCLUDE });
      all.sort((a, b) => naturalCompare(a.displayNumber, b.displayNumber) * (sortDir === "desc" ? -1 : 1));
      const total = all.length;
      const houses = all.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
      return { houses, total };
    }

    const [houses, total] = await Promise.all([
      this.prisma.house.findMany({
        where,
        include: HOUSE_INCLUDE,
        orderBy: { [sortBy]: sortDir },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      this.prisma.house.count({ where })
    ]);
    return { houses, total };
  }

  async summary(tenantId: string): Promise<HouseSummary> {
    const [totalHouses, activeHouses, inactiveHouses, unassignedHouses] = await Promise.all([
      this.prisma.house.count({ where: { tenantId } }),
      this.prisma.house.count({ where: { tenantId, isActive: true } }),
      this.prisma.house.count({ where: { tenantId, isActive: false } }),
      this.prisma.house.count({ where: { tenantId, isActive: true, divisionId: null } })
    ]);
    return { totalHouses, activeHouses, inactiveHouses, unassignedHouses };
  }

  async findOne(tenantId: string, houseId: string): Promise<HouseWithDivision> {
    const house = await this.prisma.house.findFirst({
      where: { id: houseId, tenantId },
      include: HOUSE_INCLUDE
    });
    if (!house) {
      throw new NotFoundException("House not found");
    }
    return house;
  }

  private async assertDivisionInTenant(tenantId: string, divisionId: string | undefined): Promise<void> {
    if (!divisionId) return;
    const division = await this.prisma.tenantDivision.findFirst({ where: { id: divisionId, tenantId } });
    if (!division) {
      throw new BadRequestException("That division doesn't belong to this Mahalle.");
    }
  }

  /**
   * Suggests the next house number from the tenant's House Configuration.
   * Only meaningful for NUMERIC/ALPHANUMERIC-with-a-numeric-tail formats —
   * for CUSTOM it falls back to the configured starting number, since
   * inventing a full numbering rule engine is explicitly out of scope.
   */
  async suggestNextNumber(tenantId: string): Promise<{ suggested: string; currentHighest: string | null }> {
    const tenant = await this.prisma.tenant.findUniqueOrThrow({ where: { id: tenantId } });
    const prefix = tenant.houseNumberPrefix ?? "";
    const suffix = tenant.houseNumberSuffix ?? "";
    const minDigits = tenant.houseNumberMinDigits ?? 1;
    const startAt = tenant.houseNumberStartAt ?? 1;

    const houses = await this.prisma.house.findMany({ where: { tenantId }, select: { displayNumber: true } });
    let highest = startAt - 1;
    let currentHighestLabel: string | null = null;
    for (const house of houses) {
      const match = house.displayNumber.match(/(\d+)(?!.*\d)/);
      if (!match) continue;
      const value = Number(match[1]);
      if (value > highest) {
        highest = value;
        currentHighestLabel = house.displayNumber;
      }
    }

    const nextValue = Math.max(highest + 1, startAt);
    const padded = String(nextValue).padStart(minDigits, "0");
    return { suggested: `${prefix}${padded}${suffix}`, currentHighest: currentHighestLabel };
  }

  async create(actor: ActorContext, dto: CreateHouseDto, context: RequestContext): Promise<HouseWithDivision> {
    await this.assertDivisionInTenant(actor.tenantId, dto.divisionId);
    let house: House;
    try {
      house = await this.prisma.house.create({ data: { ...dto, tenantId: actor.tenantId } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new ConflictException("This house number is already in use.");
      }
      throw err;
    }
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "house.create",
      targetType: "House",
      targetId: house.id,
      metadata: { displayNumber: house.displayNumber },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return this.findOne(actor.tenantId, house.id);
  }

  async update(actor: ActorContext, houseId: string, dto: UpdateHouseDto, context: RequestContext): Promise<HouseWithDivision> {
    const before = await this.findOne(actor.tenantId, houseId);
    await this.assertDivisionInTenant(actor.tenantId, dto.divisionId);

    let house: House;
    try {
      house = await this.prisma.house.update({ where: { id: houseId }, data: dto });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new ConflictException("This house number is already in use.");
      }
      throw err;
    }

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "house.update",
      targetType: "House",
      targetId: house.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    // House-number changes are a sensitive, separately-audited operation —
    // historical records may reference the old number, so this is worth
    // its own trail beyond the generic "house.update" entry.
    if (dto.displayNumber !== undefined && dto.displayNumber !== before.displayNumber) {
      await this.audit.record({
        actorUserId: actor.userId,
        tenantId: actor.tenantId,
        action: "house.number_changed",
        targetType: "House",
        targetId: house.id,
        metadata: { previousDisplayNumber: before.displayNumber, newDisplayNumber: house.displayNumber },
        ipAddress: context.ipAddress,
        userAgent: context.userAgent
      });
    }
    if (dto.divisionId !== undefined && dto.divisionId !== before.divisionId) {
      await this.audit.record({
        actorUserId: actor.userId,
        tenantId: actor.tenantId,
        action: "house.division_changed",
        targetType: "House",
        targetId: house.id,
        metadata: { previousDivisionId: before.divisionId, newDivisionId: house.divisionId },
        ipAddress: context.ipAddress,
        userAgent: context.userAgent
      });
    }

    return this.findOne(actor.tenantId, house.id);
  }

  async remove(actor: ActorContext, houseId: string, context: RequestContext): Promise<void> {
    await this.findOne(actor.tenantId, houseId);
    await this.prisma.house.update({ where: { id: houseId }, data: { isActive: false } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "house.deactivate",
      targetType: "House",
      targetId: houseId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  async reactivate(actor: ActorContext, houseId: string, context: RequestContext): Promise<HouseWithDivision> {
    const house = await this.prisma.house.findFirst({ where: { id: houseId, tenantId: actor.tenantId } });
    if (!house) throw new NotFoundException("House not found");
    await this.prisma.house.update({ where: { id: houseId }, data: { isActive: true } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "house.reactivate",
      targetType: "House",
      targetId: houseId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return this.findOne(actor.tenantId, houseId);
  }
}
