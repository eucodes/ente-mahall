import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Building,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  PageHeader,
  Sparkles
} from "@mahalle/ui";
import { ROOT_DOMAIN } from "@/lib/env";
import { getSession } from "@/lib/session";
import { getMyTenants } from "@/lib/tenants";
import { LogoutButton } from "@/features/auth/logout-button";

export default async function AdminHomePage() {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const tenants = await getMyTenants();

  return (
    <main className="min-h-screen bg-muted/40">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-semibold tracking-tight">admin.{ROOT_DOMAIN}</span>
          </div>
          <LogoutButton redirectTo="/login" />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <PageHeader
          title={`Welcome back, ${user.fullName}`}
          description="Choose a Mahalle to administer."
        />

        {tenants.length === 0 ? (
          <Card>
            <CardContent className="p-0">
              <EmptyState
                icon={<Building className="h-8 w-8 text-muted-foreground" />}
                title="You don't belong to any Mahalle yet"
                description="Create one from the marketing site, or ask an owner to add you."
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tenants.map(({ tenant, role }) => (
              <Link key={tenant.id} href={`/${tenant.slug}`} className="group">
                <Card className="h-full transition-shadow group-hover:shadow-md">
                  <CardHeader>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Building className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{tenant.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">{role.name}</span>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Manage <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
