"use client";

import React, { useRef } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Printer,
  Download,
  CheckCircle2,
  Building,
  Sparkles
} from "@mahalle/ui";

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  date: string;
  period: string;
  planName: string;
  amount: number;
  currency: string;
  status: "PAID" | "PENDING" | "ISSUED";
  paymentMethod: string;
  transactionRef: string;
}

interface InvoiceDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceData | null;
  tenantName: string;
}

export function InvoiceDownloadModal({
  isOpen,
  onClose,
  invoice,
  tenantName
}: InvoiceDownloadModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!invoice) return null;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-3xl p-0 overflow-hidden border-border/80 bg-background">
        <DialogHeader className="p-6 border-b border-border/60 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  Tax Invoice / Official Receipt
                </DialogTitle>
                <p className="text-xs text-muted-foreground font-mono">
                  {invoice.invoiceNumber}
                </p>
              </div>
            </div>
            <Badge
              className={`font-bold text-xs ${
                invoice.status === "PAID"
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                  : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
              }`}
            >
              {invoice.status}
            </Badge>
          </div>
        </DialogHeader>

        {/* Printable Receipt Content */}
        <div ref={receiptRef} className="p-6 sm:p-8 space-y-6 text-foreground bg-card">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border/60 pb-6">
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold tracking-tight text-foreground">
                ENTE MAHALL TECHNOLOGIES
              </h2>
              <p className="text-xs text-muted-foreground">
                Digital Platform for Mahall & Community Administration
              </p>
              <p className="text-xs text-muted-foreground">
                GSTIN: 32AABCU9603R1ZM · Calicut, Kerala, India
              </p>
            </div>

            <div className="space-y-1 text-left sm:text-right text-xs">
              <div className="font-bold text-foreground">Invoice #{invoice.invoiceNumber}</div>
              <div className="text-muted-foreground">Date: {invoice.date}</div>
              <div className="text-muted-foreground">Billing Cycle: {invoice.period}</div>
            </div>
          </div>

          {/* Billed To */}
          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-1 text-xs">
            <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider block">
              Billed To Customer:
            </span>
            <div className="font-bold text-sm text-foreground">{tenantName}</div>
            <div className="text-muted-foreground">
              Official Registered Mahall Administration Workspace
            </div>
            <div className="text-muted-foreground">
              Ref ID: <span className="font-mono text-foreground font-medium">{invoice.transactionRef}</span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto rounded-2xl border border-border/60">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 text-muted-foreground border-b border-border/60">
                <tr>
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 font-semibold text-center">Period</th>
                  <th className="px-4 py-3 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <tr>
                  <td className="px-4 py-3.5">
                    <span className="font-bold text-foreground block">{invoice.planName}</span>
                    <span className="text-[11px] text-muted-foreground">
                      Cloud database, public portal hosting, member records, and security updates
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center text-muted-foreground">{invoice.period}</td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-foreground">
                    ₹{invoice.amount.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary / Total */}
          <div className="flex flex-col items-end space-y-1.5 pt-2 text-xs">
            <div className="flex justify-between w-48 text-muted-foreground">
              <span>Subtotal:</span>
              <span className="font-mono text-foreground font-medium">₹{invoice.amount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between w-48 text-muted-foreground">
              <span>GST (0% Exempt):</span>
              <span className="font-mono text-foreground font-medium">₹0</span>
            </div>
            <div className="flex justify-between w-48 border-t border-border/60 pt-2 font-bold text-sm text-foreground">
              <span>Grand Total:</span>
              <span className="font-mono text-emerald-600">₹{invoice.amount.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Payment Method Badge */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-emerald-900 dark:text-emerald-200">
                Payment Received via {invoice.paymentMethod}
              </span>
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">
              {invoice.transactionRef}
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <DialogFooter className="p-4 border-t border-border/60 bg-muted/20 flex flex-row items-center justify-end gap-2">
          <Button
            size="md"
            variant="outline"
            onClick={onClose}
            className="rounded-xl text-xs font-semibold"
          >
            Close
          </Button>
          <Button
            size="md"
            variant="primary"
            onClick={handlePrint}
            className="rounded-xl text-xs font-semibold gap-1.5"
          >
            <Printer className="h-4 w-4" />
            <span>Print or Save PDF</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
