import { Injectable, NotFoundException } from "@nestjs/common";
import type { EventRegistration, Prisma } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import type { CreateEventRegistrationDto } from "./dto/create-event-registration.dto";
import type { UpdateEventRegistrationDto } from "./dto/update-event-registration.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}
interface ActorContext {
  userId: string;
  tenantId: string;
}

@Injectable()
export class EventRegistrationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  private async findEventOrThrow(tenantId: string, eventId: string) {
    const event = await this.prisma.event.findFirst({ where: { id: eventId, tenantId, isActive: true } });
    if (!event) throw new NotFoundException("Event not found");
    return event;
  }

  async list(tenantId: string, eventId: string): Promise<EventRegistration[]> {
    await this.findEventOrThrow(tenantId, eventId);
    return this.prisma.eventRegistration.findMany({ where: { tenantId, eventId }, orderBy: { createdAt: "asc" } });
  }

  private async findOrThrow(tenantId: string, id: string): Promise<EventRegistration> {
    const registration = await this.prisma.eventRegistration.findFirst({ where: { id, tenantId } });
    if (!registration) throw new NotFoundException("Registration not found");
    return registration;
  }

  async create(
    actor: ActorContext,
    eventId: string,
    dto: CreateEventRegistrationDto,
    context: RequestContext
  ): Promise<EventRegistration> {
    await this.findEventOrThrow(actor.tenantId, eventId);
    const registration = await this.prisma.eventRegistration.create({
      data: { ...dto, eventId, tenantId: actor.tenantId } as Prisma.EventRegistrationUncheckedCreateInput
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "events.registration.create",
      targetType: "EventRegistration",
      targetId: registration.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return registration;
  }

  async update(
    actor: ActorContext,
    id: string,
    dto: UpdateEventRegistrationDto,
    context: RequestContext
  ): Promise<EventRegistration> {
    await this.findOrThrow(actor.tenantId, id);
    const registration = await this.prisma.eventRegistration.update({ where: { id }, data: dto });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "events.registration.update",
      targetType: "EventRegistration",
      targetId: id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return registration;
  }

  async remove(actor: ActorContext, id: string, context: RequestContext): Promise<void> {
    await this.findOrThrow(actor.tenantId, id);
    await this.prisma.eventRegistration.delete({ where: { id } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "events.registration.delete",
      targetType: "EventRegistration",
      targetId: id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  /** Income/expenditure for one event — posted as ordinary Vouchers tagged with eventId (Principle 4: Finance owns all accounting records, Events never keep a parallel ledger). */
  async financeSummary(
    tenantId: string,
    eventId: string
  ): Promise<{ vouchers: unknown[]; totalIncome: string; totalExpense: string; net: string }> {
    await this.findEventOrThrow(tenantId, eventId);
    const vouchers = await this.prisma.voucher.findMany({
      where: { tenantId, eventId },
      orderBy: { date: "asc" },
      include: { account: true }
    });
    const totalIncome = vouchers
      .filter((v) => v.type === "RECEIPT")
      .reduce((sum, v) => sum + Number(v.amount), 0);
    const totalExpense = vouchers
      .filter((v) => v.type === "PAYMENT")
      .reduce((sum, v) => sum + Number(v.amount), 0);
    return { vouchers, totalIncome: totalIncome.toFixed(2), totalExpense: totalExpense.toFixed(2), net: (totalIncome - totalExpense).toFixed(2) };
  }
}
