import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getIncomeExpenditure } from "@/lib/finance";
import {
  FinancialReportViewer,
  type ReportItemRow
} from "@/features/reports/financial-report-viewer";

export default async function IncomeExpenditurePage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const data = await getIncomeExpenditure(slug);
  const mahalleName = membership.tenant?.name || slug;

  const totalIncome = parseFloat(data?.totalIncome || "0");
  const totalExpense = parseFloat(data?.totalExpense || data?.totalExpenditure || "0");
  const netSurplus = parseFloat(data?.surplusOrDeficit ?? data?.netSurplus ?? (totalIncome - totalExpense).toString());

  const incomeList = data?.incomes || data?.income || [];
  const expenseList = data?.expenses || data?.expenditure || [];

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toLocaleDateString("en-GB");
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toLocaleDateString("en-GB");

  const rows: ReportItemRow[] = [
    // Operating Income
    { label: "Operating Income", isHeader: true, indent: 0 },
    ...(incomeList.map((inc: any) => ({
      label: inc.name || inc.accountName,
      amount: parseFloat(inc.amount || "0"),
      indent: 1 as const
    }))),
    { label: "Total for Operating Income", amount: totalIncome, isTotal: true, indent: 0 },

    // Cost of Goods Sold / Direct Inflow Costs
    { label: "Cost of Goods Sold", isHeader: true, indent: 0 },
    { label: "Total for Cost of Goods Sold", amount: 0, isTotal: true, indent: 0 },

    // Gross Profit
    { label: "Gross Profit", amount: totalIncome, isTotal: true, isGrandTotal: true, indent: 0 },

    // Operating Expense
    { label: "Operating Expense", isHeader: true, indent: 0 },
    ...(expenseList.map((exp: any) => ({
      label: exp.name || exp.accountName,
      amount: parseFloat(exp.amount || "0"),
      indent: 1 as const
    }))),
    { label: "Total for Operating Expense", amount: totalExpense, isTotal: true, indent: 0 },

    // Operating Profit
    { label: "Operating Profit", amount: netSurplus, isTotal: true, indent: 0 },

    // Non Operating Income
    { label: "Non Operating Income", isHeader: true, indent: 0 },
    { label: "Total for Non Operating Income", amount: 0, isTotal: true, indent: 0 },

    // Non Operating Expense
    { label: "Non Operating Expense", isHeader: true, indent: 0 },
    { label: "Total for Non Operating Expense", amount: 0, isTotal: true, indent: 0 },

    // Net Profit/Loss
    { label: "Net Profit/Loss", amount: netSurplus, isTotal: true, isGrandTotal: true, indent: 0 },

    // Other Comprehensive Income
    { label: "Other Comprehensive Income", isHeader: true, indent: 0 },
    { label: "Total for Other Comprehensive Income", amount: 0, isTotal: true, indent: 0 }
  ];

  return (
    <FinancialReportViewer
      slug={slug}
      mahalleName={mahalleName}
      reportTitle="Profit and Loss"
      reportCategory="Business Overview"
      dateSubtitle={`From ${firstDay} To ${lastDay}`}
      basis="Accrual"
      currency="INR"
      filterType="date_range"
      initialDateFilter="this_month"
      rows={rows}
    />
  );
}
