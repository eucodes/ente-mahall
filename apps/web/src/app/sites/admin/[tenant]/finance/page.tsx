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
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TrendingUp,
  Receipt,
  Wallet,
  Building2,
  AlertCircle,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Scale,
  ArrowRight
} from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getFinanceOverview } from "@/lib/finance";

export default async function FinanceOverviewPage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const overview = await getFinanceOverview(slug);

  if (!overview) {
    return (
      <>
        <PageHeader
          title="Finance Dashboard"
          description="Operational finances, accounting ledgers, and financial health."
        />
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to view finance"
              description={`Your role (${membership.role.name}) doesn't include finance access.`}
            />
          </CardContent>
        </Card>
      </>
    );
  }

  const base = `/${slug}/finance`;

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Finance Dashboard"
          description={`Financial Year: ${overview.currentFinancialYear || "Active FY"}`}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild size="sm" variant="outline" className="gap-1.5 rounded-xl">
            <Link href={`${base}/receipts`}>
              <Receipt className="h-3.5 w-3.5" />
              Receipts
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="gap-1.5 rounded-xl">
            <Link href={`${base}/vouchers`}>
              <ArrowUpRight className="h-3.5 w-3.5" />
              Record Expense
            </Link>
          </Button>
          <Button asChild size="sm" className="gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link href={`${base}/collections`}>
              <Plus className="h-3.5 w-3.5" />
              Record Collection
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Accountant Gateway Banner */}
       

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Today's Collections"
            value={`₹${parseFloat(overview.todayCollections).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
            tone="green"
            hint="Receipts recorded today"
          />
          <StatCard
            label="Today's Payments"
            value={`₹${parseFloat(overview.todayPayments).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
            tone="blue"
            hint="Expenses paid out today"
          />
          <StatCard
            label="This Month Income"
            value={`₹${parseFloat(overview.thisMonthIncome).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
            tone="violet"
            hint={`Expenses: ₹${parseFloat(overview.thisMonthExpenditure).toLocaleString("en-IN")}`}
          />
          <StatCard
            label="Outstanding Dues"
            value={`₹${parseFloat(overview.outstandingDues).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
            tone="amber"
            hint="Uncollected receivables"
          />
        </div>

        {/* Liquidity summary */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="rounded-2xl border border-border/80 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-emerald-600" />
                  Cash Balance
                </CardTitle>
                <Link href={`/${slug}/accounting/cash-book`} className="text-xs text-emerald-600 hover:underline">
                  View Cash Book &rarr;
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
                ₹{parseFloat(overview.cashBalance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Available petty and operational physical cash</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/80 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  Bank Accounts Balance
                </CardTitle>
                <Link href={`/${slug}/accounting/bank-book`} className="text-xs text-blue-600 hover:underline">
                  View Bank Book &rarr;
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono text-blue-700 dark:text-blue-400">
                ₹{parseFloat(overview.bankBalance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total balances across all configured bank accounts</p>
            </CardContent>
          </Card>
        </div>

        {/* 6-Month Income vs Expense Trend */}
        <Card className="rounded-2xl border border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              6-Month Income vs Expense Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overview.trend && overview.trend.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                  {overview.trend.map((m) => (
                    <div key={m.month} className="rounded-xl border border-border/70 p-3 bg-muted/20">
                      <div className="text-xs font-semibold text-muted-foreground">{m.month}</div>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium">In:</span>
                          <span className="font-mono">₹{m.collections.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-rose-600 dark:text-rose-400 font-medium">Out:</span>
                          <span className="font-mono">₹{m.expenses.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No historical trend data yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Navigation Cards - Simple Entries for everyday operations */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href={`${base}/collections`} className="block group">
            <Card className="rounded-2xl transition-all hover:border-emerald-500 hover:shadow-md h-full">
              <CardContent className="p-5 flex items-center gap-3">
                <div className="rounded-xl p-3 bg-emerald-500/10 text-emerald-600">
                  <ArrowDownLeft className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm group-hover:text-emerald-600 transition-colors">Collections</h4>
                  <p className="text-xs text-muted-foreground">Friday, Family, Donation</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href={`${base}/vouchers`} className="block group">
            <Card className="rounded-2xl transition-all hover:border-blue-500 hover:shadow-md h-full">
              <CardContent className="p-5 flex items-center gap-3">
                <div className="rounded-xl p-3 bg-blue-500/10 text-blue-600">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm group-hover:text-blue-600 transition-colors">Expenses & Bills</h4>
                  <p className="text-xs text-muted-foreground">Electricity, repairs & payments</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href={`${base}/dues`} className="block group">
            <Card className="rounded-2xl transition-all hover:border-violet-500 hover:shadow-md h-full">
              <CardContent className="p-5 flex items-center gap-3">
                <div className="rounded-xl p-3 bg-violet-500/10 text-violet-600">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm group-hover:text-violet-600 transition-colors">Dues & Subscriptions</h4>
                  <p className="text-xs text-muted-foreground">Monthly member contributions</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href={`${base}/salary`} className="block group">
            <Card className="rounded-2xl transition-all hover:border-amber-500 hover:shadow-md h-full">
              <CardContent className="p-5 flex items-center gap-3">
                <div className="rounded-xl p-3 bg-amber-500/10 text-amber-600">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm group-hover:text-amber-600 transition-colors">Staff Salary</h4>
                  <p className="text-xs text-muted-foreground">Imam & teacher payroll</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity Tables */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Collections */}
          <Card className="rounded-2xl border border-border/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Receipt className="h-4 w-4 text-emerald-600" />
                Recent Collections
              </CardTitle>
              <Link href={`${base}/collections`} className="text-xs text-emerald-600 hover:underline">
                View All
              </Link>
            </CardHeader>
            <CardContent>
              {overview.recentCollections && overview.recentCollections.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Date</TableHead>
                        <TableHead className="text-xs">Payer / Family</TableHead>
                        <TableHead className="text-xs">Category</TableHead>
                        <TableHead className="text-xs text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {overview.recentCollections.map((c: any) => (
                        <TableRow key={c.id}>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(c.date).toLocaleDateString("en-IN")}
                          </TableCell>
                          <TableCell className="text-xs font-medium">
                            {c.payerName || c.family?.name || c.member?.fullName || "Anonymous"}
                          </TableCell>
                          <TableCell className="text-xs">
                            <Badge variant="outline" className="text-[10px]">{c.category?.name || c.type || c.collectionType}</Badge>
                          </TableCell>
                          <TableCell className="text-xs text-right font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                            +₹{parseFloat(c.amount).toLocaleString("en-IN")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">No collections recorded recently.</p>
              )}
            </CardContent>
          </Card>

          {/* Pending Dues */}
          <Card className="rounded-2xl border border-border/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                Pending Dues & Arrears
              </CardTitle>
              <Link href={`${base}/dues`} className="text-xs text-amber-600 hover:underline">
                View All
              </Link>
            </CardHeader>
            <CardContent>
              {overview.recentPendingDues && overview.recentPendingDues.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Member / Family</TableHead>
                        <TableHead className="text-xs">Particulars</TableHead>
                        <TableHead className="text-xs">Due Date</TableHead>
                        <TableHead className="text-xs text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {overview.recentPendingDues.map((d: any) => (
                        <TableRow key={d.id}>
                          <TableCell className="text-xs font-medium">
                            {d.member?.fullName || d.family?.name || "—"}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{d.title}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(d.dueDate).toLocaleDateString("en-IN")}
                          </TableCell>
                          <TableCell className="text-xs text-right font-mono font-semibold text-amber-700 dark:text-amber-400">
                            ₹{parseFloat(d.amount).toLocaleString("en-IN")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">No pending dues found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
