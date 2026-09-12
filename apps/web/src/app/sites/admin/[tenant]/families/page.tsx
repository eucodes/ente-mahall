import { redirect } from "next/navigation";
import { Card, CardContent, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getFamilies } from "@/lib/business-resources";
import { getMembers } from "@/lib/members";
import { getHouses } from "@/lib/houses";
import { FamiliesRegistry } from "@/features/tenants/families-registry";

// The API's own pageSize ceiling — see the equivalent note on the Members page.
const PAGE_SIZE = 100;

export default async function FamiliesPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const [result, membersResult, housesResult] = await Promise.all([
    getFamilies(slug, 1, PAGE_SIZE),
    getMembers(slug, 1, PAGE_SIZE),
    getHouses(slug, 1, PAGE_SIZE)
  ]);

  return (
    <>
      <PageHeader title="Families" description="Household units within the Mahalle." />

      {result === null ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to view families"
              description={`Your role (${membership.role.name}) doesn't include families.view.`}
            />
          </CardContent>
        </Card>
      ) : (
        <FamiliesRegistry
          slug={slug}
          families={result.items}
          members={membersResult?.members ?? []}
          houses={housesResult?.items ?? []}
          total={result.total}
        />
      )}
    </>
  );
}
