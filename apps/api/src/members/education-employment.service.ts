import { Injectable } from "@nestjs/common";
import { EducationLevel, EmploymentStatus, Prisma } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class EducationEmploymentService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(tenantId: string) {
    const [totalMembers, employed, students, jobSeekers, expatriates, educationGroups, employmentGroups] = await Promise.all([
      this.prisma.member.count({ where: { tenantId, isActive: true } }),
      this.prisma.member.count({
        where: {
          tenantId,
          isActive: true,
          employmentStatus: {
            in: [
              EmploymentStatus.EMPLOYED,
              EmploymentStatus.SELF_EMPLOYED,
              EmploymentStatus.BUSINESS,
              EmploymentStatus.GOVERNMENT_SERVICE,
              EmploymentStatus.PRIVATE_SECTOR,
              EmploymentStatus.DAILY_WAGE
            ]
          }
        }
      }),
      this.prisma.member.count({
        where: {
          tenantId,
          isActive: true,
          OR: [
            { employmentStatus: EmploymentStatus.STUDENT },
            { educationLevel: { in: [EducationLevel.GRADUATE, EducationLevel.POST_GRADUATE, EducationLevel.DOCTORATE] } }
          ]
        }
      }),
      this.prisma.member.count({
        where: {
          tenantId,
          isActive: true,
          OR: [
            { isJobSeeker: true },
            { employmentStatus: EmploymentStatus.JOB_SEEKER }
          ]
        }
      }),
      this.prisma.member.count({
        where: { tenantId, isActive: true, isExpatriate: true }
      }),
      this.prisma.member.groupBy({
        by: ["educationLevel"],
        where: { tenantId, isActive: true, educationLevel: { not: null } },
        _count: { id: true }
      }),
      this.prisma.member.groupBy({
        by: ["employmentStatus"],
        where: { tenantId, isActive: true, employmentStatus: { not: null } },
        _count: { id: true }
      })
    ]);

    // Aggregate skills
    const membersWithSkills = await this.prisma.member.findMany({
      where: { tenantId, isActive: true, skills: { isEmpty: false } },
      select: { skills: true }
    });

    const skillCounts: Record<string, number> = {};
    for (const m of membersWithSkills) {
      for (const s of m.skills) {
        const trimmed = s.trim();
        if (trimmed) {
          skillCounts[trimmed] = (skillCounts[trimmed] ?? 0) + 1;
        }
      }
    }

    const topSkills = Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    return {
      totalMembers,
      employed,
      students,
      jobSeekers,
      expatriates,
      educationBreakdown: educationGroups.map((g) => ({
        level: g.educationLevel,
        count: g._count.id
      })),
      employmentBreakdown: employmentGroups.map((g) => ({
        status: g.employmentStatus,
        count: g._count.id
      })),
      topSkills
    };
  }

  async listMembers(
    tenantId: string,
    query: {
      page?: number;
      pageSize?: number;
      search?: string;
      status?: EmploymentStatus;
      level?: EducationLevel;
      isJobSeeker?: boolean;
      skill?: string;
    }
  ) {
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.max(1, Math.min(100, query.pageSize ?? 20));

    const where: Prisma.MemberWhereInput = {
      tenantId,
      isActive: true,
      ...(query.status ? { employmentStatus: query.status } : {}),
      ...(query.level ? { educationLevel: query.level } : {}),
      ...(query.isJobSeeker !== undefined ? { isJobSeeker: query.isJobSeeker } : {}),
      ...(query.skill ? { skills: { has: query.skill } } : {}),
      ...(query.search
        ? {
            OR: [
              { fullName: { contains: query.search, mode: "insensitive" } },
              { jobTitle: { contains: query.search, mode: "insensitive" } },
              { employerOrBusiness: { contains: query.search, mode: "insensitive" } },
              { educationDetails: { contains: query.search, mode: "insensitive" } },
              { institution: { contains: query.search, mode: "insensitive" } },
              { phone: { contains: query.search, mode: "insensitive" } }
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
          family: { select: { id: true, name: true } }
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
}
