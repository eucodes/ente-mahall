import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getCashBook } from "@/lib/finance";
import { TabularReportViewer, type TabularColumn } from "@/features/reports/tabular-report-viewer";

export default async function CashBookPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const result = await getCashBook(slug);
  const mahalleName = membership.tenant?.name || slug;

  const columns: TabularColumn[] = [
    { key: "date", label: "Date", align: "left" },
    { key: "ref", label: "Voucher / Ref", align: "left", isMono: true },
    { key: "particulars", label: "Particulars", align: "left" },
    { key: "debit", label: "Receipts (Dr)", align: "right" },
    { key: "credit", label: "Payments (Cr)", align: "right" },
    { key: "balance", label: "Running Balance", align: "right" }
  ];

  const rows = (result?.rows || []).map((row: any) => {
    const dateStr = row.voucher?.date || row.date || "";
    const ref = row.voucher?.voucherNumber || row.entryNumber || row.reference || "—";
    const desc = row.voucher?.description || row.description || row.voucher?.partyName || row.voucher?.account?.name || "Cash Entry";
    const isReceipt = row.voucher ? row.voucher.type === "RECEIPT" : !!row.receipts;
    const amount = parseFloat(row.voucher ? row.voucher.amount : (row.receipts || row.payments || "0"));

    return {
      date: dateStr ? new Date(dateStr).toLocaleDateString("en-IN") : "—",
      ref,
      particulars: desc,
      debit: isReceipt ? amount : 0,
      credit: !isReceipt ? amount : 0,
      balance: parseFloat(row.balance || "0")
    };
  });

  const openingBalance = parseFloat(result?.openingBalance || "0");
  const totalReceipts = parseFloat(result?.totalReceipts || "0");
  const totalPayments = (result?.rows || []).reduce((sum: number, r: any) => {
    const isReceipt = r.voucher ? r.voucher.type === "RECEIPT" : !!r.receipts;
    const amt = parseFloat(r.voucher ? r.voucher.amount : (r.payments || "0"));
    return !isReceipt ? sum + amt : sum;
  }, 0);
  const closingBalance = parseFloat(result?.closingBalance || "0");

  const summaryRows = [
    {
      label: "Opening Balance",
      values: {
        balance: openingBalance
      }
    },
    {
      label: "Total Receipts & Payments",
      values: {
        debit: totalReceipts,
        credit: totalPayments
      }
    },
    {
      label: "Closing Balance",
      values: {
        balance: closingBalance
      },
      isGrandTotal: true
    }
  ];

  return (
    <TabularReportViewer
      slug={slug}
      mahalleName={mahalleName}
      reportTitle="Cash Book"
      reportCategory="Banking & Cash"
      dateSubtitle={`As of ${new Date().toLocaleDateString("en-GB")}`}
      basis="Cash"
      currency="INR"
      columns={columns}
      rows={rows}
      summaryRows={summaryRows}
      filterType="as_of"
    />
  );
}
