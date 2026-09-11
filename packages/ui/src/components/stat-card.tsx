import * as React from "react";
import { cn } from "../lib/cn";

export type StatCardTone = "default" | "violet" | "blue" | "green" | "teal";

export interface StatCardProps {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: StatCardTone;
  className?: string;
}

const CARD_TONE: Record<StatCardTone, string> = {
  default: "border border-border bg-card text-card-foreground",
  violet: "bg-violet-100 text-violet-950 dark:bg-violet-500/15 dark:text-violet-100",
  blue: "bg-sky-100 text-sky-950 dark:bg-sky-500/15 dark:text-sky-100",
  green: "bg-emerald-100 text-emerald-950 dark:bg-emerald-500/15 dark:text-emerald-100",
  teal: "bg-teal-600 text-white"
};

const ICON_TONE: Record<StatCardTone, string> = {
  default: "bg-primary/10 text-primary",
  violet: "bg-white/60 text-violet-700",
  blue: "bg-white/60 text-sky-700",
  green: "bg-white/60 text-emerald-700",
  teal: "bg-white/15 text-white"
};

export function StatCard({ label, value, hint, icon, tone = "default", className }: StatCardProps) {
  return (
    <div className={cn("rounded-2xl p-5 shadow-xs", CARD_TONE[tone], className)}>
      <div className="flex items-center gap-2.5">
        {icon && (
          <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full [&>svg]:h-4 [&>svg]:w-4", ICON_TONE[tone])}>
            {icon}
          </span>
        )}
        <p className={cn("text-sm font-medium", tone === "default" ? "text-muted-foreground" : "opacity-80")}>{label}</p>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
      {hint && <p className={cn("mt-1 text-xs", tone === "default" ? "text-muted-foreground" : "opacity-70")}>{hint}</p>}
    </div>
  );
}
