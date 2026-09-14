import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ChevronLeft, cn } from "@mahalle/ui";

export function RecordBackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      {label}
    </Link>
  );
}

export interface RecordMetaItem {
  key: string;
  icon: ReactNode;
  label: string;
  value: ReactNode;
}

export interface RecordHeaderProps {
  media: ReactNode;
  title: ReactNode;
  reference?: string;
  chips?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  meta?: RecordMetaItem[];
}

export function RecordHeader({ media, title, reference, chips, subtitle, actions, meta = [] }: RecordHeaderProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-xs">
      <div className="h-20 bg-gradient-to-r from-primary/20 via-primary/[0.07] to-transparent sm:h-24" aria-hidden />
      <div className="px-5 pb-5 sm:px-6">
        <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:gap-5">
            <div className="w-fit shrink-0">{media}</div>
            <div className="min-w-0 sm:pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="min-w-0 break-words text-2xl font-bold tracking-tight text-foreground">{title}</h1>
                {reference && (
                  <span className="rounded-lg border border-border/70 bg-muted/50 px-2 py-0.5 font-mono text-[11px] font-medium text-muted-foreground">
                    {reference}
                  </span>
                )}
              </div>
              {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
              {chips && <div className="mt-2.5 flex flex-wrap items-center gap-1.5">{chips}</div>}
            </div>
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2 lg:pb-1">{actions}</div>}
        </div>

        {meta.length > 0 && (
          <dl className="mt-5 grid gap-x-6 gap-y-3 border-t border-border/60 pt-4 sm:grid-cols-2 xl:grid-cols-4">
            {meta.map((item) => (
              <div key={item.key} className="flex min-w-0 items-start gap-2.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted/70 text-muted-foreground [&>svg]:h-3.5 [&>svg]:w-3.5">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{item.label}</dt>
                  <dd className="truncate text-sm font-medium text-foreground">{item.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}

export function RecordLayout({ main, aside }: { main: ReactNode; aside: ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
      <div className="min-w-0 space-y-6">{main}</div>
      <aside className="min-w-0 space-y-6">{aside}</aside>
    </div>
  );
}

export interface RecordPanelProps {
  title: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  flush?: boolean;
  className?: string;
  children: ReactNode;
}

export function RecordPanel({ title, icon, action, flush = false, className, children }: RecordPanelProps) {
  return (
    <section className={cn("overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs", className)}>
      <header className="flex min-h-[52px] items-center justify-between gap-3 border-b border-border/60 px-5 py-2.5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          {icon && <span className="text-muted-foreground [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
          {title}
        </h2>
        {action}
      </header>
      <div className={cn(!flush && "p-5")}>{children}</div>
    </section>
  );
}

export type RecordChipTone = "neutral" | "emerald" | "rose" | "sky" | "amber" | "violet" | "muted";

const CHIP_TONES: Record<RecordChipTone, string> = {
  neutral: "border-border/80 bg-muted/60 text-foreground",
  emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  rose: "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  sky: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  amber: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  violet: "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  muted: "border-border bg-transparent text-muted-foreground"
};

export function RecordChip({
  tone = "neutral",
  icon,
  style,
  children
}: {
  tone?: RecordChipTone;
  icon?: ReactNode;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <span
      style={style}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold [&>svg]:h-3 [&>svg]:w-3",
        CHIP_TONES[tone]
      )}
    >
      {icon}
      {children}
    </span>
  );
}
