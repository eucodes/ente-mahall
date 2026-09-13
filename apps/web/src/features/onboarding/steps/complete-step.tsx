"use client";

import { useState } from "react";
import { Button, Card, CardContent, Check } from "@mahalle/ui";
import { ROOT_DOMAIN } from "@/lib/env";

export interface CompleteStepProps {
  slug: string;
  onGoToDashboard: () => void;
}

export function CompleteStep({ slug, onGoToDashboard }: CompleteStepProps) {
  const [copied, setCopied] = useState(false);
  const publicUrl = `${slug}.${ROOT_DOMAIN}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(`http://${publicUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access fallback
    }
  }

  return (
    <Card className="overflow-hidden border-border/80 shadow-lg">
      <div className="h-2 w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400" />
      <CardContent className="flex flex-col items-center gap-6 p-6 sm:p-10 text-center">
        {/* Animated Celebration Badge */}
        <div className="relative">
          <div className="absolute -inset-2 rounded-full bg-emerald-500/20 blur-lg animate-pulse" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-700/30">
            <Check className="h-10 w-10 stroke-[3]" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Your Mahallu is Ready! 🎉
          </h2>
          <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
            Your organization workspace has been created and initialized. You can now access your administrative command center and citizen portal.
          </p>
        </div>

        {/* Workspace URL card with copy */}
        <div className="w-full max-w-md space-y-2 rounded-2xl border border-border/80 bg-muted/40 p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Your Mahallu Public & Admin Domain
          </span>
          <div className="flex items-center justify-between gap-2 rounded-xl border border-input/80 bg-background px-3.5 py-2.5 shadow-2xs">
            <span className="truncate font-mono text-sm font-semibold text-foreground">
              http://{publicUrl}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-8 shrink-0 text-xs font-semibold text-primary"
            >
              {copied ? "Copied!" : "Copy URL"}
            </Button>
          </div>
        </div>

        {/* Quick Next Steps */}
        <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-4 text-left shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">Recommended Next Steps</span>
          <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">1</span>
              <span>Enroll resident families and member profiles</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">2</span>
              <span>Set up committee designations & staff roles</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">3</span>
              <span>Configure monthly subscriptions and certificate templates</span>
            </li>
          </ul>
        </div>

        <Button
          size="lg"
          className="w-full max-w-md text-sm font-bold shadow-md bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
          onClick={onGoToDashboard}
        >
          Open Mahallu Admin Dashboard →
        </Button>
      </CardContent>
    </Card>
  );
}
