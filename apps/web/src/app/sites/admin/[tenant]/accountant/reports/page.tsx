import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import {
  getAccounts,
  getCollections,
  getVouchers,
  getCollectionCategories,
  getExpenseCategories,
  getBankAccounts,
  getFinanceOverview
} from "@/lib/finance";
import { ReportsCenterClient } from "@/features/reports/reports-center-client";

export default async function AccountantReportsPage({
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
    accounts,
    collectionsRes,
    vouchersRes,
    collectionCategories,
    expenseCategories,
    bankAccounts,
    overview
  ] = await Promise.all([
    getAccounts(slug).catch(() => []),
    getCollections(slug, "page=1&pageSize=1000").catch(() => null),
    getVouchers(slug, 1, 1000).catch(() => null),
    getCollectionCategories(slug).catch(() => []),
    getExpenseCategories(slug).catch(() => []),
    getBankAccounts(slug).catch(() => []),
    getFinanceOverview(slug).catch(() => null)
  ]);

  return (
    <ReportsCenterClient
      slug={slug}
      mahalleName={membership.tenant?.name || slug}
      accounts={accounts || []}
      collections={collectionsRes?.collections || []}
      vouchers={vouchersRes?.vouchers || []}
      collectionCategories={collectionCategories || []}
      expenseCategories={expenseCategories || []}
      bankAccounts={bankAccounts || []}
      overview={overview}
    />
  );
}
