"use client";

import * as React from "react";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "./toast";
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from "./icons";
import { cn } from "../lib/cn";

export type ToastVariant = "default" | "success" | "warning" | "destructive";

export interface ToastInput {
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
}

interface ToastItem extends ToastInput {
  id: string;
  open: boolean;
}

interface ToastContextValue {
  toast: (input: ToastInput) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

/**
 * `crypto.randomUUID()` only exists in secure contexts (HTTPS or
 * localhost) — plain-HTTP local domains like http://admin.mahalle.test
 * don't qualify, so it's undefined there. Toast IDs are just React list
 * keys, not security-sensitive, so a non-cryptographic fallback is fine.
 */
function generateToastId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function ToastIcon({ variant }: { variant?: ToastVariant }) {
  switch (variant) {
    case "success":
      return (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
        </div>
      );
    case "destructive":
      return (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
          <AlertCircle className="h-4 w-4" />
        </div>
      );
    case "warning":
      return (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-4 w-4" />
        </div>
      );
    default:
      return (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Info className="h-4 w-4" />
        </div>
      );
  }
}

export function ToastHost({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback((input: ToastInput) => {
    const id = generateToastId();
    setToasts((prev) => [...prev, { ...input, id, open: true }]);
  }, []);

  const setOpen = (id: string, open: boolean) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, open } : t)));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastProvider swipeDirection="down">
        {children}
        {toasts.map(({ id, title, description, variant, durationMs, open }) => (
          <Toast
            key={id}
            variant={variant}
            open={open}
            duration={durationMs ?? 4000}
            onOpenChange={(next) => setOpen(id, next)}
            className={cn(
              description ? "items-start" : "items-center"
            )}
          >
            <ToastIcon variant={variant} />
            <div className="flex-1 min-w-0 pr-1">
              <ToastTitle>{title}</ToastTitle>
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  );
}

/** Fire success/error/warning/info toasts from anywhere — never window.alert(). */
export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastHost>");
  }
  return ctx;
}
