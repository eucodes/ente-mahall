import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getBalanceSheet } from "@/lib/finance";
import {
  FinancialReportViewer,
  type ReportItemRow
} from "@/features/reports/financial-report-viewer";

export default async function BalanceSheetPage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const data = await getBalanceSheet(slug);
  const mahalleName = membership.tenant?.name || slug;

  const totalAssets = parseFloat(data?.totalAssets || "0");
  const totalLiabAndEq = parseFloat(data?.totalLiabilitiesAndEquity || "0");
  const netSurplus = parseFloat(data?.netSurplus || "0");

  const rows: ReportItemRow[] = [
    // Assets Group
    { label: "Assets", isHeader: true, indent: 0 },
    { label: "Current Assets", isHeader: true, indent: 1 },
    { label: "Cash and Cash Equivalents", isHeader: true, indent: 2 },

    // Cash items
    ...(data?.assets?.filter((a: any) => (a.name || "").toLowerCase().includes("cash")).map((a: any) => ({
      label: a.name || a.accountName,
      amount: parseFloat(a.amount || "0"),
      indent: 3 as const
    })) || []),
    { label: "Total for Cash", amount: data?.assets?.filter((a: any) => (a.name || "").toLowerCase().includes("cash")).reduce((sum: number, a: any) => sum + parseFloat(a.amount || "0"), 0) || 0, isTotal: true, indent: 2 },

    // Bank items
    ...(data?.assets?.filter((a: any) => (a.name || "").toLowerCase().includes("bank")).map((a: any) => ({
      label: a.name || a.accountName,
      amount: parseFloat(a.amount || "0"),
      indent: 3 as const
    })) || []),
    { label: "Total for Bank", amount: data?.assets?.filter((a: any) => (a.name || "").toLowerCase().includes("bank")).reduce((sum: number, a: any) => sum + parseFloat(a.amount || "0"), 0) || 0, isTotal: true, indent: 2 },

    { label: "Total for Cash and Cash Equivalents", amount: totalAssets, isTotal: true, indent: 1 },

    // Accounts Receivable
    { label: "Accounts Receivable", isHeader: true, indent: 2 },
    { label: "Total for Accounts Receivable", amount: 0, isTotal: true, indent: 1 },

    // Other current assets
    { label: "Other current assets", isHeader: true, indent: 2 },
    ...(data?.assets?.filter((a: any) => !(a.name || "").toLowerCase().includes("cash") && !(a.name || "").toLowerCase().includes("bank")).map((a: any) => ({
      label: a.name || a.accountName,
      amount: parseFloat(a.amount || "0"),
      indent: 3 as const
    })) || []),
    { label: "Total for Other current assets", amount: data?.assets?.filter((a: any) => !(a.name || "").toLowerCase().includes("cash") && !(a.name || "").toLowerCase().includes("bank")).reduce((sum: number, a: any) => sum + parseFloat(a.amount || "0"), 0) || 0, isTotal: true, indent: 1 },
    { label: "Total for Current Assets", amount: totalAssets, isTotal: true, indent: 0 },

    // Non Current Assets
    { label: "Non Current Assets", isHeader: true, indent: 1 },
    { label: "Total for Non Current Assets", amount: 0, isTotal: true, indent: 0 },

    // Fixed Assets
    { label: "Fixed Assets", isHeader: true, indent: 1 },
    { label: "Total for Fixed Assets", amount: 0, isTotal: true, indent: 0 },

    // Other Assets
    { label: "Other Assets", isHeader: true, indent: 1 },
    { label: "Total for Other Assets", amount: 0, isTotal: true, indent: 0 },

    // Grand Total for Assets
    { label: "Total for Assets", amount: totalAssets, isTotal: true, isGrandTotal: true, indent: 0 },

    // Liabilities & Equities Group
    { label: "Liabilities & Equities", isHeader: true, indent: 0 },
    { label: "Liabilities", isHeader: true, indent: 1 },
    { label: "Current Liabilities", isHeader: true, indent: 2 },
    { label: "Accounts Payable", isHeader: true, indent: 3 },
    { label: "Total for Accounts Payable", amount: 0, isTotal: true, indent: 2 },
    { label: "Other Current Liabilities", isHeader: true, indent: 3 },
    ...(data?.liabilities?.map((l: any) => ({
      label: l.name || l.accountName,
      amount: parseFloat(l.amount || "0"),
      indent: 3 as const
    })) || []),
    { label: "Total for Other Current Liabilities", amount: parseFloat(data?.totalLiabilities || "0"), isTotal: true, indent: 2 },
    { label: "Total for Current Liabilities", amount: parseFloat(data?.totalLiabilities || "0"), isTotal: true, indent: 1 },

    // Non Current Liabilities
    { label: "Non Current Liabilities", isHeader: true, indent: 2 },
    { label: "Total for Non Current Liabilities", amount: 0, isTotal: true, indent: 1 },
    { label: "Other Liabilities", isHeader: true, indent: 2 },
    { label: "Total for Other Liabilities", amount: 0, isTotal: true, indent: 1 },
    { label: "Total for Liabilities", amount: parseFloat(data?.totalLiabilities || "0"), isTotal: true, indent: 0 },

    // Equities
    { label: "Equities", isHeader: true, indent: 1 },
    { label: "Current Year Earnings", amount: netSurplus, indent: 2 },
    { label: "Owner's Equity / Mahallu General Fund", isHeader: true, indent: 2 },
    ...(data?.equity?.map((eq: any) => ({
      label: eq.name || eq.accountName,
      amount: parseFloat(eq.amount || "0"),
      indent: 3 as const
    })) || []),
    { label: "Total for Owner's Equity / General Fund", amount: parseFloat(data?.totalEquity || "0"), isTotal: true, indent: 2 },
    { label: "Total for Equities", amount: parseFloat(data?.totalEquity || "0") + netSurplus, isTotal: true, indent: 1 },

    // Grand Total for Liabilities & Equities
    { label: "Total for Liabilities & Equities", amount: totalLiabAndEq, isTotal: true, isGrandTotal: true, indent: 0 }
  ];

  return (
    <FinancialReportViewer
      slug={slug}
      mahalleName={mahalleName}
      reportTitle="Balance Sheet"
      reportCategory="Business Overview"
      dateSubtitle={`As of ${new Date().toLocaleDateString("en-GB")}`}
      basis="Accrual"
      currency="INR"
      filterType="as_of"
      rows={rows}
    />
  );
}
