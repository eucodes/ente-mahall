import { Injectable, NotFoundException } from "@nestjs/common";
import type { Family } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import type { CreateFamilyDto } from "./dto/create-family.dto";
import type { UpdateFamilyDto } from "./dto/update-family.dto";

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
    private readonly audit: AuditService
  ) {}

  async list(tenantId: string, page: number, pageSize: number): Promise<{ families: Family[]; total: number }> {
    const [families, total] = await Promise.all([
      this.prisma.family.findMany({
        where: { tenantId, isActive: true },
        orderBy: { name: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      this.prisma.family.count({ where: { tenantId, isActive: true } })
    ]);
    return { families, total };
  }

  async findOne(tenantId: string, familyId: string): Promise<Family> {
    const family = await this.prisma.family.findFirst({ where: { id: familyId, tenantId, isActive: true } });
    if (!family) {
      throw new NotFoundException("Family not found");
    }
    return family;
  }

  async create(actor: ActorContext, dto: CreateFamilyDto, context: RequestContext): Promise<Family> {
    const family = await this.prisma.family.create({ data: { ...dto, tenantId: actor.tenantId } });
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

  async update(actor: ActorContext, familyId: string, dto: UpdateFamilyDto, context: RequestContext): Promise<Family> {
    await this.findOne(actor.tenantId, familyId);
    const family = await this.prisma.family.update({ where: { id: familyId }, data: dto });
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
