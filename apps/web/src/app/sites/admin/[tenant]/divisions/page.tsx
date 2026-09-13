import { notFound, redirect } from "next/navigation";
import { getStructure, getStructureSummary } from "@/lib/structure";
import { getFamilies } from "@/lib/business-resources";
import { getHouses } from "@/lib/houses";
import { DivisionsRegistry } from "@/features/tenants/divisions-registry";

export default async function DivisionsPage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;

  const [structureRes, summary, familiesRes, housesRes] = await Promise.all([
    getStructure(slug),
    getStructureSummary(slug),
    getFamilies(slug, 1, 1000, { status: "all" }),
    getHouses(slug, 1, 1000)
  ]);

  if (!structureRes) {
    notFound();
  }

  // If division feature is not enabled, redirect to structure settings
  if (!structureRes.structure.hasDivisions) {
    redirect(`/${slug}/settings/structure`);
  }

  return (
    <DivisionsRegistry
      slug={slug}
      structure={structureRes.structure}
      divisions={structureRes.divisions}
      families={familiesRes?.items ?? []}
      houses={housesRes?.items ?? []}
      summary={summary}
    />
  );
}
