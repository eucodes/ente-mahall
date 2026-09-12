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
      <Label htmlFor={id}>
        {label}
        <span className="text-destructive"> *</span>
      </Label>
      <div
        className={cn(
          "flex items-center overflow-hidden rounded-md border border-input bg-background text-sm focus-within:ring-2 focus-within:ring-ring",
          availability === "taken" && "border-destructive focus-within:ring-destructive"
        )}
      >
        <span className="select-none whitespace-nowrap bg-muted px-3 py-2 text-muted-foreground">https://</span>
        <input
          id={id}
          required
          value={value}
          onChange={(e) => onChange(slugify(e.target.value))}
          placeholder="your-mahalle"
          className="min-w-0 flex-1 bg-transparent py-2 text-foreground outline-none placeholder:text-muted-foreground"
        />
        <span className="select-none whitespace-nowrap bg-muted px-3 py-2 text-muted-foreground">.{ROOT_DOMAIN}</span>
        <span className="flex w-8 items-center justify-center text-muted-foreground">
          {availability === "checking" && <Loader className="h-4 w-4 animate-spin" />}
          {availability === "available" && <Check className="h-4 w-4 text-success" />}
          {availability === "taken" && <X className="h-4 w-4 text-destructive" />}
        </span>
      </div>
      <p
        className={cn(
          "text-xs",
          availability === "taken" ? "font-medium text-destructive" : "text-muted-foreground"
        )}
      >
        {availability === "taken"
          ? "That URL is already taken — try another."
          : availability === "available"
            ? "This URL is available."
            : "This is where you and your members will reach this Mahalle."}
      </p>
    </div>
  );
}
