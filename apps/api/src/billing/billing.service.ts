import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InvoiceStatus, SubscriptionStatus } from "@mahalle/types";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import type { RequestContext } from "../platform/platform.service";
import { CreatePlanDto } from "./dto/create-plan.dto";
import { UpdatePlanDto } from "./dto/update-plan.dto";
import { SetSubscriptionDto } from "./dto/set-subscription.dto";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { RecordPaymentDto } from "./dto/record-payment.dto";

export interface PlanSummary {
  id: string;
  key: string;
  name: string;
  description: string | null;
  priceMinor: number | null;
  currency: string;
  billingPeriod: string;
  userLimit: number | null;
  memberLimit: number | null;
  storageLimitMb: number | null;
  smsCredits: number | null;
  supportLevel: string | null;
  isActive: boolean;
  createdAt: Date;
  featureIds: string[];
  subscriberCount: number;
}

export interface SubscriptionSummary {
  id: string;
  status: string;
  trialEndsAt: Date | null;
  currentPeriodEnd: Date | null;
  cancelledAt: Date | null;
  createdAt: Date;
  plan: { id: string; key: string; name: string };
}

export interface InvoiceSummary {
  id: string;
  amountMinor: number;
  currency: string;
  status: string;
  description: string | null;
  issuedAt: Date | null;
  dueAt: Date | null;
  paidAt: Date | null;
  createdAt: Date;
}

export interface PaymentSummary {
  id: string;
  amountMinor: number;
  currency: string;
  method: string;
  reference: string | null;
  invoiceId: string | null;
  recordedAt: Date;
}

