import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { X } from "./icons";

export const ToastProvider = ToastPrimitive.Provider;

export function ToastViewport({ className, ...props }: React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex max-h-screen w-full max-w-md flex-col-reverse items-center gap-2.5 px-4 pointer-events-none sm:max-w-lg",
        className
      )}
      {...props}
    />
  );
}

const toastVariants = cva(
  "group pointer-events-auto relative flex w-auto min-w-[280px] sm:min-w-[340px] max-w-md items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3 shadow-xl shadow-black/5 dark:shadow-black/30 backdrop-blur-md transition-all duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-5 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-5 data-[swipe=cancel]:translate-y-0 data-[swipe=end]:animate-out data-[swipe=end]:fade-out-0",
  {
    variants: {
      variant: {
        default: "border-border/80 bg-background/95 text-foreground dark:bg-card/95",
        success: "border-emerald-500/30 bg-background/95 text-foreground dark:bg-card/95 dark:border-emerald-500/30",
        warning: "border-amber-500/30 bg-background/95 text-foreground dark:bg-card/95 dark:border-amber-500/30",
        destructive: "border-rose-500/30 bg-background/95 text-foreground dark:bg-card/95 dark:border-rose-500/30"
      }
    },
    defaultVariants: { variant: "default" }
  }
);

export interface ToastRootProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>,
    VariantProps<typeof toastVariants> {}

export function Toast({ className, variant, ...props }: ToastRootProps) {
  return <ToastPrimitive.Root className={cn(toastVariants({ variant }), className)} {...props} />;
}

export function ToastTitle({ className, ...props }: React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>) {
  return <ToastPrimitive.Title className={cn("text-sm font-semibold tracking-tight text-foreground", className)} {...props} />;
}

export function ToastDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>) {
  return <ToastPrimitive.Description className={cn("text-xs text-muted-foreground mt-0.5 leading-relaxed", className)} {...props} />;
}

export function ToastClose({ className, ...props }: React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>) {
  return (
    <ToastPrimitive.Close
      className={cn(
        "rounded-full p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted/80 transition-colors shrink-0 ml-auto focus:outline-hidden",
        className
      )}
      {...props}
    >
      <X className="h-4 w-4" />
    </ToastPrimitive.Close>
  );
}
