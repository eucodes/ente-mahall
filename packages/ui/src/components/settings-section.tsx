import * as React from "react";
import { cn } from "../lib/cn";

export interface SettingsSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Rendered on the right of the header — e.g. an "Add" button. */
  actions?: React.ReactNode;
  /** Rendered on the right of the footer bar — e.g. a Save button. */
  footer?: React.ReactNode;
  footerHint?: React.ReactNode;
  /** Drop the horizontal content padding, for tables and edge-to-edge lists. */
  flush?: boolean;
}

export function SettingsSection({
  title,
  description,
  actions,
  footer,
  footerHint,
  flush = false,
  className,
  children,
  ...props
}: SettingsSectionProps) {
  return (
    <section className={cn("overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs", className)} {...props}>
      <header className="flex flex-col gap-3 border-b border-border/60 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h2 className="text-base font-semibold tracking-tight text-foreground">{title}</h2>
          {description && <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </header>
      {children !== undefined && children !== null && children !== false && (
        <div className={cn(!flush && "px-6")}>{children}</div>
      )}
      {(footer || footerHint) && (
        <footer className="flex flex-col gap-3 border-t border-border/60 bg-muted/30 px-6 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground">{footerHint}</div>
          {footer && <div className="flex items-center gap-2 sm:ml-auto">{footer}</div>}
        </footer>
      )}
    </section>
  );
}

export interface SettingsRowProps {
  label: React.ReactNode;
  description?: React.ReactNode;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}

/** A label/description on the left and its control on the right; stacks on small screens. */
export function SettingsRow({ label, description, htmlFor, className, children }: SettingsRowProps) {
  return (
    <div
      className={cn(
        "grid gap-3 border-b border-border/50 py-5 last:border-b-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-10",
        className
      )}
    >
      <div className="min-w-0 space-y-1">
        {htmlFor ? (
          <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
            {label}
          </label>
        ) : (
          <p className="text-sm font-medium text-foreground">{label}</p>
        )}
        {description && <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>}
      </div>
      <div className="flex min-w-0 flex-col items-start justify-center md:items-end">{children}</div>
    </div>
  );
}
