import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, type House } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import type { CreateHouseDto } from "./dto/create-house.dto";
import type { UpdateHouseDto } from "./dto/update-house.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

interface ActorContext {
  userId: string;
  tenantId: string;
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
    divisionId?: string
  ): Promise<{ houses: House[]; total: number }> {
    const where = { tenantId, isActive: true, ...(divisionId ? { divisionId } : {}) };
    const [houses, total] = await Promise.all([
      this.prisma.house.findMany({
        where,
        include: { division: true },
        orderBy: { displayNumber: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      this.prisma.house.count({ where })
    ]);
    return { houses, total };
  }

  async findOne(tenantId: string, houseId: string): Promise<House> {
    const house = await this.prisma.house.findFirst({
      where: { id: houseId, tenantId, isActive: true },
      include: { division: true }
    });
    if (!house) {
      throw new NotFoundException("House not found");
    }
    return house;
  }

  async create(actor: ActorContext, dto: CreateHouseDto, context: RequestContext): Promise<House> {
    const house = await this.createOrThrow(actor, dto);
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "house.create",
      targetType: "House",
      targetId: house.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return house;
  }

  private async createOrThrow(actor: ActorContext, dto: CreateHouseDto): Promise<House> {
    try {
      return await this.prisma.house.create({ data: { ...dto, tenantId: actor.tenantId } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new ConflictException("A house with this number already exists.");
      }
      throw err;
    }
  }

  async update(actor: ActorContext, houseId: string, dto: UpdateHouseDto, context: RequestContext): Promise<House> {
    await this.findOne(actor.tenantId, houseId);
    let house: House;
    try {
      house = await this.prisma.house.update({ where: { id: houseId }, data: dto });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new ConflictException("A house with this number already exists.");
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
    return house;
  }

  async remove(actor: ActorContext, houseId: string, context: RequestContext): Promise<void> {
    await this.findOne(actor.tenantId, houseId);
    await this.prisma.house.update({ where: { id: houseId }, data: { isActive: false } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "house.delete",
      targetType: "House",
      targetId: houseId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }
}
