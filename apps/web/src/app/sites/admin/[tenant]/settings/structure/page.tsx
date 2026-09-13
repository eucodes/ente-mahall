import { redirect } from "next/navigation";
import { Card, CardContent, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getStructure, getStructureSummary } from "@/lib/structure";
import { StructureSettings } from "@/features/tenants/structure-settings";

export default async function StructureSettingsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const [result, summary] = await Promise.all([getStructure(slug), getStructureSummary(slug)]);

  return (
    <>
      <PageHeader title="Mahallu structure" description="Divisions, wards, and house-numbering conventions for this Mahallu." />

      {result === null ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to view structure settings"
              description={`Your role (${membership.role.name}) doesn't include structure.view.`}
            />
          </CardContent>
        </Card>
      ) : (
        <StructureSettings slug={slug} structure={result.structure} divisions={result.divisions} summary={summary} />
      )}
    </>
  );
}
