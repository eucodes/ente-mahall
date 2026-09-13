import { Injectable, NotFoundException } from "@nestjs/common";
import { InvoiceStatus } from "@mahalle/types";
import { PrismaService } from "../database/prisma.service";
import { FeaturesService } from "../features/features.service";

export interface MonthBucket {
  month: string; // "2026-04"
  count: number;
}

export interface ModuleAdoption {
  featureId: string;
  key: string;
  name: string;
  category: string | null;
  tenantsEnabled: number;
  totalTenants: number;
  adoptionPct: number;
}

export interface PlatformOverview {
  tenants: { total: number; active: number; suspended: number; newLast30Days: number };
  members: { total: number; newLast30Days: number };
  families: { total: number };
  platformAdmins: { total: number };
  events: { total: number; upcoming: number };
  subscriptionsByStatus: Record<string, number>;
  revenue: { last30DaysMinor: number; allTimeMinor: number; currency: string };
  outstandingInvoices: { count: number; amountMinor: number };
  moduleAdoption: ModuleAdoption[];
}

export interface TenantAnalytics {
  tenantId: string;
  counts: { members: number; families: number; events: number; announcements: number; programs: number; admins: number };
  memberGrowth: MonthBucket[];
  subscription: { planName: string; status: string } | null;
  featureAdoption: { enabled: number; total: number };
}

function monthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function bucketByMonth(dates: Date[], months: number): MonthBucket[] {
  const now = new Date();
  const buckets = new Map<string, number>();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    buckets.set(monthKey(d), 0);
  }
  for (const date of dates) {
    const key = monthKey(date);
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }
  return Array.from(buckets.entries()).map(([month, count]) => ({ month, count }));
}

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly featuresService: FeaturesService
  ) {}

  async getPlatformOverview(): Promise<PlatformOverview> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const now = new Date();

    const [
      totalTenants,
      activeTenants,
      newTenants,
      totalMembers,
      newMembers,
      totalFamilies,
      totalAdmins,
      totalEvents,
      upcomingEvents,
      subscriptions,
      revenueLast30Days,
      revenueAllTime,
      outstandingInvoices,
      features,
      allTenantIds
    ] = await Promise.all([
      this.prisma.tenant.count(),
      this.prisma.tenant.count({ where: { isActive: true } }),
      this.prisma.tenant.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      this.prisma.member.count({ where: { isActive: true } }),
      this.prisma.member.count({ where: { isActive: true, createdAt: { gte: thirtyDaysAgo } } }),
      this.prisma.family.count(),
      this.prisma.platformMembership.count({ where: { isActive: true } }),
      this.prisma.event.count(),
      this.prisma.event.count({ where: { startsAt: { gte: now } } }),
      this.prisma.subscription.groupBy({ by: ["status"], _count: { _all: true } }),
      this.prisma.payment.aggregate({ _sum: { amountMinor: true }, where: { recordedAt: { gte: thirtyDaysAgo } } }),
      this.prisma.payment.aggregate({ _sum: { amountMinor: true } }),
      this.prisma.invoice.aggregate({
        _sum: { amountMinor: true },
        _count: { _all: true },
        where: { status: { in: [InvoiceStatus.ISSUED, InvoiceStatus.OVERDUE] } }
      }),
      this.prisma.feature.findMany(),
      this.prisma.tenant.findMany({ select: { id: true } })
    ]);

    const [overrides, planEntitlements] = await Promise.all([
      this.prisma.tenantFeatureOverride.findMany(),
      this.prisma.subscription.findMany({ include: { plan: { include: { features: true } } } })
    ]);

    const overridesByFeature = new Map<string, Map<string, boolean>>();
    for (const o of overrides) {
      if (!overridesByFeature.has(o.featureId)) overridesByFeature.set(o.featureId, new Map());
      overridesByFeature.get(o.featureId)!.set(o.tenantId, o.isEnabled);
    }
    const planEntitledFeaturesByTenant = new Map<string, Set<string>>();
    for (const sub of planEntitlements) {
      planEntitledFeaturesByTenant.set(sub.tenantId, new Set(sub.plan.features.map((f) => f.featureId)));
    }

    const totalTenantsCount = allTenantIds.length;
    const moduleAdoption: ModuleAdoption[] = features.map((f) => {
      let enabledCount = 0;
      if (f.isEnabledGlobally) {
        for (const { id: tenantId } of allTenantIds) {
          const planEntitled = planEntitledFeaturesByTenant.has(tenantId)
            ? planEntitledFeaturesByTenant.get(tenantId)!.has(f.id)
            : true;
          if (!planEntitled) continue;
          const override = overridesByFeature.get(f.id)?.get(tenantId) ?? null;
          if (override ?? true) enabledCount++;
        }
      }
      return {
        featureId: f.id,
        key: f.key,
        name: f.name,
        category: f.category,
        tenantsEnabled: enabledCount,
        totalTenants: totalTenantsCount,
        adoptionPct: totalTenantsCount === 0 ? 0 : Math.round((enabledCount / totalTenantsCount) * 100)
      };
    });

    const subscriptionsByStatus: Record<string, number> = {};
    for (const row of subscriptions) {
      subscriptionsByStatus[row.status] = row._count._all;
    }

    return {
      tenants: { total: totalTenants, active: activeTenants, suspended: totalTenants - activeTenants, newLast30Days: newTenants },
      members: { total: totalMembers, newLast30Days: newMembers },
      families: { total: totalFamilies },
      platformAdmins: { total: totalAdmins },
      events: { total: totalEvents, upcoming: upcomingEvents },
      subscriptionsByStatus,
      revenue: {
        last30DaysMinor: revenueLast30Days._sum.amountMinor ?? 0,
        allTimeMinor: revenueAllTime._sum.amountMinor ?? 0,
        currency: "INR"
      },
      outstandingInvoices: {
        count: outstandingInvoices._count._all,
        amountMinor: outstandingInvoices._sum.amountMinor ?? 0
      },
      moduleAdoption
    };
  }

  async getMahalleGrowth(months: number): Promise<MonthBucket[]> {
    const cutoff = new Date();
    cutoff.setUTCMonth(cutoff.getUTCMonth() - (months - 1));
    cutoff.setUTCDate(1);
    const tenants = await this.prisma.tenant.findMany({
      where: { createdAt: { gte: cutoff } },
      select: { createdAt: true }
    });
    return bucketByMonth(
      tenants.map((t) => t.createdAt),
      months
    );
  }

  async getTenantAnalytics(tenantId: string): Promise<TenantAnalytics> {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      throw new NotFoundException("Mahalle not found");
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setUTCMonth(sixMonthsAgo.getUTCMonth() - 5);
    sixMonthsAgo.setUTCDate(1);

    const [
      memberCount,
      familyCount,
      eventCount,
      announcementCount,
      programCount,
      adminCount,
      newMembers,
      subscription,
      tenantFeatures
    ] = await Promise.all([
      this.prisma.member.count({ where: { tenantId, isActive: true } }),
      this.prisma.family.count({ where: { tenantId } }),
      this.prisma.event.count({ where: { tenantId } }),
      this.prisma.announcement.count({ where: { tenantId } }),
      this.prisma.program.count({ where: { tenantId } }),
      this.prisma.tenantMembership.count({ where: { tenantId, isActive: true } }),
      this.prisma.member.findMany({
        where: { tenantId, isActive: true, createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true }
      }),
      this.prisma.subscription.findUnique({ where: { tenantId }, include: { plan: { select: { name: true } } } }),
      this.featuresService.getTenantFeatures(tenantId)
    ]);

    return {
      tenantId,
      counts: {
        members: memberCount,
        families: familyCount,
        events: eventCount,
        announcements: announcementCount,
        programs: programCount,
        admins: adminCount
      },
      memberGrowth: bucketByMonth(
        newMembers.map((m) => m.createdAt),
        6
      ),
      subscription: subscription ? { planName: subscription.plan.name, status: subscription.status } : null,
      featureAdoption: {
        enabled: tenantFeatures.filter((f) => f.effective).length,
        total: tenantFeatures.length
      }
    };
  }
}
