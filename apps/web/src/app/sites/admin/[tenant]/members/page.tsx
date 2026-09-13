import { redirect } from "next/navigation";
import { Card, CardContent, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getMembers } from "@/lib/members";
import { getFamilies } from "@/lib/business-resources";
import { MembersRegistry } from "@/features/tenants/members-registry";

// The API's own pageSize ceiling (see PaginationQueryDto) — the richer
// registry view (search, filters, stats) works best over as many members
// as the API will return in one page, rather than the old 20-per-page list.
const PAGE_SIZE = 100;

export default async function TenantMembersPage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const membership = await getMyTenantMembership(slug);
  if (!membership) {
    redirect("/");
  }

  const [result, familiesResult] = await Promise.all([
    getMembers(slug, 1, PAGE_SIZE),
    getFamilies(slug, 1, PAGE_SIZE)
  ]);
  const families = familiesResult?.items ?? [];

  if (result === null) {
    return (
      <div className="space-y-6">
        <PageHeader title="Members Directory" description="The Mahalle's member directory." />
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to view members"
              description={`Your role (${membership.role.name}) doesn't include members.view.`}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return <MembersRegistry slug={slug} members={result.members} families={families} total={result.total} />;
}
