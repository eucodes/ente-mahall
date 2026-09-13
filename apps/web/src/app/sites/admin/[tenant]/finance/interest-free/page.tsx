import { redirect } from "next/navigation";
import { PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getInterestFreeAccounts } from "@/lib/finance";
import { getMembers } from "@/lib/members";
import { getFamilies } from "@/lib/business-resources";
import { InterestFreeClient } from "./interest-free-client";

export default async function InterestFreePage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const [accountsRes, membersRes, familiesRes] = await Promise.all([
    getInterestFreeAccounts(slug, 1, 100),
    getMembers(slug, 1, 100),
    getFamilies(slug, 1, 100)
  ]);

  return (
    <>
      <PageHeader
        title="Interest-Free Banking (Qard Hasan)"
        description="Community trust deposits, mutual benefit accounts, deposits, and interest-free withdrawals."
      />
      <InterestFreeClient
        slug={slug}
        initialAccounts={accountsRes?.accounts ?? []}
        members={membersRes?.members ?? []}
        families={familiesRes?.items || []}
      />
    </>
  );
}
