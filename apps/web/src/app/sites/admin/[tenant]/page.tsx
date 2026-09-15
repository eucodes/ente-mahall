import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Globe,
  Sparkles,
  ExternalLink,
  CreditCard,
  Building,
  CheckCircle2,
  Layers,
  UsersRound,
  Wallet,
  FileText,
  HeartHandshake
} from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { HomeWebsiteCard } from "@/features/navigation/home-website-card";

export default async function TenantAdminHomePage({
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

  const tenant = membership.tenant;
  const publicUrl = `https://${slug}.eucodes.tech`;

  // Calculate profile completeness score
  let completedFields = 0;
  const totalFields = 4;
  if (tenant.name) completedFields++;
  if (tenant.masjidName) completedFields++;
  if (tenant.country) completedFields++;
  if (tenant.logoUrl) completedFields++;
  const completionPercentage = Math.round((completedFields / totalFields) * 100);

  return (
    <div className="space-y-6">
      {/* 1. Workspace Status & Plan Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-sm border border-emerald-500/30">
                <Sparkles className="h-3.5 w-3.5" />
                Active Workspace
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-medium text-slate-300">
                Plan: <strong className="text-white font-semibold">Community Basic</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Your Mahallu Workspace is Active
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Everything you need to run <strong className="text-white">{tenant.name}</strong> administration, public website, member records, and official registers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href={`/${slug}/billing`}>
              <Button
                size="md"
                variant="secondary"
                className="h-10 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-xs transition-all"
              >
                <CreditCard className="h-4 w-4 text-emerald-400" />
                <span>Manage Billing</span>
              </Button>
            </Link>
            <Link href={`/${slug}/overview`}>
              <Button
                size="md"
                className="h-10 px-4.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/40 transition-all active:scale-[0.98]"
              >
                <Building className="h-4 w-4 stroke-[2.5]" />
                <span>Open Mahall Hub</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative background gradients */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* 2. Two Main Action Cards: Public Website & Profile Completion */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Card A: Mahall Public Website */}
        <HomeWebsiteCard slug={slug} publicUrl={publicUrl} />

        {/* Card B: Mahall Profile Completion */}
        <Card className="rounded-3xl border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Mahall Profile</h3>
                  <p className="text-xs text-muted-foreground">General settings and identity</p>
                </div>
              </div>
              <Badge variant="secondary" className="font-bold text-xs">
                {completionPercentage}% complete
              </Badge>
            </div>

            {/* Progress Gauge */}
            <div className="mt-6 flex items-center gap-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-muted">
                <svg className="h-16 w-16 -rotate-90 transform" viewBox="0 0 36 36">
                  <path
                    className="text-muted-foreground/20"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500"
                    strokeDasharray={`${completionPercentage}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xs font-bold text-foreground">
                  {completionPercentage}%
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-foreground">
                  {completionPercentage === 100
                    ? "Mahall identity is complete and verified."
                    : "Complete remaining setup items to unlock full capabilities."}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Includes masjid address, contact numbers, jurisdiction bounds, and officer directory.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border/60">
            <Link
              href={`/${slug}/settings`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <span>Complete profile</span>
              <span>→</span>
            </Link>
          </div>
        </Card>
      </div>

      {/* 3. Quick Guide & Video Walkthrough Section */}
      <Card className="rounded-3xl border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="grid lg:grid-cols-12 gap-0">
          {/* Left Video Player Preview (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 sm:p-8 text-white flex flex-col justify-between min-h-[220px]">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Tutorial
              </span>
              <h3 className="text-lg font-bold text-white">Mahalle OS Quick Guide</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Watch how easy it is to manage families, record collections, and issue official certificates.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30">
                <svg className="h-5 w-5 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-white">Watch 5-min Walkthrough</p>
                <p className="text-[11px] text-slate-400">Step-by-step introduction</p>
              </div>
            </div>
          </div>

          {/* Right Checklist / Playlist (7 cols) */}
          <div className="lg:col-span-7 p-6 space-y-3 bg-card/60">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground pb-1">
              Getting Started Playlist
            </p>

            <Link
              href={`/${slug}/settings/structure`}
              className="flex items-center justify-between p-3 rounded-2xl border border-border/60 bg-card hover:bg-muted/60 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Layers className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-foreground">
                    1. Wards & House Numbering Configuration
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    Define division codes or global house numbering rules
                  </p>
                </div>
              </div>
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 ml-2" />
            </Link>

            <Link
              href={`/${slug}/families`}
              className="flex items-center justify-between p-3 rounded-2xl border border-border/60 bg-card hover:bg-muted/60 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  <UsersRound className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-foreground">
                    2. Census & Family Registry
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    Add family units, members, occupations, and education
                  </p>
                </div>
              </div>
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 ml-2" />
            </Link>

            <Link
              href={`/${slug}/finance/dues`}
              className="flex items-center justify-between p-3 rounded-2xl border border-border/60 bg-card hover:bg-muted/60 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <Wallet className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-foreground">
                    3. Financial Treasury & Varisa Dues
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    Track cash book, monthly collections, and receipts
                  </p>
                </div>
              </div>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground/40 shrink-0 ml-2" />
            </Link>

            <Link
              href={`/${slug}/registers/marriage`}
              className="flex items-center justify-between p-3 rounded-2xl border border-border/60 bg-card hover:bg-muted/60 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-foreground">
                    4. Official Registers & NOCs
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    Digital certificates for Nikah, Mayyith, and Talaq
                  </p>
                </div>
              </div>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground/40 shrink-0 ml-2" />
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
