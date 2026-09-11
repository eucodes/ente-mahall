import { Injectable, NotFoundException } from "@nestjs/common";
import type { Announcement } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import type { CreateAnnouncementDto } from "./dto/create-announcement.dto";
import type { UpdateAnnouncementDto } from "./dto/update-announcement.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

interface ActorContext {
  userId: string;
  tenantId: string;
}

function toPrismaData(dto: Partial<CreateAnnouncementDto>) {
  const { publish, ...rest } = dto;
  return {
    ...rest,
    ...(publish !== undefined && { publishedAt: publish ? new Date() : null })
  };
}

/** Same tenant-scoping pattern as MembersService — see its comment for why. */
@Injectable()
export class AnnouncementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  async list(tenantId: string, page: number, pageSize: number): Promise<{ announcements: Announcement[]; total: number }> {
    const [announcements, total] = await Promise.all([
      this.prisma.announcement.findMany({
        where: { tenantId, isActive: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      this.prisma.announcement.count({ where: { tenantId, isActive: true } })
    ]);
    return { announcements, total };
  }

  async findOne(tenantId: string, announcementId: string): Promise<Announcement> {
    const announcement = await this.prisma.announcement.findFirst({
      where: { id: announcementId, tenantId, isActive: true }
    });
    if (!announcement) {
      throw new NotFoundException("Announcement not found");
    }
    return announcement;
  }

  async create(actor: ActorContext, dto: CreateAnnouncementDto, context: RequestContext): Promise<Announcement> {
    const announcement = await this.prisma.announcement.create({
      data: { title: dto.title, body: dto.body, tenantId: actor.tenantId, ...toPrismaData(dto) }
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "announcement.create",
      targetType: "Announcement",
      targetId: announcement.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return announcement;
  }

  async update(
    actor: ActorContext,
    announcementId: string,
    dto: UpdateAnnouncementDto,
    context: RequestContext
  ): Promise<Announcement> {
    await this.findOne(actor.tenantId, announcementId);
    const announcement = await this.prisma.announcement.update({
      where: { id: announcementId },
      data: toPrismaData(dto)
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "announcement.update",
      targetType: "Announcement",
      targetId: announcement.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return announcement;
  }

  async remove(actor: ActorContext, announcementId: string, context: RequestContext): Promise<void> {
    await this.findOne(actor.tenantId, announcementId);
    await this.prisma.announcement.update({ where: { id: announcementId }, data: { isActive: false } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "announcement.delete",
      targetType: "Announcement",
      targetId: announcementId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }
}
