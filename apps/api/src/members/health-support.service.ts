import { Injectable, NotFoundException } from "@nestjs/common";
import { HealthConditionStatus, Prisma, SupportStatus } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import type { MemberHealthProfileDto } from "./dto/member-health-profile.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

interface ActorContext {
  userId: string;
  tenantId: string;
}

@Injectable()
export class HealthSupportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  async getStats(tenantId: string) {
    const [
      totalProfiles,
      chronicCount,
      disabilityCount,
      assistanceCount,
      activeSupportCount,
      familiesSupportCount,
      medicationCount
    ] = await Promise.all([
      this.prisma.memberHealthProfile.count({
        where: { tenantId, member: { isActive: true } }
      }),
      this.prisma.memberHealthProfile.count({
        where: { tenantId, hasChronicIllness: true, member: { isActive: true } }
      }),
      this.prisma.memberHealthProfile.count({
        where: { tenantId, hasDisability: true, member: { isActive: true } }
      }),
      this.prisma.memberHealthProfile.count({
        where: { tenantId, requiresAssistance: true, member: { isActive: true } }
      }),
      this.prisma.memberHealthProfile.count({
        where: {
          tenantId,
          requiresCommunitySupport: true,
          supportStatus: SupportStatus.ACTIVE,
          member: { isActive: true }
        }
      }),
      this.prisma.family.count({
        where: {
          tenantId,
          requiresCommunitySupport: true,
          isActive: true
        }
      }),
      this.prisma.memberHealthProfile.count({
        where: {
          tenantId,
          regularMedicationRequired: true,
          member: { isActive: true }
        }
      })
    ]);

    return {
      totalProfiles,
      chronicCount,
      disabilityCount,
      assistanceCount,
      activeSupportCount,
      familiesSupportCount,
      medicationCount
    };
  }

  async listMembers(
    tenantId: string,
    query: {
      page?: number;
      pageSize?: number;
      search?: string;
      tab?: "all" | "welfare" | "chronic" | "disability" | "care";
    }
  ) {
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.max(1, Math.min(100, query.pageSize ?? 20));

    const healthFilter: Prisma.MemberHealthProfileWhereInput = {
      tenantId
    };

    if (query.tab === "welfare") {
      healthFilter.requiresCommunitySupport = true;
    } else if (query.tab === "chronic") {
      healthFilter.hasChronicIllness = true;
    } else if (query.tab === "disability") {
      healthFilter.hasDisability = true;
    } else if (query.tab === "care") {
      healthFilter.requiresAssistance = true;
    }

    const where: Prisma.MemberWhereInput = {
      tenantId,
      isActive: true,
      healthProfile: query.tab && query.tab !== "all"
        ? { is: healthFilter }
        : { isNot: null },
      ...(query.search
        ? {
            OR: [
              { fullName: { contains: query.search, mode: "insensitive" } },
              { phone: { contains: query.search, mode: "insensitive" } },
              { family: { name: { contains: query.search, mode: "insensitive" } } },
              { healthProfile: { chronicDetails: { contains: query.search, mode: "insensitive" } } },
              { healthProfile: { supportNotes: { contains: query.search, mode: "insensitive" } } }
            ]
          }
        : {})
    };

    const [members, total] = await Promise.all([
      this.prisma.member.findMany({
        where,
        orderBy: { fullName: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          family: { select: { id: true, name: true, phone: true } },
          healthProfile: true
        }
      }),
      this.prisma.member.count({ where })
    ]);

    return {
      members,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  async listFamilies(tenantId: string, query: { page?: number; pageSize?: number; search?: string }) {
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.max(1, Math.min(100, query.pageSize ?? 20));

    const where: Prisma.FamilyWhereInput = {
      tenantId,
      isActive: true,
      requiresCommunitySupport: true,
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: "insensitive" } },
              { phone: { contains: query.search, mode: "insensitive" } },
              { supportCategory: { contains: query.search, mode: "insensitive" } },
              { supportNotes: { contains: query.search, mode: "insensitive" } }
            ]
          }
        : {})
    };

    const [families, total] = await Promise.all([
      this.prisma.family.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          _count: { select: { members: true } }
        }
      }),
      this.prisma.family.count({ where })
    ]);

    return {
      families,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  async updateMemberHealthProfile(
    actor: ActorContext,
    memberId: string,
    dto: MemberHealthProfileDto,
    context: RequestContext
  ) {
    const member = await this.prisma.member.findFirst({
      where: { id: memberId, tenantId: actor.tenantId, isActive: true }
    });
    if (!member) {
      throw new NotFoundException("Member not found");
    }

    const updated = await this.prisma.memberHealthProfile.upsert({
      where: { memberId },
      create: {
        ...dto,
        memberId,
        tenantId: actor.tenantId
      },
      update: dto
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "health.profile.update",
      targetType: "MemberHealthProfile",
      targetId: updated.id,
      metadata: { memberId, memberName: member.fullName },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return updated;
  }

  async updateFamilySupport(
    actor: ActorContext,
    familyId: string,
    dto: {
      requiresCommunitySupport?: boolean;
      supportCategory?: string;
      supportStatus?: SupportStatus;
      supportNotes?: string;
      emergencyContactName?: string;
      emergencyContactPhone?: string;
    },
    context: RequestContext
  ) {
    const family = await this.prisma.family.findFirst({
      where: { id: familyId, tenantId: actor.tenantId, isActive: true }
    });
    if (!family) {
      throw new NotFoundException("Family not found");
    }

    const updated = await this.prisma.family.update({
      where: { id: familyId },
      data: dto
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "family.welfare.update",
      targetType: "Family",
      targetId: familyId,
      metadata: { familyName: family.name, ...dto },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return updated;
  }
}
