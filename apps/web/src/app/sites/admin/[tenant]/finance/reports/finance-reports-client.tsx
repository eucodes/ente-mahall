"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Select,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Download,
  Printer,
  Calendar,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  TrendingUp,
  Wallet
} from "@mahalle/ui";
import type {
  FinanceCollection,
  Voucher,
  CollectionCategory,
  ExpenseCategory,
  FinancePaymentMethod,
  FinanceOverview
} from "@/lib/finance";

export interface UnifiedTransaction {
  id: string;
  date: string;
  type: "INFLOW" | "OUTFLOW";
  docNumber: string;
  partyName: string;
  partySubtext?: string;
  categoryName: string;
  categoryId?: string;
  paymentMethod: string;
  bankAccountName?: string;
  amount: number;
  description?: string;
  rawCollection?: FinanceCollection;
  rawVoucher?: Voucher;
}

interface Props {
  slug: string;
  mahalleName: string;
  overview: FinanceOverview | null;
  collections: FinanceCollection[];
  vouchers: Voucher[];
  collectionCategories: CollectionCategory[];
  expenseCategories: ExpenseCategory[];
  paymentMethods: FinancePaymentMethod[];
}

export function FinanceReportsClient({
  slug,
  mahalleName,
  overview,
  collections,
  vouchers,
  collectionCategories,
  expenseCategories,
  paymentMethods
}: Props) {
  // Filters
  const [filterType, setFilterType] = useState<"ALL" | "INFLOW" | "OUTFLOW">("ALL");
  const [dateRange, setDateRange] = useState<"ALL" | "TODAY" | "THIS_MONTH" | "THIS_YEAR" | "CUSTOM">("ALL");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedMethod, setSelectedMethod] = useState("ALL");
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "amount_desc" | "amount_asc" | "category" | "party">("date_desc");

  // Transform collections and vouchers into unified transactions
  const allTransactions = useMemo<UnifiedTransaction[]>(() => {
    const list: UnifiedTransaction[] = [];

    // Collections (Inflows)
    collections.forEach((c) => {
      const party = c.donorName || c.member?.fullName || c.family?.name || "Anonymous";
      const sub = c.family && c.donorName && c.donorName !== c.family.name ? `Family: ${c.family.name}` : undefined;
      list.push({
        id: `col-${c.id}`,
        date: c.date,
        type: "INFLOW",
        docNumber: c.receipt?.receiptNumber || c.collectionNumber || "—",
        partyName: party,
        partySubtext: sub,
        categoryName: c.category?.name || c.type || "Collection",
        categoryId: c.categoryId || undefined,
        paymentMethod: c.paymentMethod || "Cash",
        bankAccountName: undefined,
        amount: parseFloat(c.amount || "0"),
        description: c.description || undefined,
        rawCollection: c
      });
    });

    // Vouchers (Outflows)
    vouchers.forEach((v) => {
      const party = v.payeeName || v.partyName || v.member?.fullName || "General Payee";
      list.push({
        id: `vch-${v.id}`,
        date: v.date,
        type: "OUTFLOW",
        docNumber: v.voucherNumber || "—",
        partyName: party,
        partySubtext: undefined,
        categoryName: v.expenseCategory?.name || v.account?.name || "General Expense",
        categoryId: v.expenseCategoryId || undefined,
        paymentMethod: v.paymentMethod || "Cash",
        bankAccountName: v.bankAccount ? `${v.bankAccount.bankName} (${v.bankAccount.accountName})` : undefined,
        amount: parseFloat(v.amount || "0"),
        description: v.description || v.notes || undefined,
        rawVoucher: v
      });
    });

    return list;
  }, [collections, vouchers]);

  // Date Checker
  function matchesDate(dateStr?: string | null) {
    if (dateRange === "ALL") return true;
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return true;
    const now = new Date();

    if (dateRange === "TODAY") {
      return d.toDateString() === now.toDateString();
    }
    if (dateRange === "THIS_MONTH") {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    if (dateRange === "THIS_YEAR") {
      return d.getFullYear() === now.getFullYear();
    }
    if (dateRange === "CUSTOM") {
      if (customStartDate && d < new Date(customStartDate)) return false;
      if (customEndDate) {
        const end = new Date(customEndDate);
        end.setHours(23, 59, 59, 999);
        if (d > end) return false;
      }
      return true;
    }
    return true;
  }

  // Filtered & Sorted Transactions
  const filteredTransactions = useMemo(() => {
    return allTransactions
      .filter((t) => {
        // Type filter
        if (filterType !== "ALL" && t.type !== filterType) return false;

        // Date filter
        if (!matchesDate(t.date)) return false;

        // Category filter
        if (selectedCategory !== "ALL") {
          if (t.categoryName !== selectedCategory && t.categoryId !== selectedCategory) {
            return false;
          }
        }

        // Payment method filter
        if (selectedMethod !== "ALL" && t.paymentMethod !== selectedMethod) {
          return false;
        }

        // Search filter
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const doc = t.docNumber.toLowerCase();
          const party = t.partyName.toLowerCase();
          const cat = t.categoryName.toLowerCase();
          const desc = (t.description || "").toLowerCase();
          if (!doc.includes(term) && !party.includes(term) && !cat.includes(term) && !desc.includes(term)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "date_desc") return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === "date_asc") return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortBy === "amount_desc") return b.amount - a.amount;
        if (sortBy === "amount_asc") return a.amount - b.amount;
        if (sortBy === "category") return a.categoryName.localeCompare(b.categoryName);
        if (sortBy === "party") return a.partyName.localeCompare(b.partyName);
        return 0;
      });
  }, [allTransactions, filterType, dateRange, customStartDate, customEndDate, selectedCategory, selectedMethod, searchTerm, sortBy]);

  // Financial KPI totals for filtered items
  const { totalInflow, totalOutflow, netBalance, inflowCount, outflowCount } = useMemo(() => {
    let inflow = 0;
    let outflow = 0;
    let inCount = 0;
    let outCount = 0;

    filteredTransactions.forEach((t) => {
      if (t.type === "INFLOW") {
        inflow += t.amount;
        inCount++;
      } else {
        outflow += t.amount;
        outCount++;
      }
    });

    return {
      totalInflow: inflow,
      totalOutflow: outflow,
      netBalance: inflow - outflow,
      inflowCount: inCount,
      outflowCount: outCount
    };
  }, [filteredTransactions]);

  // Unique categories for filter dropdown
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    allTransactions.forEach((t) => {
      if (t.categoryName) cats.add(t.categoryName);
    });
    return Array.from(cats).sort();
  }, [allTransactions]);

  // CSV Export
  function exportCsv() {
    const headers = [
      "Date",
      "Type",
      "Doc / Ref #",
      "Party / Payer / Payee",
      "Category / Head",
      "Payment Mode",
      "Inflow (+)",
      "Outflow (-)",
      "Amount",
      "Description"
    ];

    const rows = filteredTransactions.map((t) => [
      new Date(t.date).toLocaleDateString("en-IN"),
      t.type === "INFLOW" ? "Collection / Inflow" : "Payment / Outflow",
      t.docNumber,
      t.partyName + (t.partySubtext ? ` (${t.partySubtext})` : ""),
      t.categoryName,
      t.paymentMethod + (t.bankAccountName ? ` - ${t.bankAccountName}` : ""),
      t.type === "INFLOW" ? t.amount.toFixed(2) : "",
      t.type === "OUTFLOW" ? t.amount.toFixed(2) : "",
      (t.type === "INFLOW" ? t.amount : -t.amount).toFixed(2),
      t.description || ""
    ]);

    const csvContent =
      "\uFEFF" +
      [
        headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(","),
        ...rows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
      ].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${slug}_transactions_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function triggerPrint() {
    window.print();
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Transactions & Reports</h1>
  
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={exportCsv}
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-xl text-xs font-semibold h-9"
          >
            <Download className="h-3.5 w-3.5 text-emerald-600" />
            Export Excel / CSV
          </Button>

          <Button
            onClick={triggerPrint}
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-xl text-xs font-semibold h-9"
          >
            <Printer className="h-3.5 w-3.5 text-primary" />
            Print / PDF
          </Button>
        </div>
      </div>

      {/* Printable Header (Visible only on Print) */}
      <div className="hidden print:block border-b border-border pb-4 mb-4">
        <h1 className="text-2xl font-bold">{mahalleName}</h1>
        <h2 className="text-base font-semibold text-muted-foreground mt-1">Financial Transactions Statement</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Period: {dateRange === "ALL" ? "All Time" : dateRange} • Generated: {new Date().toLocaleDateString("en-IN")} • Total Transactions: {filteredTransactions.length}
        </p>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Inflow */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <ArrowDownLeft className="h-4 w-4" />
              Total Inflows (Collections)
            </span>
            <Badge variant="outline" className="text-[10px] font-semibold text-emerald-600 border-emerald-500/30 bg-emerald-500/10">
              {inflowCount} entries
            </Badge>
          </div>
          <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300 font-mono mt-2">
            +₹{totalInflow.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Total Outflow */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <ArrowUpRight className="h-4 w-4" />
              Total Outflows (Payments)
            </span>
            <Badge variant="outline" className="text-[10px] font-semibold text-rose-600 border-rose-500/30 bg-rose-500/10">
              {outflowCount} entries
            </Badge>
          </div>
          <p className="text-lg font-bold text-rose-700 dark:text-rose-300 font-mono mt-2">
            -₹{totalOutflow.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Net Balance */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" />
              Net Balance
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">Inflow vs Outflow</span>
          </div>
          <p
            className={`text-lg font-bold font-mono mt-2 ${
              netBalance >= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"
            }`}
          >
            {netBalance >= 0 ? "+" : ""}₹{netBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Main Filter & Control Panel */}
      <Card className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs print:hidden space-y-4">
        {/* Row 1: Type Pills + Period Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Type Filter */}
          <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-xl w-fit">
            {[
              { id: "ALL", label: `All (${allTransactions.length})` },
              { id: "INFLOW", label: `Collections (+${collections.length})` },
              { id: "OUTFLOW", label: `Payments (-${vouchers.length})` }
            ].map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setFilterType(pill.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  filterType === pill.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Period Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground mr-1" />
            {[
              { id: "ALL", label: "All Time" },
              { id: "TODAY", label: "Today" },
              { id: "THIS_MONTH", label: "This Month" },
              { id: "THIS_YEAR", label: "This Year" },
              { id: "CUSTOM", label: "Custom Dates" }
            ].map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setDateRange(pill.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  dateRange === pill.id
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Date Pickers */}
        {dateRange === "CUSTOM" && (
          <div className="flex items-center gap-2 pt-1 border-t border-border/50">
            <span className="text-xs font-medium text-muted-foreground">Custom Range:</span>
            <Input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="h-8 text-xs w-36"
              placeholder="From"
            />
            <span className="text-xs text-muted-foreground">to</span>
            <Input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="h-8 text-xs w-36"
              placeholder="To"
            />
          </div>
        )}

        {/* Row 2: Search + Category + Payment Mode + Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-border/50">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search payer, doc #, description..."
              className="pl-8 h-9 text-xs"
            />
          </div>

          {/* Category Filter */}
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 text-xs"
          >
            <option value="ALL">All Categories / Heads</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>

          {/* Payment Method */}
          <Select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="h-9 text-xs"
          >
            <option value="ALL">All Payment Modes</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="UPI">UPI</option>
            <option value="Cheque">Cheque</option>
          </Select>

          {/* Sort By */}
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-9 text-xs"
          >
            <option value="date_desc">Date: Newest First</option>
            <option value="date_asc">Date: Oldest First</option>
            <option value="amount_desc">Amount: Highest First</option>
            <option value="amount_asc">Amount: Lowest First</option>
            <option value="category">Category / Head (A-Z)</option>
            <option value="party">Party / Payer (A-Z)</option>
          </Select>
        </div>
      </Card>

      {/* Unified Transactions Table */}
      <Card className="rounded-2xl border border-border/80 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3 bg-muted/10 border-b border-border/60">
          <CardTitle className="text-sm font-semibold">
            Transactions Statement ({filteredTransactions.length} entries)
          </CardTitle>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              +₹{totalInflow.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
            <span className="text-rose-600 dark:text-rose-400 font-semibold">
              -₹{totalOutflow.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              No transactions match the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Doc #</TableHead>
                    <TableHead>Party / Payer / Payee</TableHead>
                    <TableHead>Category / Head</TableHead>
                    <TableHead>Payment Mode</TableHead>
                    <TableHead className="text-right">Amount (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((t) => {
                    const isInflow = t.type === "INFLOW";
                    return (
                      <TableRow key={t.id} className="hover:bg-muted/20 transition-colors">
                        {/* Date */}
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(t.date).toLocaleDateString("en-IN")}
                        </TableCell>

                        {/* Type Badge */}
                        <TableCell>
                          {isInflow ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                              <ArrowDownLeft className="h-3 w-3" />
                              INFLOW
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20">
                              <ArrowUpRight className="h-3 w-3" />
                              OUTFLOW
                            </span>
                          )}
                        </TableCell>

                        {/* Doc Number */}
                        <TableCell className="font-mono text-xs font-semibold">
                          {t.docNumber}
                        </TableCell>

                        {/* Party / Payer / Payee */}
                        <TableCell className="text-xs font-medium">
                          <div>
                            <span className="text-foreground">{t.partyName}</span>
                            {t.partySubtext && (
                              <span className="text-[10px] text-muted-foreground block">
                                {t.partySubtext}
                              </span>
                            )}
                            {t.description && (
                              <span className="text-[10px] text-muted-foreground block truncate max-w-xs">
                                {t.description}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Category */}
                        <TableCell className="text-xs">
                          <Badge variant="outline" className="text-[10px] font-semibold">
                            {t.categoryName}
                          </Badge>
                        </TableCell>

                        {/* Payment Mode */}
                        <TableCell className="text-xs text-muted-foreground">
                          {t.paymentMethod}
                          {t.bankAccountName && (
                            <span className="text-[10px] block font-mono">
                              {t.bankAccountName}
                            </span>
                          )}
                        </TableCell>

                        {/* Amount */}
                        <TableCell
                          className={`text-right text-xs font-mono font-bold whitespace-nowrap ${
                            isInflow
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {isInflow ? "+" : "-"}₹{t.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {/* Summary Row */}
                  <TableRow className="bg-muted/40 font-bold border-t-2 border-border">
                    <TableCell colSpan={6} className="text-xs uppercase tracking-wider font-semibold">
                      Net Balance ({filteredTransactions.length} Transactions)
                    </TableCell>
                    <TableCell
                      className={`text-right text-xs font-mono font-bold whitespace-nowrap ${
                        netBalance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {netBalance >= 0 ? "+" : ""}₹{netBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
