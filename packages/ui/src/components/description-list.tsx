import * as React from "react";
import { cn } from "../lib/cn";

export interface DetailGridProps extends React.HTMLAttributes<HTMLDListElement> {
  columns?: 2 | 3;
}

export function DetailGrid({ columns = 2, className, ...props }: DetailGridProps) {
  return (
    <dl
      className={cn(
        "grid gap-x-8 gap-y-5",
        columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2",
        className
      )}
      {...props}
    />
  );
}

export interface DetailItemProps {
  label: React.ReactNode;
  icon?: React.ReactNode;
  /** Span every column of the grid. */
  wide?: boolean;
  mono?: boolean;
  className?: string;
  children?: React.ReactNode;
}

function isEmpty(value: React.ReactNode) {
  return value === null || value === undefined || value === false || value === "";
}

export function DetailItem({ label, icon, wide = false, mono = false, className, children }: DetailItemProps) {
  return (
    <div className={cn("min-w-0", wide && "sm:col-span-full", className)}>
      <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground [&>svg]:h-3.5 [&>svg]:w-3.5">
        {icon}
        {label}
      </dt>
      <dd className={cn("mt-1 break-words text-sm font-medium text-foreground", mono && "font-mono")}>
        {isEmpty(children) ? <span className="font-normal text-muted-foreground/70">Not recorded</span> : children}
      </dd>
    </div>
  );
}
