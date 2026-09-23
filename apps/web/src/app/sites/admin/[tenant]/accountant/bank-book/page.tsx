import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getBankAccounts, getBankBook } from "@/lib/finance";
import { TabularReportViewer, type TabularColumn } from "@/features/reports/tabular-report-viewer";

export default async function BankBookPage({
  params,
  searchParams
}: {
  params: Promise<{ tenant: string }>;
  searchParams: Promise<{ bankAccountId?: string }>;
}) {
  const { tenant: slug } = await params;
  const { bankAccountId } = await searchParams;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const bankAccounts = (await getBankAccounts(slug)) ?? [];
  const selectedBankId = bankAccountId || bankAccounts[0]?.id;

  const bankBookData = selectedBankId
    ? await getBankBook(slug, selectedBankId)
    : null;

  const mahalleName = membership.tenant?.name || slug;
  const bankName = bankBookData?.bankAccount
    ? `${bankBookData.bankAccount.bankName} - ${bankBookData.bankAccount.accountName} (${bankBookData.bankAccount.accountNumber})`
    : "Bank Accounts";

  const columns: TabularColumn[] = [
    { key: "date", label: "Date", align: "left" },
    { key: "ref", label: "Entry / Cheque #", align: "left", isMono: true },
    { key: "particulars", label: "Particulars", align: "left" },
    { key: "debit", label: "Deposits (Dr)", align: "right" },
    { key: "credit", label: "Withdrawals (Cr)", align: "right" },
    { key: "balance", label: "Running Balance", align: "right" }
  ];

  const rows = (bankBookData?.entries || []).map((entry: any) => ({
    date: entry.date ? new Date(entry.date).toLocaleDateString("en-IN") : "—",
    ref: entry.reference || entry.entryNumber || "—",
    particulars: entry.description || "Bank Entry",
    debit: parseFloat(entry.debit || "0"),
    credit: parseFloat(entry.credit || "0"),
    balance: parseFloat(entry.balance || "0")
  }));

  const openingBalance = parseFloat(bankBookData?.openingBalance || "0");
  const closingBalance = parseFloat(bankBookData?.closingBalance || "0");
  const totalDeposits = (bankBookData?.entries || []).reduce((sum: number, e: any) => sum + parseFloat(e.debit || "0"), 0);
  const totalWithdrawals = (bankBookData?.entries || []).reduce((sum: number, e: any) => sum + parseFloat(e.credit || "0"), 0);

  const summaryRows = [
    {
      label: "Opening Balance",
      values: {
        balance: openingBalance
      }
    },
    {
      label: "Total Deposits & Withdrawals",
      values: {
        debit: totalDeposits,
        credit: totalWithdrawals
      }
    },
    {
      label: "Closing Bank Balance",
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
      reportTitle={`Bank Book - ${bankName}`}
      reportCategory="Banking & Cash"
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
