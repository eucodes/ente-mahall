import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Avatar,
  Badge,
  Button,
  Calendar,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  FileText,
  HeartHandshake,
  Landmark,
  MapPin,
  Megaphone,
  Plus,
  ShieldCheck,
  Sparkles,
  StatCard,
  UsersRound,
  Users,
  Wallet,
  Clock,
  ArrowUpRight
} from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getMembers } from "@/lib/members";
import { getAnnouncements, getEvents, getFamilies } from "@/lib/business-resources";
import { getFinanceSummary, getCashBook } from "@/lib/finance";
import { getServiceRequests } from "@/lib/services";
import { getStructure } from "@/lib/structure";
import { SetupChecklist } from "@/features/onboarding/setup-checklist";

export default async function TenantAdminOverviewPage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const membership = await getMyTenantMembership(slug);
  if (!membership) {
    redirect("/");
  }

  // Load dashboard data in parallel
  const [
    membersResult,
    familiesResult,
    eventsResult,
    financeResult,
    cashBookResult,
    serviceRequestsResult,
    structureResult
  ] = await Promise.all([
    getMembers(slug, 1, 6).catch(() => null),
    getFamilies(slug, 1, 1).catch(() => null),
    getEvents(slug, 1, 4).catch(() => null),
    getFinanceSummary(slug).catch(() => null),
    getCashBook(slug).catch(() => null),
    getServiceRequests(slug, 1, 5).catch(() => null),
    getStructure(slug).catch(() => null)
  ]);

  const totalMembers = membersResult?.total ?? 0;
  const totalFamilies = familiesResult?.total ?? 0;
  const avgFamilySize =
    totalFamilies > 0 ? (totalMembers / totalFamilies).toFixed(1) : "—";
  const upcomingEventsCount = eventsResult?.total ?? 0;
  const pendingServicesCount = serviceRequestsResult?.total ?? 0;
  const divisionsCount = structureResult?.divisions?.length ?? 0;

  // Format financial figures (INR currency)
  const netPosition = financeResult
    ? `₹${parseFloat(financeResult.netPosition || "0").toLocaleString("en-IN")}`
    : "₹0";
  const totalIncome = financeResult
    ? `₹${parseFloat(financeResult.totalIncome || "0").toLocaleString("en-IN")}`
    : "₹0";
  const totalExpense = financeResult
    ? `₹${parseFloat(financeResult.totalExpense || "0").toLocaleString("en-IN")}`
    : "₹0";
  const closingCash = cashBookResult?.closingBalance
    ? `₹${parseFloat(cashBookResult.closingBalance).toLocaleString("en-IN")}`
    : netPosition;

  const tenant = membership.tenant;
  const mosqueName = tenant.masjidName || "Central Juma Masjid";

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-sm border border-emerald-500/30">
                <Sparkles className="h-3.5 w-3.5" />
                Mahall Command Center
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-medium text-slate-300">
                {mosqueName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Assalamu Alaikum, {user.fullName.split(" ")[0]}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Here is the administrative summary and live telemetry for{" "}
              <strong className="text-white">{tenant.name}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href={`/${slug}/finance/dues`}>
              <Button
                size="md"
                variant="secondary"
                className="h-10 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-md shadow-xs transition-all"
              >
                <Wallet className="h-4 w-4 text-emerald-300" />
                <span>Collect Dues</span>
              </Button>
            </Link>
            <Link href={`/${slug}/members`}>
              <Button
                size="md"
                className="h-10 px-4.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-md shadow-emerald-950/40 transition-all active:scale-[0.98]"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                <span>Add Member</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Subtle decorative background glow */}
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
      </div>

      {/* Setup Checklist if tenant has not completed full profile */}
      {membership.tenant.country && (
        <div className="mb-2">
          <SetupChecklist />
        </div>
      )}

      {/* Quick Action Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1 shrink-0">
          Fast Track:
        </span>
        <Link
          href={`/${slug}/members`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-2xs hover:border-border hover:bg-muted transition-colors"
        >
          <Users className="h-3.5 w-3.5 text-primary" />
          <span>New Member</span>
        </Link>
        <Link
          href={`/${slug}/families`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-2xs hover:border-border hover:bg-muted transition-colors"
        >
          <UsersRound className="h-3.5 w-3.5 text-sky-600" />
          <span>Register Family</span>
        </Link>
        <Link
          href={`/${slug}/finance/vouchers`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-2xs hover:border-border hover:bg-muted transition-colors"
        >
          <FileText className="h-3.5 w-3.5 text-teal-600" />
          <span>Record Voucher</span>
        </Link>
        <Link
          href={`/${slug}/registers/marriage`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-2xs hover:border-border hover:bg-muted transition-colors"
        >
          <FileText className="h-3.5 w-3.5 text-amber-600" />
          <span>Issue Certificate</span>
        </Link>
        <Link
          href={`/${slug}/announcements`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-2xs hover:border-border hover:bg-muted transition-colors"
        >
          <Megaphone className="h-3.5 w-3.5 text-violet-600" />
          <span>Friday Notice</span>
        </Link>
      </div>

      {/* Executive KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Link href={`/${slug}/members`}>
          <StatCard
            label="Members"
            value={totalMembers}
            icon={<Users />}
            tone="green"
            trend={{ value: "Active", positive: true, label: "Community" }}
          />
        </Link>

        <Link href={`/${slug}/families`}>
          <StatCard
            label="Families"
            value={totalFamilies}
            icon={<UsersRound />}
            tone="blue"
            hint={`Avg ${avgFamilySize} persons/house`}
          />
        </Link>

        <Link href={`/${slug}/finance/cash-book`}>
          <StatCard
            label="Treasury Balance"
            value={closingCash}
            icon={<Wallet />}
            tone="teal"
            hint={`Net: ${netPosition}`}
          />
        </Link>

        <Link href={`/${slug}/finance/dues`}>
          <StatCard
            label="Monthly Dues"
            value={totalIncome}
            icon={<Wallet />}
            tone="amber"
            hint="Collection progress"
          />
        </Link>

        <Link href={`/${slug}/services`}>
          <StatCard
            label="Service Requests"
            value={pendingServicesCount}
            icon={<HeartHandshake />}
            tone={pendingServicesCount > 0 ? "rose" : "default"}
            hint={pendingServicesCount > 0 ? "Needs review" : "All resolved"}
          />
        </Link>

        <Link href={`/${slug}/events`}>
          <StatCard
            label="Upcoming Events"
            value={upcomingEventsCount}
            icon={<Calendar />}
            tone="violet"
            hint="Programs & Milad"
          />
        </Link>
      </div>

      {/* Urgent Attention Notification (if items pending) */}
      {pendingServicesCount > 0 && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50 to-orange-50/50 p-4 dark:border-amber-800/60 dark:from-amber-950/30 dark:to-orange-950/20">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                {pendingServicesCount} Citizen Service Request
                {pendingServicesCount > 1 ? "s" : ""} Awaiting Review
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Members have requested marriage NOCs, certificates, or welfare assistance.
              </p>
            </div>
          </div>
          <Link
            href={`/${slug}/services`}
            className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-amber-800 dark:text-amber-300 hover:underline"
          >
            Review Requests <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Two-Column Analytics & Feeds */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Columns: Recent Members & Treasury Feed */}
        <div className="space-y-6 lg:col-span-2">
          {/* Recent Members Card */}
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader className="flex-row items-center justify-between border-b border-border/60 pb-4">
              <div>
                <CardTitle className="text-base font-bold">Recent Members</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Recently registered community residents
                </p>
              </div>
              <Link
                href={`/${slug}/members`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                View all directory <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="pt-4">
              {!membersResult ? (
                <EmptyState
                  title="Not available"
                  description="You don't have permission to view members."
                />
              ) : membersResult.members.length === 0 ? (
                <EmptyState
                  title="No members registered yet"
                  description="Add members to start building your Mahall census."
                />
              ) : (
                <div className="divide-y divide-border/60">
                  {membersResult.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar name={member.fullName} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {member.fullName}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {member.family?.name
                              ? `${member.family.name} Family`
                              : member.phone ?? "No contact"}
                            {member.gender && ` · ${member.gender}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {member.bloodGroup && (
                          <Badge
                            variant="outline"
                            className="text-[11px] font-medium"
                          >
                            {member.bloodGroup}
                          </Badge>
                        )}
                        <Link
                          href={`/${slug}/members`}
                          className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                          title="View member details"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Financial Treasury Pulse Card */}
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader className="flex-row items-center justify-between border-b border-border/60 pb-4">
              <div>
                <CardTitle className="text-base font-bold">
                  Treasury & Accounts Snapshot
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Summary of revenue and disbursements
                </p>
              </div>
              <Link
                href={`/${slug}/finance`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                Full Accounts <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-3 gap-4 pb-4 border-b border-border/60 text-center">
                <div className="rounded-xl bg-muted/40 p-3">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Total Income
                  </p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    {totalIncome}
                  </p>
                </div>
                <div className="rounded-xl bg-muted/40 p-3">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Total Expenses
                  </p>
                  <p className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-1">
                    {totalExpense}
                  </p>
                </div>
                <div className="rounded-xl bg-muted/40 p-3">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Closing Cash
                  </p>
                  <p className="text-lg font-bold text-teal-600 dark:text-teal-400 mt-1">
                    {closingCash}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Accounts tracked: Cash in hand, Bank deposits, Dues & Relief funds
                </span>
                <Link
                  href={`/${slug}/finance/vouchers`}
                  className="font-medium text-primary hover:underline"
                >
                  + New Voucher
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Column: Events, Demographics & Admin links */}
        <div className="space-y-6">
          {/* Upcoming Events Card */}
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader className="flex-row items-center justify-between border-b border-border/60 pb-4">
              <CardTitle className="text-base font-bold">Upcoming Agenda</CardTitle>
              <Link
                href={`/${slug}/events`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                Calendar <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="pt-4">
              {!eventsResult ? (
                <EmptyState
                  title="Not available"
                  description="You don't have permission to view events."
                />
              ) : eventsResult.items.length === 0 ? (
                <EmptyState
                  title="No upcoming events"
                  description="Create Milad, Juma, or general body meetings."
                />
              ) : (
                <div className="space-y-3">
                  {eventsResult.items.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 rounded-xl p-2 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-emerald-500/10 text-[10px] font-bold uppercase leading-none text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        <span>
                          {new Date(event.startsAt).toLocaleDateString(undefined, {
                            month: "short"
                          })}
                        </span>
                        <span className="text-base mt-0.5">
                          {new Date(event.startsAt).getDate()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {event.title}
                        </p>
                        <p className="truncate text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {event.location ?? "Central Masjid"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Demographics & Wards Overview */}
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader className="border-b border-border/60 pb-3">
              <CardTitle className="text-base font-bold">Demographic Pillars</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <Link
                href={`/${slug}/settings/structure`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium">Wards & Divisions</span>
                </div>
                <Badge variant="secondary">{divisionsCount}</Badge>
              </Link>

              <Link
                href={`/${slug}/reports/expatriate`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-sky-600" />
                  <span className="text-xs font-medium">Expatriates (Pravasi)</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>

              <Link
                href={`/${slug}/reports/yatheem`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <HeartHandshake className="h-4 w-4 text-rose-600" />
                  <span className="text-xs font-medium">Yatheem (Orphans)</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>

              <Link
                href={`/${slug}/reports/blood-groups`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="h-4 w-4 text-red-600" />
                  <span className="text-xs font-medium">Blood Donor Registry</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>

          {/* Administrators Card */}
          <Link href={`/${slug}/admins`} className="group block">
            <Card className="rounded-2xl border-border/80 transition-all group-hover:border-primary/50 group-hover:shadow-md">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      Committee & Admins
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Manage roles, permissions & access
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
