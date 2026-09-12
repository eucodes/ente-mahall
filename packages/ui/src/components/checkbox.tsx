import * as React from "react";
import { cn } from "../lib/cn";
import { Check } from "./icons";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

/** A native checkbox, visually replaced but fully keyboard/screen-reader accessible (the real input stays, just visually hidden). */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, checked, ...props }, ref) => (
  <span className={cn("relative inline-flex h-4 w-4 shrink-0", className)}>
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      className="peer absolute inset-0 h-4 w-4 cursor-pointer opacity-0 disabled:cursor-not-allowed"
      {...props}
    />
    <span
      aria-hidden
      className={cn(
        "pointer-events-none flex h-4 w-4 items-center justify-center rounded border border-input bg-background text-primary-foreground transition-colors",
        "peer-checked:border-primary peer-checked:bg-primary",
        "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
        "peer-disabled:opacity-50"
      )}
    >
      {checked && <Check className="h-3 w-3" />}
    </span>
  </span>
));
Checkbox.displayName = "Checkbox";