@Injectable()
export class BillingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  private serializePlan(plan: {
    id: string;
    key: string;
    name: string;
    description: string | null;
    priceMinor: number | null;
    currency: string;
    billingPeriod: string;
    userLimit: number | null;
    memberLimit: number | null;
    storageLimitMb: number | null;
    smsCredits: number | null;
    supportLevel: string | null;
    isActive: boolean;
    createdAt: Date;
    features: { featureId: string }[];
    _count: { subscriptions: number };
  }): PlanSummary {
    return {
      id: plan.id,
      key: plan.key,
      name: plan.name,
      description: plan.description,
      priceMinor: plan.priceMinor,
      currency: plan.currency,
      billingPeriod: plan.billingPeriod,
      userLimit: plan.userLimit,
      memberLimit: plan.memberLimit,
      storageLimitMb: plan.storageLimitMb,
      smsCredits: plan.smsCredits,
      supportLevel: plan.supportLevel,
      isActive: plan.isActive,
      createdAt: plan.createdAt,
      featureIds: plan.features.map((f) => f.featureId),
      subscriberCount: plan._count.subscriptions
    };
  }

  async listPlans(): Promise<PlanSummary[]> {
    const plans = await this.prisma.plan.findMany({
      orderBy: { createdAt: "asc" },
      include: { features: { select: { featureId: true } }, _count: { select: { subscriptions: true } } }
    });
    return plans.map((p) => this.serializePlan(p));
  }

  async createPlan(dto: CreatePlanDto, actorUserId: string, context: RequestContext): Promise<PlanSummary> {
    const existing = await this.prisma.plan.findUnique({ where: { key: dto.key } });
    if (existing) {
      throw new ConflictException("A plan with this key already exists");
    }

    const plan = await this.prisma.plan.create({
      data: { ...dto },
      include: { features: { select: { featureId: true } }, _count: { select: { subscriptions: true } } }
    });

    await this.audit.record({
      actorUserId,
      tenantId: null,
      action: "platform.plan.create",
      targetType: "Plan",
      targetId: plan.id,
      metadata: { key: plan.key, name: plan.name },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return this.serializePlan(plan);
  }

  private async findPlanOrThrow(planId: string) {
    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) {
      throw new NotFoundException("Plan not found");
    }
    return plan;
  }

  async updatePlan(planId: string, dto: UpdatePlanDto, actorUserId: string, context: RequestContext): Promise<PlanSummary> {
    const existing = await this.findPlanOrThrow(planId);
    const plan = await this.prisma.plan.update({
      where: { id: planId },
      data: dto,
      include: { features: { select: { featureId: true } }, _count: { select: { subscriptions: true } } }
    });

    await this.audit.record({
      actorUserId,
      tenantId: null,
      action: "platform.plan.update",
      targetType: "Plan",
      targetId: planId,
      metadata: { key: existing.key, changes: dto },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return this.serializePlan(plan);
  }

  async deletePlan(planId: string, actorUserId: string, context: RequestContext): Promise<void> {
    const plan = await this.findPlanOrThrow(planId);
    const subscriberCount = await this.prisma.subscription.count({ where: { planId } });
    if (subscriberCount > 0) {
      throw new BadRequestException("Can't delete a plan with active subscribers — move them to another plan first");
    }

    await this.prisma.plan.delete({ where: { id: planId } });

    await this.audit.record({
      actorUserId,
      tenantId: null,
      action: "platform.plan.delete",
      targetType: "Plan",
      targetId: planId,
      metadata: { key: plan.key, name: plan.name },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  async setPlanFeatures(
    planId: string,
    featureIds: string[],
    actorUserId: string,
    context: RequestContext
  ): Promise<PlanSummary> {
    const plan = await this.findPlanOrThrow(planId);

    if (featureIds.length > 0) {
      const found = await this.prisma.feature.count({ where: { id: { in: featureIds } } });
      if (found !== featureIds.length) {
        throw new BadRequestException("One or more selected features don't exist");
      }
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.planFeature.deleteMany({ where: { planId } });
      if (featureIds.length > 0) {
        await tx.planFeature.createMany({ data: featureIds.map((featureId) => ({ planId, featureId })) });
      }
    });

    await this.audit.record({
      actorUserId,
      tenantId: null,
      action: "platform.plan.entitlements_update",
      targetType: "Plan",
      targetId: planId,
      metadata: { key: plan.key, featureIds },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    const updated = await this.prisma.plan.findUniqueOrThrow({
      where: { id: planId },
      include: { features: { select: { featureId: true } }, _count: { select: { subscriptions: true } } }
    });
    return this.serializePlan(updated);
  }

  async getTenantSubscription(tenantId: string): Promise<SubscriptionSummary | null> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
      include: { plan: { select: { id: true, key: true, name: true } } }
    });
    if (!subscription) return null;
    return {
      id: subscription.id,
      status: subscription.status,
      trialEndsAt: subscription.trialEndsAt,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelledAt: subscription.cancelledAt,
      createdAt: subscription.createdAt,
      plan: subscription.plan
    };
  }

  /** Assigns or changes a Mahalle's plan. Creates the subscription if none exists yet. */
  async setTenantSubscription(
    tenantId: string,
    dto: SetSubscriptionDto,
    actorUserId: string,
    context: RequestContext
  ): Promise<SubscriptionSummary> {
    const [tenant, plan] = await Promise.all([
      this.prisma.tenant.findUnique({ where: { id: tenantId } }),
      this.findPlanOrThrow(dto.planId)
    ]);
    if (!tenant) {
      throw new NotFoundException("Mahalle not found");
    }

    const subscription = await this.prisma.subscription.upsert({
      where: { tenantId },
      create: { tenantId, planId: dto.planId, status: dto.status ?? "TRIAL" },
      update: { planId: dto.planId, ...(dto.status ? { status: dto.status } : {}) },
      include: { plan: { select: { id: true, key: true, name: true } } }
    });

    await this.audit.record({
      actorUserId,
      tenantId,
      action: "platform.subscription.set_plan",
      targetType: "Subscription",
      targetId: subscription.id,
      metadata: { planKey: plan.key, status: subscription.status },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return {
      id: subscription.id,
      status: subscription.status,
      trialEndsAt: subscription.trialEndsAt,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelledAt: subscription.cancelledAt,
      createdAt: subscription.createdAt,
      plan: subscription.plan
    };
  }

  async updateSubscriptionStatus(
    tenantId: string,
    status: SubscriptionStatus,
    actorUserId: string,
    context: RequestContext
  ): Promise<SubscriptionSummary> {
    const existing = await this.prisma.subscription.findUnique({ where: { tenantId } });
    if (!existing) {
      throw new NotFoundException("This Mahalle has no subscription yet — assign a plan first");
    }

    const subscription = await this.prisma.subscription.update({
      where: { tenantId },
      data: {
        status,
        cancelledAt: status === SubscriptionStatus.CANCELLED ? new Date() : existing.cancelledAt
      },
      include: { plan: { select: { id: true, key: true, name: true } } }
    });

    await this.audit.record({
      actorUserId,
      tenantId,
      action: "platform.subscription.status_change",
      targetType: "Subscription",
      targetId: subscription.id,
      metadata: { from: existing.status, to: status },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return {
      id: subscription.id,
      status: subscription.status,
      trialEndsAt: subscription.trialEndsAt,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelledAt: subscription.cancelledAt,
      createdAt: subscription.createdAt,
      plan: subscription.plan
    };
  }

  async listInvoices(tenantId: string): Promise<InvoiceSummary[]> {
    const invoices = await this.prisma.invoice.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" } });
    return invoices;
  }

  async createInvoice(
    tenantId: string,
    dto: CreateInvoiceDto,
    actorUserId: string,
    context: RequestContext
  ): Promise<InvoiceSummary> {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      throw new NotFoundException("Mahalle not found");
    }
    const subscription = await this.prisma.subscription.findUnique({ where: { tenantId } });

    const invoice = await this.prisma.invoice.create({
      data: {
        tenantId,
        subscriptionId: subscription?.id,
        amountMinor: dto.amountMinor,
        description: dto.description,
        dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined,
        status: InvoiceStatus.ISSUED,
        issuedAt: new Date()
      }
    });

    await this.audit.record({
      actorUserId,
      tenantId,
      action: "platform.invoice.create",
      targetType: "Invoice",
      targetId: invoice.id,
      metadata: { amountMinor: invoice.amountMinor },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return invoice;
  }

  /** Marks an invoice paid and records the corresponding manual payment in one step. */
  async markInvoicePaid(invoiceId: string, actorUserId: string, context: RequestContext): Promise<InvoiceSummary> {
    const existing = await this.prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!existing) {
      throw new NotFoundException("Invoice not found");
    }
    if (existing.status === InvoiceStatus.PAID) {
      throw new BadRequestException("This invoice is already marked paid");
    }
    if (existing.status === InvoiceStatus.VOID) {
      throw new BadRequestException("Can't mark a voided invoice as paid");
    }

    const [invoice] = await this.prisma.$transaction([
      this.prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: InvoiceStatus.PAID, paidAt: new Date() }
      }),
      this.prisma.payment.create({
        data: {
          tenantId: existing.tenantId,
          invoiceId,
          amountMinor: existing.amountMinor,
          currency: existing.currency,
          method: "manual"
        }
      })
    ]);

    await this.audit.record({
      actorUserId,
      tenantId: existing.tenantId,
      action: "platform.invoice.mark_paid",
      targetType: "Invoice",
      targetId: invoiceId,
      metadata: { amountMinor: existing.amountMinor },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return invoice;
  }

  async voidInvoice(invoiceId: string, actorUserId: string, context: RequestContext): Promise<InvoiceSummary> {
    const existing = await this.prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!existing) {
      throw new NotFoundException("Invoice not found");
    }
    if (existing.status === InvoiceStatus.PAID) {
      throw new BadRequestException("Can't void a paid invoice");
    }

    const invoice = await this.prisma.invoice.update({ where: { id: invoiceId }, data: { status: InvoiceStatus.VOID } });

    await this.audit.record({
      actorUserId,
      tenantId: existing.tenantId,
      action: "platform.invoice.void",
      targetType: "Invoice",
      targetId: invoiceId,
      metadata: { amountMinor: existing.amountMinor },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return invoice;
  }

  async listPayments(tenantId: string): Promise<PaymentSummary[]> {
    const payments = await this.prisma.payment.findMany({ where: { tenantId }, orderBy: { recordedAt: "desc" } });
    return payments;
  }

  /** A standalone payment not tied to a specific invoice (e.g. an advance payment). */
  async recordPayment(
    tenantId: string,
    dto: RecordPaymentDto,
    actorUserId: string,
    context: RequestContext
  ): Promise<PaymentSummary> {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      throw new NotFoundException("Mahalle not found");
    }

    const payment = await this.prisma.payment.create({
      data: {
        tenantId,
        invoiceId: dto.invoiceId,
        amountMinor: dto.amountMinor,
        method: dto.method,
        reference: dto.reference
      }
    });

    await this.audit.record({
      actorUserId,
      tenantId,
      action: "platform.payment.record",
      targetType: "Payment",
      targetId: payment.id,
      metadata: { amountMinor: payment.amountMinor, method: payment.method },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return payment;
  }
}
