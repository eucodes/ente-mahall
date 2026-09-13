import { redirect } from "next/navigation";
import {
  Badge,
  Building,
  Calendar,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  PageHeader,
  StatCard,
  TrendingUp,
  Users,
  Wallet
} from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getPlatformSession } from "@/lib/platform";
import { getPlatformOverview, getMahalleGrowth } from "@/lib/analytics";
import { GrowthChart } from "@/features/platform/growth-chart";
import { ModuleAdoptionList } from "@/features/platform/module-adoption-list";

function formatCurrency(amountMinor: number, currency: string) {
  return (amountMinor / 100).toLocaleString("en-IN", { style: "currency", currency, maximumFractionDigits: 0 });
}

export default async function AnalyticsPage() {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const platformSession = await getPlatformSession();
  if (!platformSession) {
    redirect("/");
  }

  const [overview, growth] = await Promise.all([getPlatformOverview(), getMahalleGrowth(6)]);

  return (
    <>
      <PageHeader title="Analytics" description="Real, aggregated platform metrics — nothing here is fabricated." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Mahalles"
          value={overview.tenants.total}
          icon={<Building />}
          hint={`${overview.tenants.active} active · ${overview.tenants.suspended} suspended`}
          trend={{ value: `+${overview.tenants.newLast30Days}`, positive: true, label: "last 30 days" }}
        />
        <StatCard
          label="Members"
          value={overview.members.total.toLocaleString("en-IN")}
          icon={<Users />}
          trend={{ value: `+${overview.members.newLast30Days}`, positive: true, label: "last 30 days" }}
        />
        <StatCard label="Events" value={overview.events.total} icon={<Calendar />} hint={`${overview.events.upcoming} upcoming`} />
        <StatCard
          label="Revenue (30d)"
          value={formatCurrency(overview.revenue.last30DaysMinor, overview.revenue.currency)}
          icon={<Wallet />}
          hint={`${formatCurrency(overview.revenue.allTimeMinor, overview.revenue.currency)} all-time`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Mahalle growth</CardTitle>
          </CardHeader>
          <CardContent>
            <GrowthChart buckets={growth} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Subscriptions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.keys(overview.subscriptionsByStatus).length === 0 ? (
              <p className="text-sm text-muted-foreground">No subscriptions yet.</p>
            ) : (
              Object.entries(overview.subscriptionsByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between text-sm">
                  <Badge variant="outline">{status.replace("_", " ")}</Badge>
                  <span className="font-medium">{count}</span>
                </div>
              ))
            )}
            {overview.outstandingInvoices.count > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                {overview.outstandingInvoices.count} outstanding invoice
                {overview.outstandingInvoices.count === 1 ? "" : "s"} totalling{" "}
                {formatCurrency(overview.outstandingInvoices.amountMinor, overview.revenue.currency)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Module adoption</CardTitle>
        </CardHeader>
        <CardContent>
          <ModuleAdoptionList modules={overview.moduleAdoption} />
        </CardContent>
      </Card>
    </>
  );
}
