import * as React from "react";
import { cn } from "../lib/cn";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

/** A native <select>, styled to match Input with rounded-xl and smooth focus ring. */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, invalid, children, ...props }, ref) => (
  <select
    ref={ref}
    aria-invalid={invalid || undefined}
    className={cn(
      "flex h-10 w-full rounded-xl border border-input/80 bg-background px-3.5 py-2 text-sm text-foreground shadow-2xs transition-all duration-150 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
      invalid && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
