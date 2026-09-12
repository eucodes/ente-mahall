import { Injectable, NotFoundException } from "@nestjs/common";
import type { Member, Prisma } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import { FamiliesService } from "../families/families.service";
import type { CreateMemberDto } from "./dto/create-member.dto";
import type { UpdateMemberDto } from "./dto/update-member.dto";
import type { ListMembersQueryDto } from "./dto/list-members-query.dto";

const FAMILY_INCLUDE = { family: { select: { id: true, name: true } } } as const;

export type MemberWithFamily = Prisma.MemberGetPayload<{ include: typeof FAMILY_INCLUDE }>;

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

interface ActorContext {
  userId: string;
  tenantId: string;
}

/** DTOs carry dateOfBirth/movementDate as plain "YYYY-MM-DD" strings (from @IsDateString) — Prisma's DateTime columns need a real Date. */
function toMemberData<T extends { dateOfBirth?: string; movementDate?: string }>(dto: T) {
  return {
    ...dto,
    dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : dto.dateOfBirth,
    movementDate: dto.movementDate ? new Date(dto.movementDate) : dto.movementDate
  };
}

/**
 * Every method here takes tenantId explicitly and folds it into the query —
 * never just the record id. That's the object-level authorization Phase 4's
 * docs promised: even with a valid, guessable member id, a request scoped to
 * the wrong tenant finds nothing, because the WHERE clause never matches.
 */
@Injectable()
export class MembersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly familiesService: FamiliesService
  ) {}

  async list(
    tenantId: string,
    page: number,
    pageSize: number,
    filters: Pick<ListMembersQueryDto, "familyId" | "isYatheem" | "isExpatriate" | "bloodGroup" | "movementStatus"> = {}
  ): Promise<{ members: MemberWithFamily[]; total: number }> {
    const where: Prisma.MemberWhereInput = {
      tenantId,
      isActive: true,
      ...(filters.familyId ? { familyId: filters.familyId } : {}),
      ...(filters.isYatheem !== undefined ? { isYatheem: filters.isYatheem } : {}),
      ...(filters.isExpatriate !== undefined ? { isExpatriate: filters.isExpatriate } : {}),
      ...(filters.bloodGroup ? { bloodGroup: filters.bloodGroup } : {}),
      ...(filters.movementStatus ? { movementStatus: filters.movementStatus } : {})
    };
    const [members, total] = await Promise.all([
      this.prisma.member.findMany({
        where,
        orderBy: { fullName: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: FAMILY_INCLUDE
      }),
      this.prisma.member.count({ where })
    ]);
    return { members, total };
  }

  async findOne(tenantId: string, memberId: string): Promise<MemberWithFamily> {
    const member = await this.prisma.member.findFirst({
      where: { id: memberId, tenantId, isActive: true },
      include: FAMILY_INCLUDE
    });
    if (!member) {
      throw new NotFoundException("Member not found");
    }
    return member;
  }

  /** Throws if familyId is set but doesn't belong to this tenant — never trust a foreign key from the client without re-checking its tenant scope. */
  private async assertFamilyInTenant(tenantId: string, familyId: string | undefined): Promise<void> {
    if (familyId) {
      await this.familiesService.findOne(tenantId, familyId);
    }
  }

  /** Used by phone + OTP login — never throws on a miss, since "no such member" and "wrong phone format" both just mean login can't proceed. */
  findByPhone(tenantId: string, phone: string): Promise<Member | null> {
    return this.prisma.member.findFirst({ where: { tenantId, phone, isActive: true } });
  }

  async create(actor: ActorContext, dto: CreateMemberDto, context: RequestContext): Promise<MemberWithFamily> {
    await this.assertFamilyInTenant(actor.tenantId, dto.familyId);
    const member = await this.prisma.member.create({
      data: { ...toMemberData(dto), tenantId: actor.tenantId },
      include: FAMILY_INCLUDE
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "member.create",
      targetType: "Member",
      targetId: member.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return member;
  }

  async update(actor: ActorContext, memberId: string, dto: UpdateMemberDto, context: RequestContext): Promise<MemberWithFamily> {
    // findOne enforces the tenant scope before the update ever runs.
    await this.findOne(actor.tenantId, memberId);
    await this.assertFamilyInTenant(actor.tenantId, dto.familyId);
    const member = await this.prisma.member.update({
      where: { id: memberId },
      data: toMemberData(dto),
      include: FAMILY_INCLUDE
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "member.update",
      targetType: "Member",
      targetId: member.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return member;
  }

  async remove(actor: ActorContext, memberId: string, context: RequestContext): Promise<void> {
    await this.findOne(actor.tenantId, memberId);
    await this.prisma.member.update({
      where: { id: memberId },
      data: { isActive: false }
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "member.delete",
      targetType: "Member",
      targetId: memberId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }
}
