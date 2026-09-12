import { redirect } from "next/navigation";
import { Card, CardContent, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getMembers } from "@/lib/members";
import { ExpatriateReport } from "@/features/tenants/expatriate-report";

const PAGE_SIZE = 100;

export default async function ExpatriateRegisterPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const result = await getMembers(slug, 1, PAGE_SIZE, { isExpatriate: true });

  return (
    <>
      <PageHeader title="Expatriate register" description="Members currently living or working abroad." />

      {result === null ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to view members"
              description={`Your role (${membership.role.name}) doesn't include members.view.`}
            />
          </CardContent>
        </Card>
      ) : (
        <ExpatriateReport members={result.members} total={result.total} />
      )}
    </>
  );
}
