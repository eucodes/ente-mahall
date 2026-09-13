import { redirect } from "next/navigation";
import Link from "next/link";
import {
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  FileText,
  TrendingUp,
  Wallet,
  Building2,
  CheckCircle2,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck
} from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";

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

  const base = `/${slug}/finance`;

  const reportCards = [
    {
      title: "Cash Book",
      desc: "Chronological cash transactions with opening, running, and closing balance.",
      href: `${base}/cash-book`,
      icon: <Wallet className="h-5 w-5 text-emerald-600" />
    },
    {
      title: "Bank Book",
      desc: "Account-wise bank deposits, withdrawals, and bank reconciliations.",
      href: `${base}/accounting/bank-book`,
      icon: <Building2 className="h-5 w-5 text-blue-600" />
    },
    {
      title: "General Ledger",
      desc: "Detailed statement of accounts across assets, liabilities, income, and expenses.",
      href: `${base}/accounting/ledger`,
      icon: <FileText className="h-5 w-5 text-indigo-600" />
    },
    {
      title: "Trial Balance",
      desc: "Verification of arithmetic accuracy with double-entry debit and credit totals.",
      href: `${base}/accounting/trial-balance`,
      icon: <CheckCircle2 className="h-5 w-5 text-teal-600" />
    },
    {
      title: "Receipt & Payment Account",
      desc: "Classified summary of all cash and bank receipts and disbursements.",
      href: `${base}/accounting/receipt-payment`,
      icon: <Layers className="h-5 w-5 text-cyan-600" />
    },
    {
      title: "Income & Expenditure Account",
      desc: "Operating revenue vs expenses computing periodic surplus or deficit.",
      href: `${base}/accounting/income-expenditure`,
      icon: <TrendingUp className="h-5 w-5 text-amber-600" />
    },
    {
      title: "Balance Sheet",
      desc: "Position statement of Assets, Liabilities, and Equity Reserves.",
      href: `${base}/accounting/balance-sheet`,
      icon: <Building2 className="h-5 w-5 text-purple-600" />
    },
    {
      title: "Collections & Inflows Report",
      desc: "Itemized receipts and donor contributions categorized by head.",
      href: `${base}/collections`,
      icon: <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
    },
    {
      title: "Vouchers & Disbursements Register",
      desc: "Expense records with committee approval and voucher tracking.",
      href: `${base}/vouchers`,
      icon: <ArrowUpRight className="h-5 w-5 text-rose-600" />
    },
    {
      title: "Dues & Outstanding Receivables",
      desc: "Pending membership dues, arrears, and collection tracking.",
      href: `${base}/dues`,
      icon: <FileText className="h-5 w-5 text-amber-600" />
    },
    {
      title: "Staff Payroll Register",
      desc: "Staff remuneration breakdown with basic salary, allowances, and deductions.",
      href: `${base}/salary`,
      icon: <FileText className="h-5 w-5 text-blue-600" />
    },
    {
      title: "Interest-Free Banking Register",
      desc: "Mutual benefit trust accounts, community deposits, and withdrawals.",
      href: `${base}/interest-free`,
      icon: <Wallet className="h-5 w-5 text-violet-600" />
    },
    {
      title: "Statutory Compliance Tracker",
      desc: "Waqf board filings, 12A/80G status, and statutory audit obligations.",
      href: `${base}/taxes-legal`,
      icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />
    }
  ];

  return (
    <>
      <PageHeader
        title="Financial Reports & Statements"
        description="Standardized Mahallu financial statements, accounting books, and statutory reports."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reportCards.map((report) => (
          <Link key={report.title} href={report.href} className="group block">
            <Card className="h-full rounded-2xl border border-border/80 transition-all hover:border-emerald-500 hover:shadow-md">
              <CardHeader className="flex flex-row items-start gap-4 pb-2">
                <div className="rounded-xl p-3 bg-muted/60 group-hover:bg-emerald-500/10 transition-colors">
                  {report.icon}
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold group-hover:text-emerald-600 transition-colors">
                    {report.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {report.desc}
                  </p>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
