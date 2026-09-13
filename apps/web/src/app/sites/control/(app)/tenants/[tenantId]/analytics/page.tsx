import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge, Building, Calendar, Card, CardContent, CardHeader, CardTitle, PageHeader, StatCard, Users } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getPlatformSession, getPlatformTenant } from "@/lib/platform";
import { getTenantAnalytics } from "@/lib/analytics";
import { RegisterTenantName } from "@/features/platform/tenant-name-context";
import { GrowthChart } from "@/features/platform/growth-chart";

export default async function TenantAnalyticsPage({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params;
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const platformSession = await getPlatformSession();
  if (!platformSession) {
    redirect("/");
  }

  const [tenant, analytics] = await Promise.all([getPlatformTenant(tenantId), getTenantAnalytics(tenantId)]);
  if (!tenant || !analytics) {
    notFound();
  }

  return (
    <>
      <RegisterTenantName name={tenant.name} />
      <PageHeader title={`${tenant.name} — analytics`} description="Real, aggregated data for this Mahalle." />

      <div className="mb-6">
        <Link href={`/tenants/${tenantId}`} className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          &larr; Back to Mahalle settings
        </Link>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Members" value={analytics.counts.members} icon={<Users />} />
        <StatCard label="Families" value={analytics.counts.families} icon={<Building />} />
        <StatCard label="Events" value={analytics.counts.events} icon={<Calendar />} />
        <StatCard
          label="Feature adoption"
          value={`${analytics.featureAdoption.enabled} / ${analytics.featureAdoption.total}`}
          hint="Effective features in use"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Member growth</CardTitle>
          </CardHeader>
          <CardContent>
            <GrowthChart buckets={analytics.memberGrowth} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.subscription ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">{analytics.subscription.planName}</p>
                <Badge variant="outline">{analytics.subscription.status.replace("_", " ")}</Badge>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No plan assigned yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
