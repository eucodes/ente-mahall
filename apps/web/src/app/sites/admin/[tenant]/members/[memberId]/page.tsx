import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getMember, getMembers, type Member } from "@/lib/members";
import { getFamilies } from "@/lib/business-resources";
import { MemberDetailView } from "@/features/tenants/member-detail-view";

export default async function MemberDetailPage({
  params
}: {
  params: Promise<{ tenant: string; memberId: string }>;
}) {
  const { tenant: slug, memberId } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const [member, familiesResult] = await Promise.all([
    getMember(slug, memberId),
    getFamilies(slug, 1, 100)
  ]);

  if (!member) notFound();

  const families = familiesResult?.items ?? [];

  let familyMembers: Member[] = [];
  if (member.familyId) {
    const famResult = await getMembers(slug, 1, 100, { familyId: member.familyId });
    familyMembers = famResult?.members ?? [];
  }

  return (
    <MemberDetailView
      slug={slug}
      member={member}
      familyMembers={familyMembers}
      families={families}
    />
  );
}
