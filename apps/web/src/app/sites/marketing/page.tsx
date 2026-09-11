import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState
} from "@mahalle/ui";
import { adminHost, ROOT_DOMAIN, tenantHost } from "@/lib/env";
import { getSession } from "@/lib/session";
import { getMyTenants } from "@/lib/tenants";
import { LogoutButton } from "@/features/auth/logout-button";
import { OnboardMahalleDialog } from "@/features/tenants/onboard-mahalle-dialog";

export default async function MarketingHomePage() {
  const user = await getSession();
  const tenants = user ? await getMyTenants() : [];

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <Badge variant="secondary">example.com &middot; public marketing site</Badge>
      <h1 className="text-4xl font-semibold tracking-tight">Mahalle</h1>
      <p className="max-w-xl text-muted-foreground">
        A multi-tenant platform for Mahalle management — one backend, one database, one
        product, serving every Mahalle as its own isolated tenant.
      </p>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm text-muted-foreground">Signed in as {user.email}</span>
            <LogoutButton redirectTo="/" />
          </>
        ) : (
          <>
            <OnboardMahalleDialog />
            <Button asChild variant="outline">
              {/* Cross-subdomain navigation to the admin site's login — the
                  public site hosts no login/signup forms of its own. */}
              <a href={`http://${adminHost()}/login`}>Log in</a>
            </Button>
          </>
        )}
      </div>

      {user && (
        <Card className="mt-8 w-full text-left">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Your Mahalles</CardTitle>
              <CardDescription>Every Mahalle you belong to.</CardDescription>
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
                      className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                      href={`http://${tenantHost(tenant.slug)}/dashboard`}
                    >
                      Open dashboard
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="mt-4 w-full text-left">
        <CardHeader>
          <CardTitle>Phase 3: multi-tenancy</CardTitle>
          <CardDescription>Real tenant creation, resolution, and isolation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-muted-foreground">
          <p>Resolved host maps to the marketing route group (host === {ROOT_DOMAIN}).</p>
          <p>
            Try <code>admin.{ROOT_DOMAIN}</code>, <code>control.{ROOT_DOMAIN}</code>, or a Mahalle
            you create above — log in once here and you&apos;ll already be signed in everywhere.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
