import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, EmptyState, PageHeader, Pagination } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getMembers } from "@/lib/members";
import { getFamilies } from "@/lib/business-resources";
import { MembersTable } from "@/features/tenants/members-table";

const PAGE_SIZE = 20;
// The family picker is a plain <select> of every family, not paginated —
// 100 is the API's own pageSize ceiling (see PaginationQueryDto), so this is
// "as many as the API will return in one page," not an arbitrary choice.
const FAMILY_PICKER_LIMIT = 100;

export default async function TenantMembersPage({
  params,
  searchParams
}: {
  params: Promise<{ tenant: string }>;
  searchParams: Promise<{ page?: string }>;
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

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const [result, familiesResult] = await Promise.all([
    getMembers(slug, page, PAGE_SIZE),
    getFamilies(slug, 1, FAMILY_PICKER_LIMIT)
  ]);
  const families = familiesResult?.items ?? [];

  return (
    <>
      <PageHeader title="Members" description="The Mahalle's member directory." />

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
        <Card>
          <CardHeader>
            <CardTitle>
              {result.total} member{result.total === 1 ? "" : "s"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.members.length === 0 && page === 1 && (
              <EmptyState title="No members yet" description="Add the first one below." />
            )}
            <MembersTable slug={slug} members={result.members} families={families} />
            {result.members.length > 0 && (
              <Pagination
                page={page}
                pageSize={PAGE_SIZE}
                total={result.total}
                hrefForPage={(p) => `/${slug}/members?page=${p}`}
              />
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
