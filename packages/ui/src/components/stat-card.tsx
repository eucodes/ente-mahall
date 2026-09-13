import * as React from "react";
import { cn } from "../lib/cn";
import { TrendingUp, TrendingDown } from "./icons";

export type StatCardTone = "default" | "violet" | "blue" | "green" | "teal" | "amber" | "rose";

export interface StatCardProps {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: StatCardTone;
  trend?: {
    value: string;
    positive?: boolean;
    label?: string;
  };
  progress?: {
    current: number;
    max: number;
    label?: string;
  };
  className?: string;
}

const CARD_TONE: Record<StatCardTone, string> = {
  default: "border border-border/80 bg-card text-card-foreground hover:border-border hover:shadow-sm",
  violet: "border border-violet-200/60 bg-gradient-to-br from-violet-50/50 to-violet-100/30 text-violet-950 dark:border-violet-800/40 dark:from-violet-950/20 dark:to-violet-900/10 dark:text-violet-100",
  blue: "border border-sky-200/60 bg-gradient-to-br from-sky-50/50 to-sky-100/30 text-sky-950 dark:border-sky-800/40 dark:from-sky-950/20 dark:to-sky-900/10 dark:text-sky-100",
  green: "border border-emerald-200/60 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 text-emerald-950 dark:border-emerald-800/40 dark:from-emerald-950/20 dark:to-emerald-900/10 dark:text-emerald-100",
  teal: "border border-teal-200/60 bg-gradient-to-br from-teal-50/50 to-teal-100/30 text-teal-950 dark:border-teal-800/40 dark:from-teal-950/20 dark:to-teal-900/10 dark:text-teal-100",
  amber: "border border-amber-200/60 bg-gradient-to-br from-amber-50/50 to-amber-100/30 text-amber-950 dark:border-amber-800/40 dark:from-amber-950/20 dark:to-amber-900/10 dark:text-amber-100",
  rose: "border border-rose-200/60 bg-gradient-to-br from-rose-50/50 to-rose-100/30 text-rose-950 dark:border-rose-800/40 dark:from-rose-950/20 dark:to-rose-900/10 dark:text-rose-100"
};

const ICON_TONE: Record<StatCardTone, string> = {
  default: "bg-primary/10 text-primary dark:bg-primary/20",
  violet: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  blue: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  green: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  teal: "bg-teal-500/15 text-teal-700 dark:text-teal-300",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  rose: "bg-rose-500/15 text-rose-700 dark:text-rose-300"
};

export function StatCard({ label, value, hint, icon, tone = "default", trend, progress, className }: StatCardProps) {
  const percentage = progress ? Math.min(100, Math.round((progress.current / (progress.max || 1)) * 100)) : 0;

  return (
    <div className={cn("group relative overflow-hidden rounded-2xl p-5 transition-all duration-200", CARD_TONE[tone], className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {icon && (
            <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 [&>svg]:h-4 [&>svg]:w-4", ICON_TONE[tone])}>
              {icon}
            </span>
          )}
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        </div>

        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
              trend.positive !== false
                ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
            )}
          >
            {trend.positive !== false ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.value}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
        {trend?.label && <span className="text-xs text-muted-foreground">{trend.label}</span>}
      </div>

      {progress && (
        <div className="mt-3 space-y-1.5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          {progress.label && (
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{progress.label}</span>
              <span className="font-medium text-foreground">{percentage}%</span>
            </div>
          )}
        </div>
      )}

      {hint && !progress && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
