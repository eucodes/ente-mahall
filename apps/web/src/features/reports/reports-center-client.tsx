"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  Button,
  Input,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Star,
  Search,
  ArrowRight,
  Sparkles,
  Layers,
  Building2,
  FileText,
  Scale,
  DollarSign,
  TrendingUp,
  Receipt,
  RotateCcw,
  CreditCard,
  ShoppingCart,
  Landmark,
  Briefcase,
  BookOpen,
  Globe,
  Activity,
  Zap,
  Tag
} from "@mahalle/ui";
import {
  ALL_REPORTS_REGISTRY,
  generateReportData,
  ReportMeta
} from "./reports-data";
import { FinancialReportViewer } from "./financial-report-viewer";
import { TabularReportViewer } from "./tabular-report-viewer";
import type {
  Account,
  CollectionCategory,
  ExpenseCategory,
  FinanceCollection,
  Voucher,
  FinanceBankAccount,
  FinanceOverview
} from "@/lib/finance";

interface Props {
  slug: string;
  mahalleName: string;
  accounts?: Account[];
  collections?: FinanceCollection[];
  vouchers?: Voucher[];
  collectionCategories?: CollectionCategory[];
  expenseCategories?: ExpenseCategory[];
  bankAccounts?: FinanceBankAccount[];
  overview?: FinanceOverview | null;
  initialReportId?: string | null;
}

const CATEGORIES_NAV = [
  { id: "all", name: "All Reports", icon: Layers },
  { id: "favorites", name: "Favorites", icon: Star },
  { id: "business-overview", name: "Business Overview", icon: Scale },
  { id: "sales", name: "Sales", icon: TrendingUp },
  { id: "receivables", name: "Receivables", icon: DollarSign },
  { id: "payments-received", name: "Payments Received", icon: Receipt },
  { id: "recurring-invoices", name: "Recurring Invoices", icon: RotateCcw },
  { id: "payables", name: "Payables", icon: CreditCard },
  { id: "purchases-and-expenses", name: "Purchases and Expenses", icon: ShoppingCart },
  { id: "taxes", name: "Taxes", icon: Tag },
  { id: "banking", name: "Banking", icon: Landmark },
  { id: "projects-and-timesheet", name: "Projects and Timesheet", icon: Briefcase },
  { id: "accountant", name: "Accountant", icon: BookOpen },
  { id: "currency", name: "Currency", icon: Globe },
  { id: "activity", name: "Activity", icon: Activity },
  { id: "automation", name: "Automation", icon: Zap }
];

