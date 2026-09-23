import { redirect } from "next/navigation";
import { PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getAccounts } from "@/lib/finance";
import { AccountsClient } from "./accounts-client";

export default async function ChartOfAccountsPage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const accounts = await getAccounts(slug);

  return (
    <>
      <PageHeader
        title="Chart of Accounts"
      />
      <AccountsClient slug={slug} initialAccounts={accounts ?? []} />
    </>
  );
}
