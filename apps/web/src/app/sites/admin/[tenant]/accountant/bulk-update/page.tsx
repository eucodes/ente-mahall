import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import {
  getAccounts,
  getFinanceFunds,
  getCollectionCategories,
  getExpenseCategories,
  getCollections,
  getVouchers
} from "@/lib/finance";
import { BulkUpdateClient } from "./bulk-update-client";

export default async function BulkUpdatePage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const [
    funds,
    accounts,
    collectionCategories,
    expenseCategories,
    collectionsRes,
    vouchersRes
  ] = await Promise.all([
    getFinanceFunds(slug).catch(() => []),
    getAccounts(slug).catch(() => []),
    getCollectionCategories(slug).catch(() => []),
    getExpenseCategories(slug).catch(() => []),
    getCollections(slug, "page=1&pageSize=1000").catch(() => null),
    getVouchers(slug, 1, 1000).catch(() => null)
  ]);

  return (
    <BulkUpdateClient
      slug={slug}
      mahalleName={membership.tenant?.name || slug}
      funds={funds || []}
      accounts={accounts || []}
      collectionCategories={collectionCategories || []}
      expenseCategories={expenseCategories || []}
      collections={collectionsRes?.collections || []}
      vouchers={vouchersRes?.vouchers || []}
    />
  );
}
