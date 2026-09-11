import * as React from "react";
import { cn } from "../lib/cn";

export interface PasswordStrengthMeterProps {
  value: string;
  className?: string;
}

function scoreOf(value: string): 0 | 1 | 2 | 3 {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 10) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value) && value.length >= 12) score++;
  return Math.min(score, 3) as 0 | 1 | 2 | 3;
}

const LABELS = ["Too weak", "Weak", "Good", "Strong"] as const;
const COLORS = ["bg-destructive", "bg-destructive", "bg-warning", "bg-success"] as const;

/** Purely client-side heuristic — never sent anywhere. Mirrors the register/onboarding password rules. */
export function PasswordStrengthMeter({ value, className }: PasswordStrengthMeterProps) {
  if (!value) return null;
  const score = scoreOf(value);

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className={cn("h-1 flex-1 rounded-full bg-muted", i < score && COLORS[score])} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{LABELS[score]}</p>
    </div>
  );
}
