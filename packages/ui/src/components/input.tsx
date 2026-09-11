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
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          leadingIcon && "pl-9",
          trailingIcon && "pr-9",
          invalid && "border-destructive focus-visible:ring-destructive",
          className
        )}
        {...props}
      />
    );

    if (!leadingIcon && !trailingIcon) return input;

    return (
      <div className="relative flex items-center">
        {leadingIcon && (
          <span className="pointer-events-none absolute left-3 flex text-muted-foreground [&>svg]:h-4 [&>svg]:w-4">
            {leadingIcon}
          </span>
        )}
        {input}
        {trailingIcon && <span className="absolute right-2 flex [&>svg]:h-4 [&>svg]:w-4">{trailingIcon}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
