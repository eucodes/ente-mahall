import { redirect } from "next/navigation";
import { PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import {
  getFinanceSettings,
  getBankAccounts,
  getPaymentMethods,
  getCollectionCategories,
  getExpenseCategories
} from "@/lib/finance";
import { getStructure } from "@/lib/structure";
import { FinanceSettingsClient } from "./finance-settings-client";

export default async function FinanceSettingsPage({
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
    settings,
    bankAccounts,
    paymentMethods,
    collectionCategories,
    expenseCategories,
    structureData
  ] = await Promise.all([
    getFinanceSettings(slug),
    getBankAccounts(slug),
    getPaymentMethods(slug),
    getCollectionCategories(slug),
    getExpenseCategories(slug),
    getStructure(slug)
  ]);

  return (
    <>
      <PageHeader
        title="Finance Settings & Configuration"
        description="Configure accounting parameters, bank accounts, collection heads, and payment modes."
      />
      <FinanceSettingsClient
        slug={slug}
        settings={settings}
        bankAccounts={bankAccounts ?? []}
        paymentMethods={paymentMethods ?? []}
        collectionCategories={collectionCategories ?? []}
        expenseCategories={expenseCategories ?? []}
        divisions={structureData?.divisions ?? []}
      />
    </>
  );
}
