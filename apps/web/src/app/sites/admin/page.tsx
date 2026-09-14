import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Avatar,
  Badge,
  Building,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Plus,
  ShieldCheck,
  Sparkles
} from "@mahalle/ui";
import { ROOT_DOMAIN } from "@/lib/env";
import { getSession } from "@/lib/session";
import { getMyTenants } from "@/lib/tenants";
import { LogoutButton } from "@/features/auth/logout-button";
import { HijriDateBadge } from "@/features/navigation/hijri-date-badge";
import { IdleTimeoutProvider } from "@/features/auth/idle-timeout-provider";

export default async function AdminHomePage() {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const tenants = await getMyTenants();

  return (
    <IdleTimeoutProvider>
      <div className="min-h-screen bg-muted/20 text-foreground">
      {/* Topbar */}
      <header className="sticky top-0 z-30 border-b border-border/80 bg-card/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-foreground leading-tight">Ente Mahall</span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider leading-none">
                Admin Workspace Hub
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <HijriDateBadge />
            <div className="flex items-center gap-3 pl-3 border-l border-border/60">
              <div className="hidden sm:flex items-center gap-2">
                <Avatar name={user.fullName} size="sm" />
                <span className="text-xs font-semibold text-foreground">{user.fullName}</span>
              </div>
              <LogoutButton redirectTo="/login" variant="ghost" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back, {user.fullName.split(" ")[0]}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Select a Mahalle workspace to manage its census, finance, official registers, and governance.
            </p>
          </div>

          <Button asChild className="rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shrink-0">
            <Link href="/onboarding">
              <Plus className="h-4 w-4 mr-1.5" />
              Register New Mahalle
            </Link>
          </Button>
        </div>

        {/* Workspaces Grid */}
        {tenants.length === 0 ? (
          <Card className="rounded-3xl border-dashed border-2 p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
              <Building className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">No Mahalle Workspaces Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-6">
              You do not have administrative membership in any Mahalle yet. Start by onboarding your Mahalle.
            </p>
            <Button asChild className="rounded-xl font-bold bg-emerald-600 text-white">
              <Link href="/onboarding">Complete Setup Wizard</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tenants.map(({ tenant, role }) => (
              <Link key={tenant.id} href={`/${tenant.slug}`} className="group block">
                <Card className="rounded-2xl border-border/80 shadow-xs group-hover:border-primary/50 group-hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between h-full">
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold text-base">
                        {tenant.name.slice(0, 2).toUpperCase()}
                      </div>
                      <Badge variant="default" className="text-[10px] font-semibold">
                        {role.name}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {tenant.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        {tenant.slug}.{ROOT_DOMAIN}
                      </p>
                      {tenant.masjidName && (
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                          <Building className="h-3.5 w-3.5 shrink-0" />
                          {tenant.masjidName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-border/60 bg-muted/20 px-6 py-3.5 flex items-center justify-between text-xs font-semibold text-primary">
                    <span>Open Dashboard</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
            ))}

            {/* Create New Mahalle Tile */}
            <Link href="/onboarding" className="group block">
              <div className="rounded-2xl border-2 border-dashed border-border hover:border-primary/40 p-6 flex flex-col items-center justify-center text-center h-full min-h-[200px] transition-all bg-card/40 hover:bg-card">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform mb-3">
                  <Plus className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-foreground">Onboard Another Mahalle</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  Run the setup wizard to create an isolated workspace for another community or mosque.
                </p>
              </div>
            </Link>
          </div>
        )}
      </main>
    </div>
    </IdleTimeoutProvider>
  );
}
