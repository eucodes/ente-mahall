"use client";

import * as React from "react";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "./toast";

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
      <ToastProvider swipeDirection="right">
        {children}
        {toasts.map(({ id, title, description, variant, durationMs, open }) => (
          <Toast
            key={id}
            variant={variant}
            open={open}
            duration={durationMs ?? 5000}
            onOpenChange={(next) => setOpen(id, next)}
          >
            <div className="flex-1">
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
