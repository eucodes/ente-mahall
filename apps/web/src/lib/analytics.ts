import "server-only";
import { serverApiGet } from "./server-api";

export interface MonthBucket {
  month: string;
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

const EMPTY_OVERVIEW: PlatformOverview = {
  tenants: { total: 0, active: 0, suspended: 0, newLast30Days: 0 },
  members: { total: 0, newLast30Days: 0 },
  families: { total: 0 },
  platformAdmins: { total: 0 },
  events: { total: 0, upcoming: 0 },
  subscriptionsByStatus: {},
  revenue: { last30DaysMinor: 0, allTimeMinor: 0, currency: "INR" },
  outstandingInvoices: { count: 0, amountMinor: 0 },
  moduleAdoption: []
};

export async function getPlatformOverview(): Promise<PlatformOverview> {
  const { status, body } = await serverApiGet<{ overview: PlatformOverview }>("/platform/analytics/overview");
  if (status !== 200 || !body.success || !body.data) return EMPTY_OVERVIEW;
  return body.data.overview;
}

export async function getMahalleGrowth(months = 6): Promise<MonthBucket[]> {
  const { status, body } = await serverApiGet<{ growth: MonthBucket[] }>(`/platform/analytics/mahalle-growth?months=${months}`);
  if (status !== 200 || !body.success || !body.data) return [];
  return body.data.growth;
}

export async function getTenantAnalytics(tenantId: string): Promise<TenantAnalytics | null> {
  const { status, body } = await serverApiGet<{ analytics: TenantAnalytics }>(
    `/platform/tenants/${encodeURIComponent(tenantId)}/analytics`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.analytics;
}
