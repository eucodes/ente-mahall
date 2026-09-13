import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Badge,
  Building,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CheckCircle2,
  Clock,
  CreditCard,
  EmptyState,
  FileText,
  Layers,
  LayoutGrid,
  ScrollText,
  Settings,
  ShieldCheck,
  Sparkles,
  StatCard,
  Users,
  Wallet
} from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getAllTenants, getAuditLogs, getPlatformSession, getSystemStatus } from "@/lib/platform";
import { getPlatformOverview } from "@/lib/analytics";
import { ROOT_DOMAIN } from "@/lib/env";

function formatCurrency(amountMinor: number, currency: string) {
  return (amountMinor / 100).toLocaleString("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  });
}

export default async function ControlPlaneHomePage() {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const platformSession = await getPlatformSession();

  if (!platformSession) {
    return (
      <Card className="rounded-3xl border-border/80 shadow-md">
        <CardContent className="p-12 text-center">
          <EmptyState
            title="Platform Root Access Denied"
            description={`${user.email} does not possess a PlatformMembership credential. This is isolated from individual Mahalle tenant roles.`}
          />
        </CardContent>
      </Card>
    );
  }

  const [tenants, { entries: recentAuditEntries }, overview, systemStatus] = await Promise.all([
    getAllTenants(),
    getAuditLogs(1, 7),
    getPlatformOverview(),
    getSystemStatus()
  ]);

  const activeCount = tenants.filter((t) => t.isActive).length;
  const suspendedCount = tenants.length - activeCount;
  const totalMembers = tenants.reduce((sum, t) => sum + t.memberCount, 0);

  return (
    <div className="space-y-6">
      {/* Control Plane Hero Command Center Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-red-500/20 text-red-300 border-red-500/30 gap-1.5 font-bold text-[11px] uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5" /> Level-0 Root Command Plane
              </Badge>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs font-semibold text-slate-400 font-mono">
                {ROOT_DOMAIN}
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Cluster Healthy
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Platform Fleet Command Center
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Global governance across all multi-tenant Mahalle instances. Fleet health telemetry, security compliance stream, feature toggles, and platform billing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/tenants"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2.5 text-xs font-bold text-white transition-colors"
            >
              <Building className="h-3.5 w-3.5" />
              Manage All Fleet
            </Link>
            <Link
              href="/audit-logs"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition-colors shadow-sm"
            >
              <ScrollText className="h-3.5 w-3.5" />
              Audit Stream
            </Link>
          </div>
        </div>

        {/* Decorative ambient gradients */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Fleet Telemetry Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Mahalles"
          value={tenants.length}
          icon={<Building />}
          tone="default"
          hint={`${activeCount} active · ${suspendedCount} suspended`}
          trend={{ value: `+${overview.tenants.newLast30Days}`, positive: true, label: "last 30d" }}
        />
        <StatCard
          label="Active Fleet Status"
          value={`${Math.round((activeCount / (tenants.length || 1)) * 100)}%`}
          icon={<ShieldCheck />}
          tone="green"
          hint={`${activeCount} operational instances`}
        />
        <StatCard
          label="Statewide Members"
          value={totalMembers.toLocaleString("en-IN")}
          icon={<Users />}
          tone="teal"
          hint="Across all jurisdictions"
          trend={{ value: `+${overview.members.newLast30Days}`, positive: true, label: "last 30d" }}
        />
        <StatCard
          label="Platform Revenue (30d)"
          value={formatCurrency(overview.revenue.last30DaysMinor, overview.revenue.currency)}
          icon={<Wallet />}
          tone="amber"
          hint={`${formatCurrency(overview.revenue.allTimeMinor, overview.revenue.currency)} all-time`}
        />
      </div>

      {/* Quick Action Navigation Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/tenants"
          className="p-4 rounded-2xl border border-border/80 bg-card hover:bg-muted/40 transition-colors group shadow-xs"
        >
          <div className="flex items-center justify-between">
            <Building className="h-4 w-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
          </div>
          <p className="font-bold text-xs text-foreground mt-2">Fleet Directory</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Provision &amp; configure Mahalles</p>
        </Link>

        <Link
          href="/analytics"
          className="p-4 rounded-2xl border border-border/80 bg-card hover:bg-muted/40 transition-colors group shadow-xs"
        >
          <div className="flex items-center justify-between">
            <LayoutGrid className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
          </div>
          <p className="font-bold text-xs text-foreground mt-2">Platform Analytics</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Demographics &amp; growth trends</p>
        </Link>

        <Link
          href="/plans"
          className="p-4 rounded-2xl border border-border/80 bg-card hover:bg-muted/40 transition-colors group shadow-xs"
        >
          <div className="flex items-center justify-between">
            <CreditCard className="h-4 w-4 text-amber-600 group-hover:scale-110 transition-transform" />
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
          </div>
          <p className="font-bold text-xs text-foreground mt-2">Plans &amp; Billing</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Pricing tiers &amp; subscriptions</p>
        </Link>

        <Link
          href="/audit-logs"
          className="p-4 rounded-2xl border border-border/80 bg-card hover:bg-muted/40 transition-colors group shadow-xs"
        >
          <div className="flex items-center justify-between">
            <ScrollText className="h-4 w-4 text-purple-600 group-hover:scale-110 transition-transform" />
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
          </div>
          <p className="font-bold text-xs text-foreground mt-2">Forensic Audit Stream</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Security &amp; compliance trails</p>
        </Link>
      </div>

      {/* Two Column Layout: Fleet Table & Security Stream */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Commissioned Fleet (2 cols) */}
        <Card className="rounded-2xl border-border/80 shadow-xs lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between border-b border-border/60 pb-4">
            <div>
              <CardTitle className="text-base font-bold">Commissioned Mahalles</CardTitle>
              <CardDescription className="text-xs">
                Active tenant instances running on this platform cluster
              </CardDescription>
            </div>
            <Link
              href="/tenants"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              All Mahalles ({tenants.length}) <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            {tenants.length === 0 ? (
              <EmptyState
                title="No Mahalles commissioned"
                description="Use the Provision Mahalle action to launch your first tenant."
              />
            ) : (
              <div className="divide-y divide-border/60">
                {tenants.slice(0, 6).map((tenant) => (
                  <div
                    key={tenant.id}
                    className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/20 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                        {tenant.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/tenants/${tenant.id}`}
                          className="truncate text-xs font-bold text-foreground hover:text-primary hover:underline block"
                        >
                          {tenant.name}
                        </Link>
                        <p className="truncate text-[11px] text-muted-foreground font-mono mt-0.5">
                          {tenant.slug}.{ROOT_DOMAIN} · {tenant.memberCount} members · {tenant.familyCount} families
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant={tenant.isActive ? "success" : "outline"}
                        className="text-[10px]"
                      >
                        {tenant.isActive ? "Active" : "Suspended"}
                      </Badge>
                      <Link
                        href={`/tenants/${tenant.id}`}
                        className="rounded-xl border border-border px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                      >
                        Inspect
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Security & Compliance Stream (1 col) */}
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader className="flex-row items-center justify-between border-b border-border/60 pb-4">
            <div>
              <CardTitle className="text-base font-bold">Audit Stream</CardTitle>
              <CardDescription className="text-xs">Immutable compliance log</CardDescription>
            </div>
            <Link
              href="/audit-logs"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Full Stream <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            {recentAuditEntries.length === 0 ? (
              <EmptyState title="No audit entries logged yet" />
            ) : (
              <div className="space-y-3">
                {recentAuditEntries.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-2.5 text-xs">
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-foreground font-mono text-[11px]">
                        {entry.action}
                      </p>
                      <p className="truncate text-[10px] text-muted-foreground mt-0.5">
                        {entry.actor?.email ?? "system"}
                        {entry.tenant ? ` · ${entry.tenant.name}` : ""} ·{" "}
                        {new Date(entry.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
