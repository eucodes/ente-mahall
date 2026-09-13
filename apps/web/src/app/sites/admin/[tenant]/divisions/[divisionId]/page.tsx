import { notFound } from "next/navigation";
import { getStructure } from "@/lib/structure";
import { getFamilies } from "@/lib/business-resources";
import { getHouses } from "@/lib/houses";
import { getMembers } from "@/lib/members";
import { DivisionDetailView } from "@/features/tenants/division-detail-view";

export default async function DivisionDetailPage({
  params
}: {
  params: Promise<{ tenant: string; divisionId: string }>;
}) {
  const { tenant: slug, divisionId } = await params;

  const [structureRes, familiesRes, housesRes, membersRes] = await Promise.all([
    getStructure(slug),
    getFamilies(slug, 1, 100, { divisionId, status: "all" }),
    getHouses(slug, 1, 100, { divisionId }),
    getMembers(slug, 1, 200, { divisionId })
  ]);

  if (!structureRes) {
    notFound();
  }

  const division = structureRes.divisions.find((d) => d.id === divisionId);

  if (!division) {
    notFound();
  }

  return (
    <DivisionDetailView
      slug={slug}
      division={division}
      structure={structureRes.structure}
      families={familiesRes?.items ?? []}
      houses={housesRes?.items ?? []}
      members={membersRes?.members ?? []}
    />
  );
}
