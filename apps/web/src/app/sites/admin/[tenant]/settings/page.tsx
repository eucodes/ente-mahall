import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Layers,
  Settings,
  ShieldCheck,
  Building,
  Bell,
  Clock,
  ChevronRight,
  Sparkles,
  UsersRound,
  FileText
} from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getStructure } from "@/lib/structure";

export default async function TenantAdminSettingsPage({
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

  const structureData = await getStructure(slug).catch(() => null);
  const tenant = membership.tenant;
  const hasDivisions = structureData?.structure?.hasDivisions ?? false;

  return (
    <div className="space-y-6">
      {/* Settings Hub Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border/80 bg-card p-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <Settings className="h-3.5 w-3.5" />
              Settings & Preferences
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Settings Hub
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage your personal profile, active features, Mahall structure, and administrative access.
          </p>
        </div>
      </div>

      {/* 1. User Profile Section */}
      <Card className="rounded-3xl border-border/80 shadow-xs">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-base font-bold">Your Profile & Role</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar name={user.fullName} size="lg" className="h-14 w-14 text-base" />
              <div>
                <h3 className="text-base font-bold text-foreground">{user.fullName}</h3>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Badge variant="secondary" className="text-[11px] font-semibold">
                    {membership.role.name}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">
                    Mahall: <strong>{tenant.name}</strong>
                  </span>
                </div>
              </div>
            </div>
            <Button size="sm" variant="outline" className="rounded-xl text-xs font-semibold self-start sm:self-auto">
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2. Feature Selection Toggles (Low Level Overview) */}
      <Card className="rounded-3xl border-border/80 shadow-xs">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Feature Selection & Modules</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Enable or disable operational modules according to your Mahall needs
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              System Config
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4 divide-y divide-border/60">
          {/* Feature 1: Wards / Divisions */}
          <div className="flex items-center justify-between py-3.5 first:pt-0">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-foreground">Wards / Zones / Divisions</p>
              <p className="text-xs text-muted-foreground">
                Divide the Mahallu into geographic zones with specific prefix codes
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={hasDivisions ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-muted text-muted-foreground"}>
                {hasDivisions ? "Enabled" : "Disabled"}
              </Badge>
              <Link href={`/${slug}/settings/structure`}>
                <Button size="sm" variant="ghost" className="text-xs rounded-xl h-8 px-2.5">
                  Configure
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature 2: Family Category Tagging */}
          <div className="flex items-center justify-between py-3.5">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-foreground">Family Category Tagging</p>
              <p className="text-xs text-muted-foreground">
                Classify families into categories (A, B, C, General, Welfare)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                Enabled
              </Badge>
            </div>
          </div>

          {/* Feature 3: Official Registers & NOCs */}
          <div className="flex items-center justify-between py-3.5">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-foreground">Official Registers & Certificates</p>
              <p className="text-xs text-muted-foreground">
                Digital registers for Nikah, Mayyith, Talaq, and Mahall NOC certificates
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                Enabled
              </Badge>
            </div>
          </div>

          {/* Feature 4: Public Website Portal */}
          <div className="flex items-center justify-between py-3.5 last:pb-0">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-foreground">Public Website & Member Portal</p>
              <p className="text-xs text-muted-foreground">
                Public presence at {slug}.mahalle.app with prayer times and notice boards
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                Enabled
              </Badge>
              <Link href={`/${slug}/website`}>
                <Button size="sm" variant="ghost" className="text-xs rounded-xl h-8 px-2.5">
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Administration & Configuration Links */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link href={`/${slug}/settings/structure`} className="group block">
          <Card className="h-full rounded-2xl border-border/80 transition-all group-hover:border-emerald-500/50 group-hover:shadow-md">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Structure & Wards</h4>
                  <p className="text-xs text-muted-foreground">Configure division codes and house numbering</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
            </CardContent>
          </Card>
        </Link>

        <Link href={`/${slug}/admins`} className="group block">
          <Card className="h-full rounded-2xl border-border/80 transition-all group-hover:border-primary/50 group-hover:shadow-md">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Admin Users & Access</h4>
                  <p className="text-xs text-muted-foreground">Manage committee members, roles & permissions</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
            </CardContent>
          </Card>
        </Link>

        <Link href={`/${slug}/settings/notifications`} className="group block">
          <Card className="h-full rounded-2xl border-border/80 transition-all group-hover:border-amber-500/50 group-hover:shadow-md">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Notifications</h4>
                  <p className="text-xs text-muted-foreground">SMS alerts, email digests, and reminder preferences</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
            </CardContent>
          </Card>
        </Link>

        <Link href={`/${slug}/activity`} className="group block">
          <Card className="h-full rounded-2xl border-border/80 transition-all group-hover:border-sky-500/50 group-hover:shadow-md">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Audit & Activity Logs</h4>
                  <p className="text-xs text-muted-foreground">Full audit trail of admin actions and records changed</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
