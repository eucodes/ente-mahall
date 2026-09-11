import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Badge,
  Building,
  Card,
  CardContent,
  EmptyState,
  ScrollText,
  ShieldCheck,
  StatCard,
  Users
} from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getAllTenants, getAuditLogs, getPlatformSession } from "@/lib/platform";

export default async function ControlPlaneHomePage() {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const platformSession = await getPlatformSession();

  if (!platformSession) {
    return (
      <Card>
        <CardContent className="p-0">
          <EmptyState
            title="Access denied"
            description={`${user.email} does not have a PlatformMembership. This is a completely separate authorization system from tenant roles — being an OWNER or ADMIN of any Mahalle grants no access here.`}
          />
        </CardContent>
      </Card>
    );
  }

  const [tenants, { entries: recentAuditEntries }] = await Promise.all([getAllTenants(), getAuditLogs(1, 5)]);
  const activeCount = tenants.filter((t) => t.isActive).length;
  const totalMembers = tenants.reduce((sum, t) => sum + t.memberCount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-xl bg-card p-6 shadow-xs">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-sidebar-accent/30 blur-3xl"
        />
        <div className="relative flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Level-0 root node
            </Badge>
            <Badge variant="destructive">Every action audited</Badge>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary">Platform overview</h1>
          <p className="text-sm text-muted-foreground">
            Signed in as {user.email} &middot; {platformSession.role}
          </p>
        </div>

        <div className="relative mt-6 grid gap-4 rounded-lg bg-muted/50 p-4 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-card text-primary shadow-xs">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold leading-tight text-primary">{tenants.length}</p>
              <p className="text-xs text-muted-foreground">Commissioned Mahalles</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-card text-primary shadow-xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold leading-tight text-primary">
                {activeCount} <span className="text-xs font-normal text-muted-foreground">/ {tenants.length} active</span>
              </p>
              <p className="text-xs text-muted-foreground">Fleet standing</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-card text-primary shadow-xs">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold leading-tight text-primary">{totalMembers}</p>
              <p className="text-xs text-muted-foreground">Community members, statewide</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Mahalles" value={tenants.length} icon={<Building />} tone="violet" />
        <StatCard label="Active" value={activeCount} hint={`${tenants.length - activeCount} inactive`} tone="blue" />
        <StatCard label="Total members" value={totalMembers} tone="teal" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between p-6 pb-0">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recent Mahalles</p>
              <h2 className="text-lg font-semibold">Latest commissioned tenants</h2>
            </div>
            <Link href="/tenants" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <CardContent>
            {tenants.length === 0 ? (
              <EmptyState title="No Mahalles yet" />
            ) : (
              <ul className="divide-y divide-border">
                {tenants.slice(0, 5).map((tenant) => (
                  <li key={tenant.id} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                        {tenant.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{tenant.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {tenant.slug} &middot; {tenant.memberCount} members
                        </p>
                      </div>
                    </div>
                    <Badge variant={tenant.isActive ? "success" : "outline"}>{tenant.isActive ? "Active" : "Suspended"}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-6 pb-0">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Compliance</p>
              <h2 className="text-lg font-semibold">Recent activity</h2>
            </div>
            <Link href="/audit-logs" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              <ScrollText className="h-3.5 w-3.5" />
            </Link>
          </div>
          <CardContent>
            {recentAuditEntries.length === 0 ? (
              <EmptyState title="No activity yet" />
            ) : (
              <ul className="space-y-3">
                {recentAuditEntries.map((entry) => (
                  <li key={entry.id} className="flex items-start gap-2.5">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sidebar-accent" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{entry.action}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {entry.actor?.email ?? "system"} &middot; {new Date(entry.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
