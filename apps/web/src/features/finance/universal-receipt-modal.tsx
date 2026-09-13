"use client";

import * as React from "react";
import { Button, Dialog, DialogContent, Printer, Share2, CheckCircle2 } from "@mahalle/ui";

export interface UniversalReceiptData {
  receiptNumber: string;
  date: string;
  payerName: string;
  payerPhone?: string | null;
  familyDetails?: string | null;
  category: string;
  title: string;
  amount: string;
  paymentMethod?: string | null;
  mahalleName: string;
  receivedBy?: string;
  notes?: string | null;
}

export function UniversalReceiptModal({
  open,
  onOpenChange,
  receipt
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receipt: UniversalReceiptData | null;
}) {
  if (!receipt) return null;

  function handlePrint() {
    window.print();
  }

  function handleWhatsAppShare() {
    if (!receipt?.payerPhone) return;
    const cleanPhone = receipt.payerPhone.replace(/[^0-9]/g, "");
    const message = encodeURIComponent(
      `*${receipt.mahalleName} - Official Receipt*\n\n` +
      `Assalamu Alaikum ${receipt.payerName},\n` +
      `We have received your payment of *₹${parseFloat(receipt.amount).toLocaleString("en-IN")}*.\n\n` +
      `• *Receipt No:* ${receipt.receiptNumber}\n` +
      `• *Category:* ${receipt.category}\n` +
      `• *Particulars:* ${receipt.title}\n` +
      `• *Date:* ${receipt.date}\n` +
      `• *Payment Mode:* ${receipt.paymentMethod || "Cash"}\n\n` +
      `May Allah bless you and reward you abundantly. Jazakallah Khair.`
    );
    const url = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(url, "_blank");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl print:m-0 print:p-0 print:border-none print:shadow-none">
        {/* Controls */}
        <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-5 py-3 print:hidden">
          <span className="text-xs font-semibold text-foreground">Official Receipt</span>
          <div className="flex items-center gap-2">
            {receipt.payerPhone && (
              <Button size="sm" variant="secondary" onClick={handleWhatsAppShare} className="gap-1.5 rounded-xl text-emerald-600 dark:text-emerald-400 font-semibold">
                <Share2 className="h-3.5 w-3.5" />
                WhatsApp
              </Button>
            )}
            <Button size="sm" onClick={handlePrint} className="gap-1.5 rounded-xl font-semibold">
              <Printer className="h-3.5 w-3.5" />
              Print
            </Button>
          </div>
        </div>

        {/* Printable Paper */}
        <div className="p-6 bg-white text-slate-900 font-sans print:p-4">
          <div className="border border-dashed border-slate-300 rounded-xl p-5 space-y-4">
            {/* Header */}
            <div className="text-center border-b border-slate-200 pb-3">
              <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-bold text-base">
                <CheckCircle2 className="h-4 w-4" />
                <span>{receipt.mahalleName}</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">
                Financial Receipt
              </p>
            </div>

            {/* Receipt No & Date */}
            <div className="flex items-center justify-between text-xs text-slate-600">
              <div>
                <span className="text-slate-400">Receipt #: </span>
                <span className="font-mono font-bold text-slate-800">{receipt.receiptNumber}</span>
              </div>
              <div>
                <span className="text-slate-400">Date: </span>
                <span className="font-medium text-slate-800">{receipt.date}</span>
              </div>
            </div>

            {/* Payer Info */}
            <div className="rounded-lg bg-slate-50 p-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Payer:</span>
                <span className="font-bold text-slate-900">{receipt.payerName}</span>
              </div>
              {receipt.familyDetails && (
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Family / House:</span>
                  <span>{receipt.familyDetails}</span>
                </div>
              )}
              {receipt.payerPhone && (
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Phone:</span>
                  <span>{receipt.payerPhone}</span>
                </div>
              )}
            </div>

            {/* Particulars */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">Category:</span>
                <span className="font-medium text-slate-700">{receipt.category}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">Description:</span>
                <span className="font-medium text-slate-700">{receipt.title}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">Payment Mode:</span>
                <span className="font-medium text-slate-700">{receipt.paymentMethod || "Cash"}</span>
              </div>
            </div>

            {/* Amount Box */}
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center">
              <div className="text-xs text-emerald-700 font-medium">Amount Received</div>
              <div className="text-2xl font-bold text-emerald-800 font-mono mt-0.5">
                ₹{parseFloat(receipt.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>{receipt.receivedBy ? `Received by: ${receipt.receivedBy}` : "Authorized Signature"}</span>
              <span>Computer Generated</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
