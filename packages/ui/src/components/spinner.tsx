import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const spinnerVariants = cva("animate-spin rounded-full border-current border-t-transparent", {
  variants: {
    size: {
      sm: "h-3.5 w-3.5 border-2",
      md: "h-5 w-5 border-2",
      lg: "h-8 w-8 border-[3px]"
    }
  },
  defaultVariants: { size: "md" }
});

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

export function Spinner({ className, size, label = "Loading", ...props }: SpinnerProps) {
  return (
    <span role="status" className="inline-flex" {...props}>
      <span className={cn(spinnerVariants({ size }), className)} />
      <span className="sr-only">{label}</span>
    </span>
  );
}
