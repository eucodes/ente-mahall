import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  PageHeader,
  StatCard,
  Button,
  Badge,
  TrendingUp,
  Scale,
  FileText,
  Wallet,
  Building2,
  Calendar,
  Layers,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  PieChart
} from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import {
  getFinanceOverview,
  getTrialBalance,
  getAccounts,
  getFinancialYears
} from "@/lib/finance";

export default async function AccountingOverviewPage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const [overview, trialBalance, accounts, financialYears] = await Promise.all([
    getFinanceOverview(slug),
    getTrialBalance(slug),
    getAccounts(slug),
    getFinancialYears(slug)
  ]);

  const base = `/${slug}/accountant`;
  const currentFy = financialYears?.find((f) => f.isCurrent) || financialYears?.[0];

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Accountant Workspace"
          description="Double-entry bookkeeping, manual journals, bulk updates, chart of accounts, and financial reports."
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild size="sm" variant="outline" className="gap-1.5 rounded-xl">
            <Link href={`${base}/reports`}>
              <Scale className="h-3.5 w-3.5" />
              Reports Center
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="gap-1.5 rounded-xl">
            <Link href={`${base}/bulk-update`}>
              <Layers className="h-3.5 w-3.5" />
              Bulk Update
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="gap-1.5 rounded-xl">
            <Link href={`${base}/chart-of-accounts`}>
              <BookOpen className="h-3.5 w-3.5" />
              Chart of Accounts
            </Link>
          </Button>
          <Button asChild size="sm" className="gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
            <Link href={`${base}/manual-journals`}>
              <TrendingUp className="h-3.5 w-3.5" />
              + Manual Journal
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Accountant KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Financial Year"
            value={currentFy?.name || overview?.currentFinancialYear || "Active FY"}
            tone="violet"
            hint={currentFy?.status === "OPEN" ? "Status: Open for posting" : "Status: Closed"}
          />
          <StatCard
            label="Trial Balance"
            value={trialBalance?.isBalanced ? "In Balance" : "Unbalanced"}
            tone={trialBalance?.isBalanced ? "green" : "rose"}
            hint={`Debits: ₹${parseFloat(trialBalance?.totalDebit || "0").toLocaleString("en-IN")} | Credits: ₹${parseFloat(trialBalance?.totalCredit || "0").toLocaleString("en-IN")}`}
          />
          <StatCard
            label="Cash & Bank Liquidity"
            value={`₹${(parseFloat(overview?.cashBalance || "0") + parseFloat(overview?.bankBalance || "0")).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
            tone="blue"
            hint={`Cash: ₹${parseFloat(overview?.cashBalance || "0").toLocaleString("en-IN")} | Bank: ₹${parseFloat(overview?.bankBalance || "0").toLocaleString("en-IN")}`}
          />
          <StatCard
            label="Chart of Accounts"
            value={`${accounts?.length || 0} Heads`}
            tone="amber"
            hint="Active ledger accounts"
          />
        </div>

        {/* Section 1: Ledgers & Primary Books */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-violet-600" />
            Ledgers & Primary Books
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link href={`${base}/manual-journals`} className="block group">
              <Card className="rounded-2xl transition-all hover:border-violet-500 hover:shadow-md h-full">
                <CardContent className="p-5 flex items-start gap-3.5">
                  <div className="rounded-xl p-3 bg-violet-500/10 text-violet-600 shrink-0">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-sm group-hover:text-violet-600 transition-colors">
                      <span>Journal Entries</span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Post multi-line debit & credit journal vouchers with balanced entries.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href={`${base}/ledger`} className="block group">
              <Card className="rounded-2xl transition-all hover:border-violet-500 hover:shadow-md h-full">
                <CardContent className="p-5 flex items-start gap-3.5">
                  <div className="rounded-xl p-3 bg-violet-500/10 text-violet-600 shrink-0">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-sm group-hover:text-violet-600 transition-colors">
                      <span>General Ledger</span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Account-wise running debit/credit transactions, opening & closing balances.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href={`${base}/chart-of-accounts`} className="block group">
              <Card className="rounded-2xl transition-all hover:border-violet-500 hover:shadow-md h-full">
                <CardContent className="p-5 flex items-start gap-3.5">
                  <div className="rounded-xl p-3 bg-violet-500/10 text-violet-600 shrink-0">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-sm group-hover:text-violet-600 transition-colors">
                      <span>Chart of Accounts</span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Manage structured 5-category chart of accounts, codes, and parent-child trees.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href={`${base}/cash-book`} className="block group">
              <Card className="rounded-2xl transition-all hover:border-emerald-500 hover:shadow-md h-full">
                <CardContent className="p-5 flex items-start gap-3.5">
                  <div className="rounded-xl p-3 bg-emerald-500/10 text-emerald-600 shrink-0">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-sm group-hover:text-emerald-600 transition-colors">
                      <span>Cash Book</span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Daily record of physical cash receipts, payments, and running balance.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href={`${base}/bank-book`} className="block group">
              <Card className="rounded-2xl transition-all hover:border-blue-500 hover:shadow-md h-full">
                <CardContent className="p-5 flex items-start gap-3.5">
                  <div className="rounded-xl p-3 bg-blue-500/10 text-blue-600 shrink-0">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-sm group-hover:text-blue-600 transition-colors">
                      <span>Bank Book</span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Bank-wise transaction register and reconciled bank account records.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Section 2: Financial Statements */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Scale className="h-4 w-4 text-emerald-600" />
            Financial Statements & Closing
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href={`${base}/trial-balance`} className="block group">
              <Card className="rounded-2xl transition-all hover:border-emerald-500 hover:shadow-md h-full">
                <CardContent className="p-5 flex items-start gap-3.5">
                  <div className="rounded-xl p-3 bg-emerald-500/10 text-emerald-600 shrink-0">
                    <Scale className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm group-hover:text-emerald-600 transition-colors">Trial Balance</h4>
                    <p className="text-xs text-muted-foreground">Debit vs Credit balance check</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href={`${base}/receipt-payment`} className="block group">
              <Card className="rounded-2xl transition-all hover:border-blue-500 hover:shadow-md h-full">
                <CardContent className="p-5 flex items-start gap-3.5">
                  <div className="rounded-xl p-3 bg-blue-500/10 text-blue-600 shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm group-hover:text-blue-600 transition-colors">Receipt & Payment</h4>
                    <p className="text-xs text-muted-foreground">Actual cash basis statement</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href={`${base}/income-expenditure`} className="block group">
              <Card className="rounded-2xl transition-all hover:border-violet-500 hover:shadow-md h-full">
                <CardContent className="p-5 flex items-start gap-3.5">
                  <div className="rounded-xl p-3 bg-violet-500/10 text-violet-600 shrink-0">
                    <PieChart className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm group-hover:text-violet-600 transition-colors">Income & Expenditure</h4>
                    <p className="text-xs text-muted-foreground">Operational surplus or deficit</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href={`${base}/balance-sheet`} className="block group">
              <Card className="rounded-2xl transition-all hover:border-amber-500 hover:shadow-md h-full">
                <CardContent className="p-5 flex items-start gap-3.5">
                  <div className="rounded-xl p-3 bg-amber-500/10 text-amber-600 shrink-0">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm group-hover:text-amber-600 transition-colors">Balance Sheet</h4>
                    <p className="text-xs text-muted-foreground">Assets, Liabilities & Equity</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Section 3: Period & Statutory Compliance */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Period & Statutory Compliance
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href={`${base}/financial-year`} className="block group">
              <Card className="rounded-2xl transition-all hover:border-primary hover:shadow-md h-full">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="rounded-xl p-3 bg-muted text-muted-foreground">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">Financial Year Management</h4>
                      <p className="text-xs text-muted-foreground">Create financial years, lock periods, and year-end rollover.</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {currentFy?.name || "Active"}
                  </Badge>
                </CardContent>
              </Card>
            </Link>

            <Link href={`${base}/taxes-legal`} className="block group">
              <Card className="rounded-2xl transition-all hover:border-primary hover:shadow-md h-full">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="rounded-xl p-3 bg-muted text-muted-foreground">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">Taxes & Legal Filings</h4>
                      <p className="text-xs text-muted-foreground">80G, 12A, Waqf board compliance, and statutory audit records.</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
