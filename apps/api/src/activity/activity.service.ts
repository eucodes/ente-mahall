import { Injectable } from "@nestjs/common";
import type { Prisma } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";

const INCLUDE = { actor: { select: { id: true, fullName: true } } } as const;
export type ActivityEntry = Prisma.AuditLogGetPayload<{ include: typeof INCLUDE }>;

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async list(tenantId: string, page: number, pageSize: number): Promise<{ entries: ActivityEntry[]; total: number }> {
    const where = { tenantId };
    const [entries, total] = await Promise.all([
      this.prisma.auditLog.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize, include: INCLUDE }),
      this.prisma.auditLog.count({ where })
    ]);
    return { entries, total };
  }
}
