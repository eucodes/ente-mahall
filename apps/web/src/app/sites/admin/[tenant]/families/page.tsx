import { redirect } from "next/navigation";
import { Card, CardContent, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getFamilies, getFamilySummary } from "@/lib/business-resources";
import { getMembers } from "@/lib/members";
import { getHouses } from "@/lib/houses";
import { getStructure } from "@/lib/structure";
import { FamiliesRegistry } from "@/features/tenants/families-registry";

// The API's own pageSize ceiling — see the equivalent note on the Members page.
const PAGE_SIZE = 100;

export default async function FamiliesPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const [result, membersResult, housesResult, summary, structureResult] = await Promise.all([
    getFamilies(slug, 1, PAGE_SIZE, { status: "all" }),
    getMembers(slug, 1, PAGE_SIZE),
    getHouses(slug, 1, PAGE_SIZE),
    getFamilySummary(slug),
    getStructure(slug).catch(() => null)
  ]);

  if (result === null) {
    return (
      <div className="space-y-6">
        <PageHeader title="Families" description="Household units within the Mahalle." />
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to view families"
              description={`Your role (${membership.role.name}) doesn't include families.view.`}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <FamiliesRegistry
      slug={slug}
      families={result.items}
      members={membersResult?.members ?? []}
      houses={housesResult?.items ?? []}
      total={result.total}
      summary={summary}
      familyStatuses={structureResult?.familyStatuses ?? []}
      hasFamilyStatuses={structureResult?.structure?.hasFamilyStatuses ?? false}
    />
  );
}
