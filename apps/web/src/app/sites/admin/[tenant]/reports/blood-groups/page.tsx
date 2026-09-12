import { redirect } from "next/navigation";
import { Card, CardContent, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getMembers } from "@/lib/members";
import { BloodGroupReport } from "@/features/tenants/blood-group-report";

const PAGE_SIZE = 100;

export default async function BloodGroupReportPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const result = await getMembers(slug, 1, PAGE_SIZE);

  return (
    <>
      <PageHeader title="Blood group report" description="Members grouped by blood group, for emergencies and donation drives." />

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
        <BloodGroupReport members={result.members} total={result.total} />
      )}
    </>
  );
}
