"use client";

import { useEffect, useRef, useState } from "react";
import { Check, cn, Label, Loader, X } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import { ROOT_DOMAIN } from "@/lib/env";

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

type Availability = "idle" | "checking" | "available" | "taken";

export interface SlugFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  /** Called whenever the debounced availability check settles — lets the parent block submission while a slug is taken. */
  onAvailabilityChange?: (availability: Availability) => void;
}

/** A workspace-URL style field with a live, debounced availability check against the public tenant lookup. */
export function SlugField({ id, value, onChange, label = "Mahalle URL", onAvailabilityChange }: SlugFieldProps) {
  const [availability, setAvailability] = useState<Availability>("idle");
  const requestId = useRef(0);

  useEffect(() => {
    // Debounced search-as-you-type: setting "checking"/"idle" synchronously
    // here (before the timer fires) is the correct, intended behavior, not
    // an effect anti-pattern — it's what makes the status indicator update
    // immediately as the user types, ahead of the debounced network check.
    if (!value) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAvailability("idle");
      return;
    }
    setAvailability("checking");
    const thisRequest = ++requestId.current;
    const timer = setTimeout(() => {
      apiClient
        .get(`/tenants/${encodeURIComponent(value)}`)
        .then(() => {
          if (requestId.current === thisRequest) setAvailability("taken");
        })
        .catch((err) => {
          if (requestId.current !== thisRequest) return;
          setAvailability(err instanceof ApiError && err.status === 404 ? "available" : "idle");
        });
    }, 450);
    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    onAvailabilityChange?.(availability);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availability]);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-semibold text-foreground">
        {label}
        <span className="text-destructive"> *</span>
      </Label>
      <div
        className={cn(
          "group flex items-center overflow-hidden rounded-xl border border-input/80 bg-background text-sm shadow-2xs transition-all duration-150 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          availability === "taken" && "border-destructive focus-within:border-destructive focus-within:ring-destructive/20"
        )}
      >
        <span className="select-none border-r border-border/60 bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground">
          https://
        </span>
        <input
          id={id}
          required
          value={value}
          onChange={(e) => onChange(slugify(e.target.value))}
          placeholder="your-mahalle"
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/50"
        />
        <span className="select-none border-l border-border/60 bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground">
          .{ROOT_DOMAIN}
        </span>
        <span className="flex w-9 items-center justify-center text-muted-foreground">
          {availability === "checking" && <Loader className="h-4 w-4 animate-spin text-primary" />}
          {availability === "available" && <Check className="h-4 w-4 text-emerald-600" />}
          {availability === "taken" && <X className="h-4 w-4 text-destructive" />}
        </span>
      </div>
      <p
        className={cn(
          "text-xs transition-colors",
          availability === "taken" ? "font-medium text-destructive" : availability === "available" ? "font-medium text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
        )}
      >
        {availability === "taken"
          ? "That URL is already taken — choose another identifier."
          : availability === "available"
            ? "Perfect! This URL identifier is available."
            : "Members and admins will access your workspace via this unique subdomain."}
      </p>
    </div>
  );
}
