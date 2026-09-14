import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getFamily, getFamilies } from "@/lib/business-resources";
import { getHouses } from "@/lib/houses";
import { getMembers } from "@/lib/members";
import { getStructure } from "@/lib/structure";
import { FamilyDetailView } from "@/features/tenants/family-detail-view";

export default async function FamilyDetailPage({
  params
}: {
  params: Promise<{ tenant: string; familyId: string }>;
}) {
  const { tenant: slug, familyId } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const [family, housesResult, allFamiliesResult, structureResult] = await Promise.all([
    getFamily(slug, familyId),
    getHouses(slug, 1, 100, { status: "active" }),
    getFamilies(slug, 1, 100),
    getStructure(slug).catch(() => null)
  ]);
  if (!family) notFound();

  const houses = housesResult?.items ?? [];
  const allFamilies = allFamiliesResult?.items ?? [];
  const membersResult = await getMembers(slug, 1, 100, { familyId });
  const members = membersResult?.members ?? [];

  return (
    <FamilyDetailView
      slug={slug}
      family={family}
      members={members}
      houses={houses}
      allFamilies={allFamilies}
      hasFamilyStatuses={structureResult?.structure?.hasFamilyStatuses ?? false}
    />
  );
}
