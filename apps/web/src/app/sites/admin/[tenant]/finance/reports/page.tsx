import { redirect } from "next/navigation";
import Link from "next/link";
import {
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  FileText,
  TrendingUp,
  Wallet,
  Building2,
  CheckCircle2,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Receipt,
  ChevronRight,
  Calendar,
  CreditCard
} from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getFinanceOverview } from "@/lib/finance";

interface ReportItem {
  title: string;
  desc: string;
  href: string;
  badge?: string;
  icon: React.ReactNode;
}

interface ReportSection {
  id: string;
  category: string;
  subtitle: string;
  badge?: string;
  items: ReportItem[];
}

export default async function FinanceReportsPage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const overview = await getFinanceOverview(slug).catch(() => null);

  const base = `/${slug}/finance`;

  const reportSections: ReportSection[] = [
    {
      id: "statements",
      category: "1. Annual Financial Statements (Final Accounts)",
      subtitle: "Official accounting statements for general body presentation, committee audits, and annual filings.",
      badge: "Core Statements",
      items: [
        {
          title: "Receipt & Payment Account",
          desc: "Classified summary of all cash and bank inflows and outflows during the financial period.",
          href: `${base}/accounting/receipt-payment`,
          badge: "Annual / Periodic",
          icon: <Layers className="h-5 w-5 text-cyan-600" />
        },
        {
          title: "Income & Expenditure Account",
          desc: "Operational revenue versus operating expenses computing net surplus or deficit.",
          href: `${base}/accounting/income-expenditure`,
          badge: "P&L Equivalent",
          icon: <TrendingUp className="h-5 w-5 text-emerald-600" />
        },
        {
          title: "Balance Sheet",
          desc: "Comprehensive statement of financial position: Capital Fund, Fixed Assets, Current Assets & Liabilities.",
          href: `${base}/accounting/balance-sheet`,
          badge: "Position Statement",
          icon: <Building2 className="h-5 w-5 text-purple-600" />
        },
        {
          title: "Trial Balance",
          desc: "Mathematical verification of arithmetic balance across all debit and credit ledger balances.",
          href: `${base}/accounting/trial-balance`,
          badge: "Double-Entry Audit",
          icon: <CheckCircle2 className="h-5 w-5 text-teal-600" />
        }
      ]
    },
    {
      id: "books",
      category: "2. Books of Account (Day Books & Ledgers)",
      subtitle: "Primary books of chronological entry, bank records, and categorized head accounts.",
      badge: "Primary Records",
      items: [
        {
          title: "Cash Book",
          desc: "Day-to-day cash transactions with opening balance, daily receipts/payments, and physical balance.",
          href: `${base}/cash-book`,
          badge: "Cash Register",
          icon: <Wallet className="h-5 w-5 text-emerald-600" />
        },
        {
          title: "Bank Book",
          desc: "Account-wise bank deposits, cheque issuances, electronic transfers, and reconciliations.",
          href: `${base}/accounting/bank-book`,
          badge: "Bank Statements",
          icon: <Building2 className="h-5 w-5 text-blue-600" />
        },
        {
          title: "General Ledger",
          desc: "Complete head-wise ledgers classifying all transactions by Assets, Liabilities, Income, and Expenses.",
          href: `${base}/accounting/ledger`,
          badge: "Chart of Accounts",
          icon: <FileText className="h-5 w-5 text-indigo-600" />
        }
      ]
    },
    {
      id: "registers",
      category: "3. Operations & Cash Flow Registers",
      subtitle: "Day-to-day collection logs, receipt vouchers, payment disbursements, and bill registers.",
      badge: "Operational Logs",
      items: [
        {
          title: "Collections & Inflows Register",
          desc: "Itemized record of subscriptions, donation collections, and aid inflows categorized by head.",
          href: `${base}/collections`,
          badge: "Inflows",
          icon: <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
        },
        {
          title: "Official Receipts Register",
          desc: "Serialized archive of receipts issued to members, families, and donors with instant receipt views.",
          href: `${base}/receipts`,
          badge: "Issued Receipts",
          icon: <Receipt className="h-5 w-5 text-teal-600" />
        },
        {
          title: "Payments & Disbursements Register",
          desc: "Complete register of cash and bank disbursements executed against approved vouchers.",
          href: `${base}/payments`,
          badge: "Disbursements",
          icon: <CreditCard className="h-5 w-5 text-sky-600" />
        },
        {
          title: "Expense Vouchers & Bills Register",
          desc: "Expense vouchers with committee authorization, vendor invoices, and payment tracking.",
          href: `${base}/vouchers`,
          badge: "Expense Bills",
          icon: <ArrowUpRight className="h-5 w-5 text-rose-600" />
        }
      ]
    },
    {
      id: "compliance",
      category: "4. Governance & Statutory Compliance",
      subtitle: "Official regulatory filings, Waqf board compliance, and statutory audit records.",
      badge: "Compliance",
      items: [
        {
          title: "Statutory Compliance & Legal Tracker",
          desc: "Waqf Board annual filings, 12A/80G tax status, audit schedules, and committee compliance logs.",
          href: `${base}/taxes-legal`,
          badge: "Legal & Audit",
          icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <PageHeader
            title="Financial Reports & Statements"
            description="Standardized Mahallu financial statements, accounting books, and statutory audit reports."
          />
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline" className="rounded-xl text-xs font-semibold h-9 px-3 gap-1.5">
            <Link href={`${base}`}>
              <span>Finance Dashboard</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Financial Year Summary Banner */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>Financial Year</span>
            </div>
            <p className="text-sm font-bold text-foreground mt-1.5 truncate">
              {overview.currentFinancialYear || "Active Financial Year"}
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <ArrowDownLeft className="h-3.5 w-3.5" />
              <span>Month Inflows</span>
            </div>
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300 mt-1.5 font-mono">
              ₹{parseFloat(overview.thisMonthIncome || "0").toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-semibold uppercase tracking-wider">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>Month Outflows</span>
            </div>
            <p className="text-sm font-bold text-rose-700 dark:text-rose-300 mt-1.5 font-mono">
              ₹{parseFloat(overview.thisMonthExpenditure || "0").toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
            <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
              <Wallet className="h-3.5 w-3.5" />
              <span>Cash & Bank Balances</span>
            </div>
            <p className="text-sm font-bold text-foreground mt-1.5 font-mono truncate">
              Cash: ₹{parseFloat(overview.cashBalance || "0").toLocaleString("en-IN")} • Bank: ₹{parseFloat(overview.bankBalance || "0").toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      )}

      {/* Categorized Report Sections */}
      <div className="space-y-8">
        {reportSections.map((section) => (
          <div key={section.id} className="space-y-3.5">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-border/70 gap-1">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold tracking-tight text-foreground">
                    {section.category}
                  </h2>
                  {section.badge && (
                    <Badge variant="outline" className="text-[10px] font-bold py-0 h-4 border-border/80">
                      {section.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {section.subtitle}
                </p>
              </div>
            </div>

            {/* Grid of Report Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
              {section.items.map((report) => (
                <Link key={report.title} href={report.href} className="group block h-full">
                  <Card className="h-full rounded-2xl border border-border/80 bg-card p-4 transition-all duration-150 hover:border-emerald-500/60 hover:shadow-md group-hover:bg-muted/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="rounded-xl p-2.5 bg-muted/60 group-hover:bg-emerald-500/10 transition-colors shrink-0">
                          {report.icon}
                        </div>
                        {report.badge && (
                          <span className="text-[10px] font-semibold text-muted-foreground px-2 py-0.5 rounded-full border border-border/60 bg-muted/30">
                            {report.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xs font-bold text-foreground group-hover:text-emerald-600 transition-colors">
                        {report.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                        {report.desc}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-border/50 flex items-center justify-between text-[11px] font-semibold text-muted-foreground group-hover:text-emerald-600 transition-colors">
                      <span>Generate Report</span>
                      <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
