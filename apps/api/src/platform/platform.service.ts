import { Injectable } from "@nestjs/common";
import type { PlatformMembership } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";

export interface AuditLogQuery {
  page: number;
  pageSize: number;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  metadata: unknown;
  ipAddress: string | null;
  createdAt: Date;
  actor: { id: string; email: string; fullName: string } | null;
  tenant: { id: string; slug: string; name: string } | null;
}

@Injectable()
export class PlatformService {
  constructor(private readonly prisma: PrismaService) {}

  findActiveMembership(userId: string): Promise<PlatformMembership | null> {
    return this.prisma.platformMembership.findFirst({
      where: { userId, isActive: true }
    });
  }

  /** Platform staff see every tenant, unlike apps/api's tenant endpoints which are always scoped to the caller's own memberships. */
  async listAllTenants() {
    const tenants = await this.prisma.tenant.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { memberships: { where: { isActive: true } } } } }
    });
    return tenants.map((t) => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      isActive: t.isActive,
      createdAt: t.createdAt,
      memberCount: t._count.memberships
    }));
  }

  async listAuditLogs({ page, pageSize }: AuditLogQuery): Promise<{ entries: AuditLogEntry[]; total: number }> {
    const [rows, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          actor: { select: { id: true, email: true, fullName: true } },
          tenant: { select: { id: true, slug: true, name: true } }
        }
      }),
      this.prisma.auditLog.count()
    ]);

    const entries: AuditLogEntry[] = rows.map((row) => ({
      id: row.id,
      action: row.action,
      targetType: row.targetType,
      targetId: row.targetId,
      metadata: row.metadata,
      ipAddress: row.ipAddress,
      createdAt: row.createdAt,
      actor: row.actor,
      tenant: row.tenant
    }));

    return { entries, total };
  }
}
