import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getReceiptPaymentAccount } from "@/lib/finance";
import {
  FinancialReportViewer,
  type ReportItemRow
} from "@/features/reports/financial-report-viewer";

export default async function ReceiptPaymentPage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const data = await getReceiptPaymentAccount(slug);
  const mahalleName = membership.tenant?.name || slug;

  const totalReceipts = parseFloat(data?.totalReceipts || "0");
  const totalPayments = parseFloat(data?.totalPayments || "0");
  const openingBalance = parseFloat(data?.openingBalance || "0");
  const closingBalance = parseFloat(data?.closingBalance || "0");

  const rows: ReportItemRow[] = [
    // Receipts Group
    { label: "Receipts (Inflows)", isHeader: true, indent: 0 },
    { label: "Opening Cash & Bank Balance", amount: openingBalance, indent: 1 },
    ...(data?.receipts?.map((r: any) => ({
      label: r.category || r.accountName || "Receipt",
      amount: parseFloat(r.amount || "0"),
      indent: 1 as const
    })) || []),
    { label: "Total Receipts (including Opening Balance)", amount: totalReceipts + openingBalance, isTotal: true, indent: 0 },

    // Payments Group
    { label: "Payments (Outflows)", isHeader: true, indent: 0 },
    ...(data?.payments?.map((p: any) => ({
      label: p.category || p.accountName || "Payment",
      amount: parseFloat(p.amount || "0"),
      indent: 1 as const
    })) || []),
    { label: "Total Payments", amount: totalPayments, isTotal: true, indent: 0 },

    // Closing Balance
    { label: "Closing Cash & Bank Balance", amount: closingBalance, isTotal: true, isGrandTotal: true, indent: 0 }
  ];

  return (
    <FinancialReportViewer
      slug={slug}
      mahalleName={mahalleName}
      reportTitle="Receipt & Payment Statement"
      reportCategory="Business Overview"
      dateSubtitle={`As of ${new Date().toLocaleDateString("en-GB")}`}
      basis="Cash"
      currency="INR"
      filterType="date_range"
      rows={rows}
    />
  );
}
