import { redirect } from "next/navigation";
import { Card, CardContent, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getHouses } from "@/lib/houses";
import { getStructure } from "@/lib/structure";
import { HousesRegistry } from "@/features/tenants/houses-registry";

const PAGE_SIZE = 100;

export default async function HousesPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const [result, structureResult] = await Promise.all([getHouses(slug, 1, PAGE_SIZE), getStructure(slug)]);

  return (
    <>
      <PageHeader title="Houses" description="The directory of dwellings this Mahallu tracks." />

      {result === null ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to view houses"
              description={`Your role (${membership.role.name}) doesn't include houses.view.`}
            />
          </CardContent>
        </Card>
      ) : (
        <HousesRegistry slug={slug} houses={result.items} divisions={structureResult?.divisions ?? []} />
      )}
    </>
  );
}
