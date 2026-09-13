import * as React from "react";
import { cn } from "../lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  /** Decorative icon rendered inside the field's left edge. */
  leadingIcon?: React.ReactNode;
  /** Icon or small control (e.g. a show/hide password toggle) rendered inside the field's right edge. */
  trailingIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", invalid, leadingIcon, trailingIcon, ...props }, ref) => {
    const input = (
      <input
        ref={ref}
        type={type}
        aria-invalid={invalid || undefined}
        className={cn(
          "flex h-10 w-full rounded-xl border border-input/80 bg-background px-3.5 py-2 text-sm text-foreground shadow-2xs transition-all duration-150 placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
          leadingIcon && "pl-10",
          trailingIcon && "pr-10",
          invalid && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
          className
        )}
        {...props}
      />
    );

    if (!leadingIcon && !trailingIcon) return input;

    return (
      <div className="relative flex w-full items-center">
        {leadingIcon && (
          <span className="pointer-events-none absolute left-3.5 flex items-center justify-center text-muted-foreground/70 [&>svg]:h-4 [&>svg]:w-4">
            {leadingIcon}
          </span>
        )}
        {input}
        {trailingIcon && (
          <span className="absolute right-3 flex items-center justify-center text-muted-foreground/70 [&>svg]:h-4 [&>svg]:w-4">
            {trailingIcon}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
