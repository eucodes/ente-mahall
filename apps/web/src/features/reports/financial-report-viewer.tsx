"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Select,
  DropdownMenu,
  ChevronDown,
  Download,
  Printer,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  X,
  Menu,
  SlidersHorizontal,
  Clock,
  Settings,
  ArrowLeft
} from "@mahalle/ui";

export interface ReportItemRow {
  label: string;
  amount?: number | null;
  isHeader?: boolean;
  isTotal?: boolean;
  isGrandTotal?: boolean;
  indent?: 0 | 1 | 2 | 3 | 4;
}

export interface FinancialReportViewerProps {
  slug?: string;
  mahalleName: string;
  reportTitle: string;
  reportCategory?: string;
  dateSubtitle?: string;
  basis?: "Accrual" | "Cash";
  currency?: string;
  rows: ReportItemRow[];
  filterType?: "date_range" | "as_of";
  initialDateFilter?: string;
  onRefresh?: () => void;
  onClose?: () => void;
}

export function FinancialReportViewer({
  slug = "",
  mahalleName,
  reportTitle,
  reportCategory = "Business Overview",
  dateSubtitle,
  basis = "Accrual",
  currency = "INR",
  rows,
  filterType = "as_of",
  initialDateFilter = "today",
  onRefresh,
  onClose
}: FinancialReportViewerProps) {
  const router = useRouter();
  const [reportBasis, setReportBasis] = useState<"Accrual" | "Cash">(basis);
  const [dateFilter, setDateFilter] = useState(initialDateFilter);
  const [collapseSubAccounts, setCollapseSubAccounts] = useState(false);
  const [compareWith, setCompareWith] = useState("None");
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const formattedDate = dateSubtitle || `As of ${new Date().toLocaleDateString("en-GB")}`;

  // Export to PDF via clean browser print engine
  const handlePrintOrPdf = () => {
    window.print();
  };

  // Export to CSV
  const handleExportCsv = () => {
    const headers = ["Account", "Total"];
    const csvRows: string[] = [
      `"${mahalleName}"`,
      `"${reportTitle}"`,
      `"Basis: ${reportBasis}"`,
      `"${formattedDate}"`,
      "",
      headers.join(",")
    ];

    rows.forEach((r) => {
      const indentStr = "  ".repeat(r.indent || 0);
      const cleanLabel = `"${indentStr}${r.label.replace(/"/g, '""')}"`;
      const cleanAmount = r.amount !== undefined && r.amount !== null ? r.amount.toFixed(2) : "";
      csvRows.push(`${cleanLabel},${cleanAmount}`);
    });

    csvRows.push("");
    csvRows.push(`"**Amount is displayed in your base currency ${currency}"`);

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${reportTitle.toLowerCase().replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export to Excel-compatible TSV/XLSX format
  const handleExportExcel = () => {
    const headers = ["Account", "Total"];
    const tsvRows: string[] = [
      `${mahalleName}`,
      `${reportTitle}`,
      `Basis: ${reportBasis}`,
      `${formattedDate}`,
      "",
      headers.join("\t")
    ];

    rows.forEach((r) => {
      const indentStr = "  ".repeat(r.indent || 0);
      const cleanLabel = `${indentStr}${r.label}`;
      const cleanAmount = r.amount !== undefined && r.amount !== null ? r.amount.toFixed(2) : "";
      tsvRows.push(`${cleanLabel}\t${cleanAmount}`);
    });

    tsvRows.push("");
    tsvRows.push(`**Amount is displayed in your base currency ${currency}`);

    const blob = new Blob([tsvRows.join("\n")], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${reportTitle.toLowerCase().replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Print Stylesheet for pure white document PDF export */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-report-area,
          #printable-report-area * {
            visibility: visible;
          }
          #printable-report-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Top Header Bar matching Image 1 */}
      <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-border/60">
        <div className="flex items-center gap-3">
          {onClose ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              title="Back to Reports Center"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground"
              title="Back to Reports Center"
            >
              <Link href={slug ? `/${slug}/accountant/reports` : "#"}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          )}

          <div>
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
              {reportCategory}
            </span>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-foreground">{reportTitle}</h1>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground font-medium">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Right Action Icons & Export Dropdown */}
        <div className="flex items-center gap-2 self-end md:self-center">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground"
            title="Report Options"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground"
            title="Schedule Report"
          >
            <Clock className="h-3.5 w-3.5" />
          </Button>

          {/* Export Dropdown */}
          <DropdownMenu
            align="right"
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer"
              >
                <span>Export</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            }
            items={[
              {
                label: "Export as PDF",
                icon: <FileText className="h-3.5 w-3.5 text-rose-600" />,
                onClick: handlePrintOrPdf
              },
              {
                label: "Export as XLSX (Excel)",
                icon: <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />,
                onClick: handleExportExcel
              },
              {
                label: "Export as CSV",
                icon: <Download className="h-3.5 w-3.5 text-blue-600" />,
                onClick: handleExportCsv
              },
              {
                label: "Print Report",
                icon: <Printer className="h-3.5 w-3.5 text-muted-foreground" />,
                onClick: handlePrintOrPdf
              }
            ]}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (onRefresh) onRefresh();
              else router.refresh();
            }}
            className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
            title="Refresh Report"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>

          {onClose ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-destructive cursor-pointer"
              title="Close Report"
            >
              <X className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-destructive"
              title="Close Report"
            >
              <Link href={slug ? `/${slug}/accountant/reports` : "#"}>
                <X className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Filter Toolbar matching Image 1 */}
      <div className="no-print p-3 rounded-2xl bg-muted/30 border border-border/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1">
            Filters :
          </span>

          {filterType === "as_of" ? (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground">As of :</span>
              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-8 text-xs min-w-[130px] rounded-lg bg-background"
              >
                <option value="today">Today</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
                <option value="this_quarter">This Quarter</option>
                <option value="this_year">This Fiscal Year</option>
                <option value="previous_year">Previous Fiscal Year</option>
              </Select>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground">Date Range :</span>
              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-8 text-xs min-w-[140px] rounded-lg bg-background"
              >
                <option value="this_month">This Month</option>
                <option value="this_quarter">This Quarter</option>
                <option value="this_year">This Fiscal Year</option>
                <option value="previous_year">Previous Fiscal Year</option>
                <option value="today">Today</option>
              </Select>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-muted-foreground">Report Basis :</span>
            <Select
              value={reportBasis}
              onChange={(e) => setReportBasis(e.target.value as "Accrual" | "Cash")}
              className="h-8 text-xs min-w-[110px] rounded-lg bg-background"
            >
              <option value="Accrual">Accrual</option>
              <option value="Cash">Cash Basis</option>
            </Select>
          </div>

          <Button
            size="sm"
            onClick={() => {
              if (onRefresh) onRefresh();
              else router.refresh();
            }}
            className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            Run Report
          </Button>
        </div>

        {/* Secondary controls */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={collapseSubAccounts}
              onChange={(e) => setCollapseSubAccounts(e.target.checked)}
              className="rounded border-input text-blue-600 focus:ring-blue-600 h-3.5 w-3.5"
            />
            <span>Collapse Sub-Accounts</span>
          </label>

          <div className="flex items-center gap-1.5">
            <span>Compare With :</span>
            <Select
              value={compareWith}
              onChange={(e) => setCompareWith(e.target.value)}
              className="h-7 text-xs min-w-[90px] rounded-lg bg-background"
            >
              <option value="None">None</option>
              <option value="Previous_Period">Previous Period</option>
              <option value="Previous_Year">Previous Year</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Report Document Paper Sheet (Matching Zoho Books Images 1 & 2 & PDF) */}
      <div className="flex justify-center">
        <div
          id="printable-report-area"
          ref={reportRef}
          className="w-full max-w-4xl bg-card text-card-foreground rounded-2xl border border-border/80 p-8 sm:p-12 shadow-sm space-y-6"
        >
          {/* Centered Document Header */}
          <div className="text-center space-y-1 pb-4">
            <h3 className="text-sm font-semibold text-foreground tracking-normal">
              {mahalleName}
            </h3>
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              {reportTitle}
            </h2>
            <p className="text-xs text-muted-foreground font-normal">
              Basis: {reportBasis}
            </p>
            <p className="text-xs font-medium text-foreground">
              {formattedDate}
            </p>
          </div>

          {/* Report Table */}
          <div className="border-t border-border/60">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/80 bg-muted/20">
                  <th className="py-2.5 px-3 text-left font-bold uppercase tracking-wider text-muted-foreground text-[11px]">
                    Account
                  </th>
                  <th className="py-2.5 px-3 text-right font-bold uppercase tracking-wider text-muted-foreground text-[11px] w-48">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => {
                  if (collapseSubAccounts && (row.indent || 0) > 1) {
                    return null;
                  }

                  const isMajorSurplus =
                    row.label === "Gross Profit" ||
                    row.label === "Operating Profit" ||
                    row.label === "Net Profit/Loss" ||
                    row.label === "Net Profit" ||
                    row.label === "Net Loss" ||
                    row.label === "Net Surplus / (Deficit)";

                  const indentClass =
                    row.indent === 1
                      ? "pl-6"
                      : row.indent === 2
                      ? "pl-10"
                      : row.indent === 3
                      ? "pl-14"
                      : row.indent === 4
                      ? "pl-18"
                      : "pl-3";

                  // Header row (e.g. Assets, Current Assets, Operating Income)
                  if (row.isHeader) {
                    return (
                      <tr key={`row-${idx}`} className="border-b border-border/30">
                        <td
                          colSpan={2}
                          className={`py-2 px-3 font-bold text-foreground text-xs ${indentClass}`}
                        >
                          {row.label}
                        </td>
                      </tr>
                    );
                  }

                  // Major Surplus Summary Rows (Gross Profit, Operating Profit, Net Profit/Loss)
                  if (isMajorSurplus) {
                    return (
                      <tr
                        key={`row-${idx}`}
                        className={`border-t border-b border-border/70 font-bold ${
                          row.isGrandTotal
                            ? "border-t border-b-2 border-border/90 bg-muted/20"
                            : "bg-muted/10"
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center text-foreground font-bold">
                          {row.label}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-foreground font-bold">
                          {row.amount !== undefined && row.amount !== null
                            ? row.amount.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })
                            : "0.00"}
                        </td>
                      </tr>
                    );
                  }

                  // Subtotal row (e.g. Total for Operating Income, Total for Cash)
                  if (row.isTotal) {
                    return (
                      <tr
                        key={`row-${idx}`}
                        className={`border-b border-border/40 font-semibold ${
                          row.isGrandTotal
                            ? "bg-muted/30 font-bold border-t-2 border-b-2 border-border"
                            : ""
                        }`}
                      >
                        <td className={`py-2 px-3 text-foreground ${indentClass}`}>
                          {row.label}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-foreground font-semibold">
                          {row.amount !== undefined && row.amount !== null
                            ? row.amount.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })
                            : "0.00"}
                        </td>
                      </tr>
                    );
                  }

                  // Standard line item row
                  return (
                    <tr
                      key={`row-${idx}`}
                      className="border-b border-border/20 hover:bg-muted/30 transition-colors"
                    >
                      <td className={`py-1.5 px-3 text-foreground/90 font-medium ${indentClass}`}>
                        {row.label}
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono text-foreground/90">
                        {row.amount !== undefined && row.amount !== null
                          ? row.amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          : ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footnote */}
          <div className="pt-6 text-left">
            <p className="text-[11px] text-muted-foreground/80 italic font-mono">
              **Amount is displayed in your base currency {currency}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
