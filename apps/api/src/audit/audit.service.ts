import { Injectable } from "@nestjs/common";
import type { Prisma } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";

export interface AuditEntry {
  actorUserId?: string | null;
  tenantId?: string | null;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * The only code path allowed to write to AuditLog. Never exposes an update or
 * delete — the table is append-only by construction, not just by convention.
 */
@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async record(entry: AuditEntry): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        actorUserId: entry.actorUserId ?? null,
        tenantId: entry.tenantId ?? null,
        action: entry.action,
        targetType: entry.targetType,
        targetId: entry.targetId,
        metadata: entry.metadata as Prisma.InputJsonValue | undefined,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent
      }
    });
  }
}
