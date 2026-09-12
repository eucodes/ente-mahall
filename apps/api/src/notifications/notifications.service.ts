import { Injectable } from "@nestjs/common";
import type { NotificationSettings } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import type { UpdateNotificationSettingsDto } from "./dto/update-notification-settings.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}
interface ActorContext {
  userId: string;
  tenantId: string;
}

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  /** Upserts on read so every tenant has a settings row without a migration-time backfill. */
  async get(tenantId: string): Promise<NotificationSettings> {
    return this.prisma.notificationSettings.upsert({
      where: { tenantId },
      create: { tenantId },
      update: {}
    });
  }

  async update(actor: ActorContext, dto: UpdateNotificationSettingsDto, context: RequestContext): Promise<NotificationSettings> {
    await this.get(actor.tenantId);
    const settings = await this.prisma.notificationSettings.update({ where: { tenantId: actor.tenantId }, data: dto });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "notifications.settings.update",
      targetType: "NotificationSettings",
      targetId: settings.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return settings;
  }
}
