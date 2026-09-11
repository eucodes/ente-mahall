import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge, Card, CardContent, CardHeader, CardTitle, EmptyState } from "@mahalle/ui";
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
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-6 py-16">
      <div className="flex items-center justify-between">
        <Badge variant="secondary">admin.{ROOT_DOMAIN} &middot; Mahalle administration</Badge>
        <LogoutButton redirectTo="/login" />
      </div>
      <h1 className="text-2xl font-semibold">Choose a Mahalle to administer</h1>
      <p className="text-sm text-muted-foreground">
        Every Mahalle you belong to, {user.fullName}. Fine-grained admin permission
        gating (what each role can do here) is Phase 4 — for now, entry requires only an
        active membership.
      </p>
      {tenants.length === 0 ? (
        <EmptyState
          title="You don't belong to any Mahalle yet"
          description="Create one from the marketing site, or ask an owner to add you."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {tenants.map(({ tenant, role }) => (
            <Card key={tenant.id}>
              <CardHeader>
                <CardTitle className="text-base">{tenant.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{role.name}</span>
                <Link
                  href={`/${tenant.slug}`}
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Manage &rarr;
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
