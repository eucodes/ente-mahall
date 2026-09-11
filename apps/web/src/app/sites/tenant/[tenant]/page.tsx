import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@mahalle/ui";
import { getMemberSession } from "@/lib/member-session";
import { getPublicTenant } from "@/lib/tenants";

export default async function TenantPublicSitePage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const [tenant, member] = await Promise.all([getPublicTenant(slug), getMemberSession(slug)]);

  if (!tenant) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-6 py-16">
      <Badge className="w-fit" variant="secondary">
        {slug}.example.com &middot; public Mahalle site
      </Badge>
      <h1 className="text-2xl font-semibold">{tenant.name}</h1>
      <p className="text-muted-foreground">
        Public information, announcements, events, and programs for this Mahalle will
        render here in Phase 7. Members log in from this same host with their phone number.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Member area</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
          {member ? (
            <>
              <span>Signed in as {member.fullName}</span>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard">Go to dashboard</Link>
              </Button>
            </>
          ) : (
            <>
              <span>Members log in with their phone number to reach the dashboard.</span>
              <Button asChild size="sm" variant="outline">
                <Link href="/login">Log in</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