export function ReportsCenterClient({
  slug,
  mahalleName,
  accounts = [],
  collections = [],
  vouchers = [],
  collectionCategories = [],
  expenseCategories = [],
  bankAccounts = [],
  overview = null,
  initialReportId = null
}: Props) {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(initialReportId);
  const [activeNav, setActiveNav] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`mahalle_reports_fav_${slug}`);
      if (saved) {
        setFavorites(JSON.parse(saved));
      } else {
        setFavorites([
          "profit-and-loss",
          "balance-sheet",
          "cash-book",
          "payments-received",
          "payments-made"
        ]);
      }
    } catch {
      setFavorites([
        "profit-and-loss",
        "balance-sheet",
        "cash-book",
        "payments-received",
        "payments-made"
      ]);
    }
  }, [slug]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(`mahalle_reports_fav_${slug}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Filtered reports
  const filteredReports = useMemo(() => {
    return ALL_REPORTS_REGISTRY.filter((report) => {
      // Category Navigation Filter
      if (activeNav === "favorites") {
        if (!favorites.includes(report.id)) return false;
      } else if (activeNav !== "all") {
        if (report.categoryKey !== activeNav) return false;
      }

      // Search Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = report.name.toLowerCase().includes(query);
        const matchesDesc = report.description.toLowerCase().includes(query);
        const matchesCat = report.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      return true;
    });
  }, [activeNav, searchQuery, favorites]);

  // Counts for each nav item
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: ALL_REPORTS_REGISTRY.length,
      favorites: favorites.length
    };
    for (const report of ALL_REPORTS_REGISTRY) {
      counts[report.categoryKey] = (counts[report.categoryKey] || 0) + 1;
    }
    return counts;
  }, [favorites]);

  // Render selected report viewer in-place if active
  if (selectedReportId) {
    const reportData = generateReportData(selectedReportId, {
      slug,
      accounts,
      collections,
      vouchers,
      collectionCategories,
      expenseCategories,
      bankAccounts,
      overview,
      mahalleName
    });

    if (reportData.meta.type === "financial") {
      return (
        <FinancialReportViewer
          slug={slug}
          reportTitle={reportData.meta.name}
          reportCategory={reportData.meta.category}
          mahalleName={mahalleName}
          initialDateFilter={reportData.initialDateFilter}
          dateSubtitle={reportData.dateSubtitle}
          filterType={reportData.filterType}
          rows={reportData.financialRows || []}
          onClose={() => setSelectedReportId(null)}
        />
      );
    }

    return (
      <TabularReportViewer
        slug={slug}
        reportTitle={reportData.meta.name}
        reportCategory={reportData.meta.category}
        mahalleName={mahalleName}
        initialDateFilter={reportData.initialDateFilter}
        dateSubtitle={reportData.dateSubtitle}
        filterType={reportData.filterType}
        columns={reportData.tabularColumns || []}
        rows={reportData.tabularRows || []}
        summaryRows={reportData.summaryRows}
        onClose={() => setSelectedReportId(null)}
      />
    );
  }

  // Otherwise, render full Zoho Books styled Reports Catalog
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/60 dark:bg-slate-950/40">
      {/* Top Header */}
      <div className="bg-background border-b border-border px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Reports Center
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
              {ALL_REPORTS_REGISTRY.length} Reports
            </span>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-3">
          <div className="relative w-72 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              type="text"
              placeholder="Search reports by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-muted/40 focus:bg-background rounded-lg border-border"
            />
          </div>
        </div>
      </div>

      {/* Main Layout: Left Sidebar + Right Content Table */}
      <div className="flex flex-1 flex-col md:flex-row items-start">
        {/* Left Category Sidebar */}
        <aside className="w-full md:w-64 border-r border-border bg-background p-4 flex flex-col gap-1 shrink-0 md:sticky md:top-[69px] md:h-[calc(100vh-69px)] self-start">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-3 mb-2 shrink-0">
            Report Categories
          </div>

          <nav className="space-y-0.5 overflow-y-auto flex-1 pr-1">
            {CATEGORIES_NAV.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeNav === cat.id;
              const count = categoryCounts[cat.id] ?? 0;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveNav(cat.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-semibold dark:bg-blue-950/60 dark:text-blue-300"
                      : "text-foreground/80 hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : cat.id === "favorites"
                          ? "text-amber-500 fill-amber-500"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      isActive
                        ? "bg-blue-200/60 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Content Table */}
        <div className="flex-1 p-6 overflow-x-auto">
          {/* Quick Favorites Banner if on All Reports */}
          {activeNav === "all" && !searchQuery && favorites.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Quick Favorites
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ALL_REPORTS_REGISTRY.filter((r) => favorites.includes(r.id))
                  .slice(0, 6)
                  .map((fav) => (
                    <button
                      key={fav.id}
                      type="button"
                      onClick={() => setSelectedReportId(fav.id)}
                      className="group p-3 rounded-xl border border-border bg-background hover:border-blue-300 hover:shadow-sm transition-all text-left flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {fav.name}
                          </span>
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2">
                          {fav.description}
                        </p>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {fav.category}
                        </span>
                        <span className="group-hover:translate-x-0.5 transition-transform text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-0.5">
                          Open →
                        </span>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Table of Reports */}
          <Card className="border border-border shadow-xs overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow className="border-b border-border hover:bg-transparent">
                    <TableHead className="w-10 pl-4 pr-0"></TableHead>
                    <TableHead className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Report Name & Details
                    </TableHead>
                    <TableHead className="text-xs font-bold text-foreground uppercase tracking-wider w-48">
                      Category
                    </TableHead>
                    <TableHead className="text-xs font-bold text-foreground uppercase tracking-wider w-36">
                      Engine
                    </TableHead>
                    <TableHead className="text-xs font-bold text-foreground uppercase tracking-wider text-right pr-5 w-24">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border">
                  {filteredReports.map((report) => {
                    const isFav = favorites.includes(report.id);
                    return (
                      <TableRow
                        key={report.id}
                        onClick={() => setSelectedReportId(report.id)}
                        className="group hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors cursor-pointer"
                      >
                        {/* Star Favorite Toggle */}
                        <TableCell className="pl-4 pr-0 py-3.5 w-10">
                          <button
                            type="button"
                            onClick={(e) => toggleFavorite(report.id, e)}
                            className="p-1 rounded-md text-muted-foreground hover:text-amber-500 transition-colors cursor-pointer"
                            title={isFav ? "Remove from favorites" : "Add to favorites"}
                          >
                            <Star
                              className={`h-4 w-4 ${
                                isFav
                                  ? "text-amber-500 fill-amber-500"
                                  : "text-muted-foreground/40 group-hover:text-muted-foreground"
                              }`}
                            />
                          </button>
                        </TableCell>

                        {/* Report Name & Description */}
                        <TableCell className="py-3.5">
                          <div className="flex flex-col">
                            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:underline flex items-center gap-1.5 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                              <span>{report.name}</span>
                              {report.isPopular && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                                  Standard
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-muted-foreground/80 mt-0.5 line-clamp-1">
                              {report.description}
                            </span>
                          </div>
                        </TableCell>

                        {/* Report Category */}
                        <TableCell className="py-3.5 text-xs text-foreground/80 font-medium">
                          {report.category}
                        </TableCell>

                        {/* Created By / Type */}
                        <TableCell className="py-3.5 text-xs text-muted-foreground">
                          <span className="capitalize">{report.type}</span> Statement
                        </TableCell>

                        {/* Action Button */}
                        <TableCell className="py-3.5 text-right pr-5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReportId(report.id);
                            }}
                            className="h-7 px-2.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg gap-1 font-medium"
                          >
                            <span>View</span>
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {filteredReports.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-12 text-center text-xs text-muted-foreground"
                      >
                        {searchQuery
                          ? `No reports found matching "${searchQuery}".`
                          : activeNav === "favorites"
                          ? "No favorite reports starred yet. Click the star icon next to any report to pin it here."
                          : "No reports found in this category."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
