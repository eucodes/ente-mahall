"use client";

import * as React from "react";
import { Button, Dialog, DialogContent, Printer, Share2, CheckCircle2 } from "@mahalle/ui";

export interface ReceiptData {
  receiptNumber: string;
  date: string;
  memberFullName: string;
  memberPhone?: string | null;
  familyName?: string | null;
  houseNumber?: string | null;
  title: string; // e.g. "Mahall Monthly Varisa - September 2026"
  amount: string; // e.g. "500"
  paymentMethod?: string | null; // e.g. "Cash", "UPI"
  mahalleName: string;
  receivedBy: string;
}

export function DuesReceiptModal({
  open,
  onOpenChange,
  receipt
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receipt: ReceiptData;
}) {
  function handlePrint() {
    window.print();
  }

  function handleWhatsAppShare() {
    if (!receipt.memberPhone) return;
    const cleanPhone = receipt.memberPhone.replace(/[^0-9]/g, "");
    const message = encodeURIComponent(
      `*${receipt.mahalleName} - Payment Receipt*\n\n` +
      `Assalamu Alaikum ${receipt.memberFullName},\n` +
      `We have received your payment of *₹${parseFloat(receipt.amount).toLocaleString("en-IN")}*.\n\n` +
      `• *Receipt No:* ${receipt.receiptNumber}\n` +
      `• *Purpose:* ${receipt.title}\n` +
      `• *Date:* ${receipt.date}\n` +
      `• *Payment Mode:* ${receipt.paymentMethod || "Cash"}\n\n` +
      `Jazakallah Khair for your timely contribution to the Mahall.`
    );
    const url = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(url, "_blank");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl print:m-0 print:p-0 print:border-none print:shadow-none">
        {/* Controls (Hidden on Print) */}
        <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-5 py-3 print:hidden">
          <span className="text-xs font-semibold text-foreground">Payment Receipt</span>
          <div className="flex items-center gap-2">
            {receipt.memberPhone && (
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

        {/* Printable Receipt Paper */}
        <div className="p-6 bg-white text-slate-900 font-sans print:p-4">
          <div className="border border-dashed border-slate-300 rounded-xl p-5 space-y-4">
            {/* Header */}
            <div className="text-center border-b border-slate-200 pb-3">
              <div className="flex items-center justify-center gap-1 text-emerald-700 font-bold text-base">
                <CheckCircle2 className="h-4 w-4" />
                <span>{receipt.mahalleName}</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">
                Official Dues & Contribution Receipt
              </p>
            </div>

            {/* Receipt No & Date */}
            <div className="flex items-center justify-between text-xs text-slate-600">
              <div>
                <span className="text-slate-400">Receipt: </span>
                <span className="font-mono font-bold text-slate-800">{receipt.receiptNumber}</span>
              </div>
              <div>
                <span className="text-slate-400">Date: </span>
                <span className="font-medium text-slate-800">{receipt.date}</span>
              </div>
            </div>

            {/* Member Info */}
            <div className="rounded-lg bg-slate-50 p-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Member:</span>
                <span className="font-bold text-slate-900">{receipt.memberFullName}</span>
              </div>
              {receipt.familyName && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Family:</span>
                  <span className="font-medium text-slate-800">{receipt.familyName}</span>
                </div>
              )}
              {receipt.houseNumber && (
                <div className="flex justify-between">
                  <span className="text-slate-500">House No:</span>
                  <span className="font-medium text-slate-800">{receipt.houseNumber}</span>
                </div>
              )}
            </div>

            {/* Particulars & Amount */}
            <div className="border-t border-b border-slate-200 py-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">{receipt.title}</span>
                <span className="font-bold text-slate-900">
                  ₹{parseFloat(receipt.amount).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Payment Mode:</span>
                <span>{receipt.paymentMethod || "Cash"}</span>
              </div>
            </div>

            {/* Total Highlight */}
            <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-2.5">
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">Amount Paid</span>
              <span className="text-lg font-extrabold text-emerald-800">
                ₹{parseFloat(receipt.amount).toLocaleString("en-IN")}
              </span>
            </div>

            {/* Footer */}
            <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400">
              <span>Received by: {receipt.receivedBy}</span>
              <span>Computer Generated Receipt</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
