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
  SlidersHorizontal,
  Clock,
  ArrowLeft
} from "@mahalle/ui";

export interface TabularColumn {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  isMono?: boolean;
  className?: string;
}

export interface TabularReportViewerProps {
  slug?: string;
  mahalleName: string;
  reportTitle: string;
  reportCategory?: string;
  dateSubtitle?: string;
  basis?: "Accrual" | "Cash";
  currency?: string;
  columns: TabularColumn[];
  rows: Record<string, any>[];
  summaryRows?: {
    label: string;
    values: Record<string, string | number | null | undefined>;
    isGrandTotal?: boolean;
  }[];
  filterType?: "date_range" | "as_of";
  initialDateFilter?: string;
  onRefresh?: () => void;
  onClose?: () => void;
  emptyMessage?: string;
}

export function TabularReportViewer({
  slug = "",
  mahalleName,
  reportTitle,
  reportCategory = "Banking & Cash",
  dateSubtitle,
  basis = "Accrual",
  currency = "INR",
  columns,
  rows,
  summaryRows = [],
  filterType = "date_range",
  initialDateFilter = "this_month",
  onRefresh,
  onClose,
  emptyMessage = "No transactions found in this period."
}: TabularReportViewerProps) {
  const router = useRouter();
  const [reportBasis, setReportBasis] = useState<"Accrual" | "Cash">(basis);
  const [dateFilter, setDateFilter] = useState(initialDateFilter);
  const reportRef = useRef<HTMLDivElement>(null);

  const formattedDate = dateSubtitle || `As of ${new Date().toLocaleDateString("en-GB")}`;

  // Export to PDF via clean browser print engine
  const handlePrintOrPdf = () => {
    window.print();
  };

  // Export to CSV
  const handleExportCsv = () => {
    const headers = columns.map((c) => `"${c.label}"`);
    const csvRows: string[] = [
      `"${mahalleName}"`,
      `"${reportTitle}"`,
      `"Basis: ${reportBasis}"`,
      `"${formattedDate}"`,
      "",
      headers.join(",")
    ];

    rows.forEach((r) => {
      const rowVals = columns.map((c) => {
        const val = r[c.key];
        if (val === undefined || val === null) return '""';
        if (typeof val === "number") return val.toFixed(2);
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csvRows.push(rowVals.join(","));
    });

    if (summaryRows.length > 0) {
      csvRows.push("");
      summaryRows.forEach((sr) => {
        const rowVals = columns.map((c, idx) => {
          if (idx === 0) return `"${sr.label}"`;
          const val = sr.values[c.key];
          if (val === undefined || val === null) return '""';
          if (typeof val === "number") return val.toFixed(2);
          return `"${String(val).replace(/"/g, '""')}"`;
        });
        csvRows.push(rowVals.join(","));
      });
    }

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

  // Export to Excel-compatible format
  const handleExportExcel = () => {
    const headers = columns.map((c) => c.label);
    const tsvRows: string[] = [
      `${mahalleName}`,
      `${reportTitle}`,
      `Basis: ${reportBasis}`,
      `${formattedDate}`,
      "",
      headers.join("\t")
    ];

    rows.forEach((r) => {
      const rowVals = columns.map((c) => {
        const val = r[c.key];
        if (val === undefined || val === null) return "";
        if (typeof val === "number") return val.toFixed(2);
        return String(val);
      });
      tsvRows.push(rowVals.join("\t"));
    });

    if (summaryRows.length > 0) {
      tsvRows.push("");
      summaryRows.forEach((sr) => {
        const rowVals = columns.map((c, idx) => {
          if (idx === 0) return sr.label;
          const val = sr.values[c.key];
          if (val === undefined || val === null) return "";
          if (typeof val === "number") return val.toFixed(2);
          return String(val);
        });
        tsvRows.push(rowVals.join("\t"));
      });
    }

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
      {/* Print Stylesheet for clean white document PDF output */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-tabular-report,
          #printable-tabular-report * {
            visibility: visible;
          }
          #printable-tabular-report {
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

      {/* Top Header Bar matching Zoho Books preview */}
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

      {/* Filter Toolbar matching Zoho Books */}
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
      </div>

      {/* Main Report Document Paper Sheet */}
      <div className="flex justify-center">
        <div
          id="printable-tabular-report"
          ref={reportRef}
          className="w-full max-w-5xl bg-card text-card-foreground rounded-2xl border border-border/80 p-8 sm:p-12 shadow-sm space-y-6"
        >
          {/* Centered Document Header */}
          <div className="text-center space-y-1 pb-4">
            <h3 className="text-sm font-semibold text-foreground tracking-normal">
              {mahalleName}
            </h3>
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              {reportTitle}
            </h2>
            <p className="text-xs text-muted-foreground">
              Basis : {reportBasis}
            </p>
            <p className="text-xs font-medium text-foreground">
              {formattedDate}
            </p>
          </div>

          {/* Report Table */}
          <div className="border-t border-border/60 overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/80 bg-muted/20">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`py-2.5 px-3 font-bold uppercase tracking-wider text-muted-foreground text-[11px] ${
                        col.align === "right"
                          ? "text-right"
                          : col.align === "center"
                          ? "text-center"
                          : "text-left"
                      } ${col.className || ""}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rIdx) => (
                  <tr
                    key={`trow-${rIdx}`}
                    className="border-b border-border/20 hover:bg-muted/30 transition-colors"
                  >
                    {columns.map((col) => {
                      const val = row[col.key];
                      const isNum = typeof val === "number";
                      const formattedVal = isNum
                        ? val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : val !== undefined && val !== null
                        ? String(val)
                        : "—";

                      return (
                        <td
                          key={col.key}
                          className={`py-2 px-3 text-foreground/90 ${
                            col.isMono || isNum ? "font-mono" : "font-medium"
                          } ${
                            col.align === "right"
                              ? "text-right"
                              : col.align === "center"
                              ? "text-center"
                              : "text-left"
                          }`}
                        >
                          {formattedVal}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="py-12 text-center text-xs text-muted-foreground"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                )}

                {/* Summary / Total Rows */}
                {summaryRows.map((sr, sIdx) => (
                  <tr
                    key={`srow-${sIdx}`}
                    className={`border-b border-border/60 font-semibold ${
                      sr.isGrandTotal ? "bg-muted/40 font-bold border-t-2 border-b-2 border-border" : "bg-muted/10"
                    }`}
                  >
                    {columns.map((col, cIdx) => {
                      if (cIdx === 0) {
                        return (
                          <td key={col.key} className="py-2.5 px-3 text-foreground font-bold">
                            {sr.label}
                          </td>
                        );
                      }

                      const val = sr.values[col.key];
                      const isNum = typeof val === "number";
                      const formattedVal = isNum
                        ? val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : val !== undefined && val !== null
                        ? String(val)
                        : "";

                      return (
                        <td
                          key={col.key}
                          className={`py-2.5 px-3 text-foreground ${
                            col.isMono || isNum ? "font-mono font-bold" : "font-semibold"
                          } ${
                            col.align === "right"
                              ? "text-right"
                              : col.align === "center"
                              ? "text-center"
                              : "text-left"
                          }`}
                        >
                          {formattedVal}
                        </td>
                      );
                    })}
                  </tr>
                ))}
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
