import { redirect } from "next/navigation";
import { PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getFinancialYears } from "@/lib/finance";
import { FinancialYearClient } from "./financial-year-client";

export default async function FinancialYearPage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const financialYears = await getFinancialYears(slug);

  return (
    <>
      <PageHeader
        title="Financial Years"
        description="Accounting fiscal periods, year-end closing, and period locking."
      />
      <FinancialYearClient slug={slug} initialYears={financialYears ?? []} />
    </>
  );
}
