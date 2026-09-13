import * as React from "react";
import { cn } from "../lib/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, invalid, ...props }, ref) => (
  <textarea
    ref={ref}
    aria-invalid={invalid || undefined}
    className={cn(
      "flex min-h-24 w-full rounded-xl border border-input/80 bg-background px-3.5 py-2.5 text-sm text-foreground shadow-2xs transition-all duration-150 placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
      invalid && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
