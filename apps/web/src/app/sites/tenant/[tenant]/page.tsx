import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle, PageHeader } from "@mahalle/ui";
import { getMemberSession } from "@/lib/member-session";
import { getPublicTenant } from "@/lib/tenants";

export default async function TenantPublicSitePage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const [tenant, member] = await Promise.all([getPublicTenant(slug), getMemberSession(slug)]);

  return (
    <>
      <PageHeader
        title={tenant?.name ?? slug}
        description="Public information, announcements, events, and programs for this Mahalle will render here in Phase 7. Members log in from this same host with their phone number."
      />
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
    </>
  );
}
