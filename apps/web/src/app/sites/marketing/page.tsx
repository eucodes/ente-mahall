import Link from "next/link";
import {
  ArrowRight,
  Badge,
  Building,
  Button,
  Calendar,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Check,
  EmptyState,
  Megaphone,
  ShieldCheck,
  Sparkles,
  UsersRound
} from "@mahalle/ui";
import { adminHost, ROOT_DOMAIN, tenantHost } from "@/lib/env";
import { getSession } from "@/lib/session";
import { getMyTenants } from "@/lib/tenants";
import { LogoutButton } from "@/features/auth/logout-button";

const FEATURES = [
  {
    icon: UsersRound,
    title: "Members & families",
    description: "One directory for every household, kept accurate as people join, move, and pass roles between them."
  },
  {
    icon: Calendar,
    title: "Events & programs",
    description: "Plan gatherings and ongoing initiatives, and keep the whole community looking at the same calendar."
  },
  {
    icon: Megaphone,
    title: "Announcements",
    description: "Publish notices once and reach every member — no more forwarding the same message by hand."
  },
  {
    icon: ShieldCheck,
    title: "Real access control",
    description: "Fine-grained roles and permissions decide who can see and change what, enforced on every request."
  }
] as const;

export default async function MarketingHomePage() {
  const user = await getSession();
  const tenants = user ? await getMyTenants() : [];

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Mahalle</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
                <LogoutButton redirectTo="/" />
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <a href={`http://${adminHost()}/login`}>Log in</a>
                </Button>
                <Button asChild size="lg">
                  <a href={`http://${adminHost()}/onboarding`}>Get started</a>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/12%),transparent_60%)]"
        />
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center">
          <Badge variant="secondary" className="gap-1.5">
            <Building className="h-3.5 w-3.5" /> {ROOT_DOMAIN} &middot; multi-tenant platform
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Run your Mahalle like a modern organization
          </h1>
          <p className="max-w-xl text-balance text-lg text-muted-foreground">
            Members, families, events, announcements, and programs — one platform, one database,
            with every Mahalle isolated in its own private workspace.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <a href={`http://${adminHost()}/onboarding`}>Get started</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={`http://${adminHost()}/login`}>
                Log in <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Free to start &middot; No credit card required &middot; Set up in minutes
          </p>
        </div>
      </section>

      {user && (
        <section className="mx-auto max-w-3xl px-6 py-12">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Your Mahalles</CardTitle>
                <p className="text-sm text-muted-foreground">Every Mahalle you belong to.</p>
              </div>
              <Button asChild size="sm">
                <Link href="/new-mahalle">Create a Mahalle</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {tenants.length === 0 ? (
                <EmptyState
                  title="You're not part of any Mahalle yet"
                  description="Create one, or ask an existing Mahalle's admin to add you."
                />
              ) : (
                <ul className="divide-y divide-border">
                  {tenants.map(({ tenant, role }) => (
                    <li key={tenant.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium">{tenant.name}</p>
                        <p className="text-xs text-muted-foreground">{role.name}</p>
                      </div>
                      <a
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
                        href={`http://${tenantHost(tenant.slug)}/dashboard`}
                      >
                        Open dashboard <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Everything a Mahalle needs to run day to day</h2>
          <p className="mt-3 text-muted-foreground">
            Built for administrators who want less spreadsheet-wrangling and members who just want
            to know what&apos;s happening.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="h-full">
              <CardContent className="flex h-full flex-col gap-3 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Every Mahalle, its own private workspace</h2>
          <ul className="grid gap-3 text-left sm:grid-cols-2">
            {[
              "Isolated data per Mahalle — nothing crosses tenant boundaries",
              "Role-based access for owners, admins, and members",
              "A member portal for phone-based sign-in, no passwords needed",
              "Platform-wide audit logging for every sensitive action"
            ].map((line) => (
              <li key={line} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {line}
              </li>
            ))}
          </ul>
          <Button asChild size="lg">
            <a href={`http://${adminHost()}/onboarding`}>Get started</a>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
          <span>&copy; {new Date().getFullYear()} Mahalle</span>
          <div className="flex items-center gap-4">
            <a className="hover:text-foreground" href={`http://${adminHost()}/login`}>
              Admin login
            </a>
            <a className="hover:text-foreground" href={`http://control.${ROOT_DOMAIN}`}>
              Platform status
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
