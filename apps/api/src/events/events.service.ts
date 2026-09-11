import { Injectable, NotFoundException } from "@nestjs/common";
import type { Event as MahalleEvent, Prisma } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import type { CreateEventDto } from "./dto/create-event.dto";
import type { UpdateEventDto } from "./dto/update-event.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

interface ActorContext {
  userId: string;
  tenantId: string;
}

function toPrismaData(dto: Partial<CreateEventDto>) {
  const { startsAt, endsAt, ...rest } = dto;
  return {
    ...rest,
    ...(startsAt !== undefined && { startsAt: new Date(startsAt) }),
    ...(endsAt !== undefined && { endsAt: endsAt ? new Date(endsAt) : null })
  } satisfies Prisma.EventUpdateInput;
}

/** Same tenant-scoping pattern as MembersService — see its comment for why. */
@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  async list(tenantId: string, page: number, pageSize: number): Promise<{ events: MahalleEvent[]; total: number }> {
    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where: { tenantId, isActive: true },
        orderBy: { startsAt: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      this.prisma.event.count({ where: { tenantId, isActive: true } })
    ]);
    return { events, total };
  }

  async findOne(tenantId: string, eventId: string): Promise<MahalleEvent> {
    const event = await this.prisma.event.findFirst({ where: { id: eventId, tenantId, isActive: true } });
    if (!event) {
      throw new NotFoundException("Event not found");
    }
    return event;
  }

  async create(actor: ActorContext, dto: CreateEventDto, context: RequestContext): Promise<MahalleEvent> {
    const event = await this.prisma.event.create({
      data: { ...toPrismaData(dto), tenantId: actor.tenantId } as Prisma.EventUncheckedCreateInput
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "event.create",
      targetType: "Event",
      targetId: event.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return event;
  }

  async update(actor: ActorContext, eventId: string, dto: UpdateEventDto, context: RequestContext): Promise<MahalleEvent> {
    await this.findOne(actor.tenantId, eventId);
    const event = await this.prisma.event.update({ where: { id: eventId }, data: toPrismaData(dto) });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "event.update",
      targetType: "Event",
      targetId: event.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return event;
  }

  async remove(actor: ActorContext, eventId: string, context: RequestContext): Promise<void> {
    await this.findOne(actor.tenantId, eventId);
    await this.prisma.event.update({ where: { id: eventId }, data: { isActive: false } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "event.delete",
      targetType: "Event",
      targetId: eventId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }
}
