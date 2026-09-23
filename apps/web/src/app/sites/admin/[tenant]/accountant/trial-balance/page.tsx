import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getTrialBalance } from "@/lib/finance";
import {
  FinancialReportViewer,
  type ReportItemRow
} from "@/features/reports/financial-report-viewer";

export default async function TrialBalancePage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const data = await getTrialBalance(slug);
  const mahalleName = membership.tenant?.name || slug;

  const totalDebit = parseFloat(data?.totalDebit || "0");
  const totalCredit = parseFloat(data?.totalCredit || "0");

  const rows: ReportItemRow[] = [
    { label: "Account Balances", isHeader: true, indent: 0 },
    ...(data?.rows?.map((row: any) => ({
      label: `${row.code ? `[${row.code}] ` : ""}${row.name || row.accountName} (${row.type || "Account"})`,
      amount: parseFloat(row.debit) > 0 ? parseFloat(row.debit) : parseFloat(row.credit) > 0 ? -parseFloat(row.credit) : 0,
      indent: 1 as const
    })) || []),
    { label: "Total Debits", amount: totalDebit, isTotal: true, indent: 0 },
    { label: "Total Credits", amount: totalCredit, isTotal: true, isGrandTotal: true, indent: 0 }
  ];

  return (
    <FinancialReportViewer
      slug={slug}
      mahalleName={mahalleName}
      reportTitle="Trial Balance"
      reportCategory="Accountant"
      dateSubtitle={`As of ${new Date().toLocaleDateString("en-GB")}`}
      basis="Accrual"
      currency="INR"
      filterType="as_of"
      rows={rows}
    />
  );
}
