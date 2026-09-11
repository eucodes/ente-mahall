import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { LogoutButton } from "@/features/auth/logout-button";

const SECTIONS = [
  { title: "Members", description: "The Mahalle's member directory.", href: "members", permission: "members.*" },
  { title: "Families", description: "Household units within the Mahalle.", href: "families", permission: "families.*" },
  { title: "Events", description: "Scheduled Mahalle events.", href: "events", permission: "events.*" },
  {
    title: "Announcements",
    description: "Public notices from the Mahalle.",
    href: "announcements",
    permission: "announcements.*"
  },
  { title: "Programs", description: "Ongoing Mahalle initiatives.", href: "programs", permission: "programs.*" }
] as const;

export default async function TenantAdminHomePage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const membership = await getMyTenantMembership(slug);
  if (!membership) {
    // Real isolation: a signed-in user with no membership here gets nothing,
    // not even a hint that the tenant exists.
    redirect("/");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-6 py-16">
      <div className="flex items-center justify-between">
        <Badge variant="secondary">
          admin &middot; {membership.tenant.name}
        </Badge>
        <LogoutButton redirectTo="/login" />
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{membership.tenant.name}</h1>
        <Link href="/" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          &larr; All Mahalles
        </Link>
      </div>
      <p className="text-sm text-muted-foreground">Your role: {membership.role.name}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <Card key={section.href}>
            <CardHeader>
              <CardTitle className="text-base">{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="sm">
                <Link href={`/${slug}/${section.href}`}>Manage</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Administrators</CardTitle>
          <CardDescription>
            Add, re-role, or remove the people who help run this Mahalle — enforced with real
            permission and role-rank escalation checks, not just membership.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild size="sm">
            <Link href={`/${slug}/admins`}>Manage administrators</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
