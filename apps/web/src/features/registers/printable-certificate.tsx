"use client";

import * as React from "react";
import { Button, Dialog, DialogContent, Printer, X, Download, Share2 } from "@mahalle/ui";

export interface CertificateData {
  title: string;
  subtitle: string;
  certificateNumber: string;
  issueDate: string;
  hijriDate?: string;
  mahalleName: string;
  masjidName?: string;
  recipientName: string;
  details: { label: string; value: string }[];
  declaration: string;
  signatories: { role: string; name?: string }[];
}

export function PrintableCertificateModal({
  open,
  onOpenChange,
  data
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CertificateData;
}) {
  function handlePrint() {
    window.print();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl print:m-0 print:p-0 print:border-none print:shadow-none print:max-w-full">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-6 py-3.5 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Official Document</span>
            <span className="text-muted-foreground/60">·</span>
            <span className="text-xs font-semibold text-foreground">{data.certificateNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handlePrint} className="gap-1.5 rounded-xl font-semibold">
              <Printer className="h-3.5 w-3.5" />
              Print / Save PDF
            </Button>
          </div>
        </div>

        {/* The Certificate Sheet (Designed for Print and Screen) */}
        <div className="p-8 sm:p-12 bg-white text-slate-900 print:p-8 font-serif">
          {/* Ornate Border Frame */}
          <div className="relative border-4 border-double border-emerald-800 p-8 rounded-lg">
            {/* Header / Seal */}
            <div className="text-center space-y-2 pb-6 border-b-2 border-emerald-800/40">
              <p className="text-xs font-semibold tracking-widest text-emerald-800 uppercase font-sans">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-950 uppercase">
                {data.mahalleName}
              </h2>
              {data.masjidName && (
                <p className="text-sm font-medium text-slate-600 font-sans">
                  {data.masjidName}
                </p>
              )}
              <div className="inline-block mt-2 rounded-full border border-emerald-800/40 bg-emerald-50 px-4 py-1">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-900 font-sans">
                  {data.title}
                </span>
              </div>
            </div>

            {/* Meta: Ref number & Dates */}
            <div className="flex items-center justify-between text-xs text-slate-600 font-sans py-4 border-b border-slate-200">
              <div>
                <span className="font-semibold text-slate-800">Ref: </span>
                <span className="font-mono">{data.certificateNumber}</span>
              </div>
              <div className="text-right space-y-0.5">
                <div>
                  <span className="font-semibold text-slate-800">Date: </span>
                  <span>{data.issueDate}</span>
                </div>
                {data.hijriDate && (
                  <div className="text-[11px] text-emerald-800 font-semibold">
                    {data.hijriDate}
                  </div>
                )}
              </div>
            </div>

            {/* Certificate Body */}
            <div className="py-8 space-y-6">
              <p className="text-sm leading-relaxed text-slate-700 text-justify">
                {data.declaration}
              </p>

              {/* Data Grid */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5 font-sans">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
                  {data.details.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:justify-between border-b border-slate-200/60 pb-1.5">
                      <dt className="font-semibold text-slate-600">{item.label}:</dt>
                      <dd className="font-medium text-slate-900 text-right">{item.value || "—"}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Signatures & Seal Box */}
            <div className="mt-12 pt-8 border-t border-slate-200 font-sans">
              <div className="grid grid-cols-3 gap-4 text-center items-end">
                {data.signatories.map((sig, idx) => (
                  <div key={idx} className="space-y-12">
                    <div className="h-10 flex items-center justify-center">
                      <span className="text-[10px] text-slate-400 italic">Signature</span>
                    </div>
                    <div className="border-t border-slate-400 pt-1.5">
                      <p className="text-xs font-bold text-slate-800">{sig.name || sig.role}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{sig.role}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Official Seal Watermark Placeholder */}
              <div className="mt-8 flex items-center justify-between text-[10px] text-slate-400">
                <span>Certified by Mahallu Management System</span>
                <span className="font-mono">VERIFIED OFFICIAL RECORD</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
