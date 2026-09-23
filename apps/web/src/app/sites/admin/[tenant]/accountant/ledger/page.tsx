import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getAccounts, getGeneralLedger } from "@/lib/finance";
import { TabularReportViewer, type TabularColumn } from "@/features/reports/tabular-report-viewer";

export default async function LedgerPage({
  params,
  searchParams
}: {
  params: Promise<{ tenant: string }>;
  searchParams: Promise<{ accountId?: string }>;
}) {
  const { tenant: slug } = await params;
  const { accountId } = await searchParams;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const accounts = (await getAccounts(slug)) ?? [];
  const selectedAccountId = accountId || accounts[0]?.id;

  const ledgerData = selectedAccountId
    ? await getGeneralLedger(slug, selectedAccountId)
    : null;

  const mahalleName = membership.tenant?.name || slug;
  const accountName = ledgerData?.account
    ? `${ledgerData.account.code ? `[${ledgerData.account.code}] ` : ""}${ledgerData.account.name}`
    : "General Ledger";

  const columns: TabularColumn[] = [
    { key: "date", label: "Date", align: "left" },
    { key: "ref", label: "Entry #", align: "left", isMono: true },
    { key: "particulars", label: "Particulars", align: "left" },
    { key: "debit", label: "Debit (Dr)", align: "right" },
    { key: "credit", label: "Credit (Cr)", align: "right" },
    { key: "balance", label: "Running Balance", align: "right" }
  ];

  const rows = (ledgerData?.entries || []).map((entry: any) => ({
    date: entry.date ? new Date(entry.date).toLocaleDateString("en-IN") : "—",
    ref: entry.reference || entry.entryNumber || "—",
    particulars: entry.description || "General Ledger Posting",
    debit: parseFloat(entry.debit || "0"),
    credit: parseFloat(entry.credit || "0"),
    balance: parseFloat(entry.balance || "0")
  }));

  const openingBalance = parseFloat(ledgerData?.openingBalance || "0");
  const closingBalance = parseFloat(ledgerData?.closingBalance || "0");
  const totalDebit = (ledgerData?.entries || []).reduce((sum: number, e: any) => sum + parseFloat(e.debit || "0"), 0);
  const totalCredit = (ledgerData?.entries || []).reduce((sum: number, e: any) => sum + parseFloat(e.credit || "0"), 0);

  const summaryRows = [
    {
      label: "Opening Balance",
      values: {
        balance: openingBalance
      }
    },
    {
      label: "Total Debits & Credits",
      values: {
        debit: totalDebit,
        credit: totalCredit
      }
    },
    {
      label: "Closing Ledger Balance",
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
      reportTitle={`General Ledger - ${accountName}`}
      reportCategory="Accountant"
      dateSubtitle={`As of ${new Date().toLocaleDateString("en-GB")}`}
      basis="Accrual"
      currency="INR"
      columns={columns}
      rows={rows}
      summaryRows={summaryRows}
      filterType="as_of"
    />
  );
}
