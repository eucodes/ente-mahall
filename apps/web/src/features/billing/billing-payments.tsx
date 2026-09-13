"use client";

import React, { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Receipt,
  FileText,
  RefreshCw,
  Download
} from "@mahalle/ui";
import { InvoiceDownloadModal, type InvoiceData } from "./invoice-download-modal";

interface BillingPaymentsProps {
  slug: string;
  tenantName: string;
}

export function BillingPayments({ slug, tenantName }: BillingPaymentsProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Invoices list (empty to show clean empty state matching reference mockup, or populated with records)
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleDownloadInvoice = (inv: InvoiceData) => {
    setSelectedInvoice(inv);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Payments
          </span>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Payment histories
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Badge variant="outline" className="text-xs font-mono uppercase text-muted-foreground px-3 py-1 rounded-full">
            Manual Mode
          </Badge>

          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            className="rounded-xl text-xs font-semibold gap-1.5 h-9 px-3.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Main Container Card */}
      <Card className="rounded-3xl border-border/80 bg-card shadow-xs min-h-[340px] flex flex-col justify-center">
        <CardContent className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
          {invoices.length === 0 ? (
            <div className="space-y-3.5 flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <FileText className="h-8 w-8" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                No payment histories found.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/40 text-muted-foreground border-b border-border/60">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Invoice #</th>
                    <th className="px-5 py-3.5 font-semibold">Date</th>
                    <th className="px-5 py-3.5 font-semibold">Plan</th>
                    <th className="px-5 py-3.5 font-semibold">Amount</th>
                    <th className="px-5 py-3.5 font-semibold">Status</th>
                    <th className="px-5 py-3.5 font-semibold text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-muted/20 transition-colors text-sm">
                      <td className="px-5 py-4 font-mono font-bold">{inv.invoiceNumber}</td>
                      <td className="px-5 py-4 text-muted-foreground">{inv.date}</td>
                      <td className="px-5 py-4 font-medium">{inv.planName}</td>
                      <td className="px-5 py-4 font-mono font-bold">₹{inv.amount}</td>
                      <td className="px-5 py-4">
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs px-2.5 py-0.5">
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadInvoice(inv)}
                          className="rounded-xl text-xs h-8 px-3"
                        >
                          <Download className="h-3.5 w-3.5 mr-1.5" />
                          <span>Download</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Download Modal */}
      <InvoiceDownloadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        invoice={selectedInvoice}
        tenantName={tenantName}
      />
    </div>
  );
}
