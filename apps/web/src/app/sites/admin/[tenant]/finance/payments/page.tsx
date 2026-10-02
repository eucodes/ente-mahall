import { redirect } from "next/navigation";
import { PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import {
  getVouchers,
  getAccounts,
  getExpenseCategories,
  getPaymentMethods,
  getBankAccounts,
  getFinanceFunds
} from "@/lib/finance";
import { VouchersClient } from "./vouchers-client";

export default async function VouchersPage({
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
    vouchersRes,
    accounts,
    categories,
    paymentMethods,
    bankAccounts,
    funds
  ] = await Promise.all([
    getVouchers(slug, 1, 100),
    getAccounts(slug),
    getExpenseCategories(slug),
    getPaymentMethods(slug),
    getBankAccounts(slug),
    getFinanceFunds(slug)
  ]);

  return (
    <>
      <PageHeader
        title="Payments"
      />
      <VouchersClient
        slug={slug}
        initialVouchers={vouchersRes?.vouchers ?? []}
        accounts={accounts ?? []}
        funds={funds ?? []}
        expenseCategories={categories ?? []}
        paymentMethods={paymentMethods ?? []}
        bankAccounts={bankAccounts ?? []}
      />
    </>
  );
}
