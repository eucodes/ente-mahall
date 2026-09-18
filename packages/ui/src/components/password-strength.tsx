import * as React from "react";
import { cn } from "../lib/cn";

export interface PasswordStrengthMeterProps {
  value: string;
  className?: string;
}

interface StrengthLevel {
  score: number;
  label: string;
  color: string;
  textColor: string;
}

function getStrength(value: string): StrengthLevel {
  if (!value) {
    return { score: 0, label: "", color: "bg-muted", textColor: "text-muted-foreground" };
  }

  const hasMinLength = value.length >= 10;
  const hasLower = /[a-z]/.test(value);
  const hasUpper = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[^A-Za-z0-9]/.test(value);
  const isVeryLong = value.length >= 14;

  const requiredCount = [hasMinLength, hasLower, hasUpper, hasNumber].filter(Boolean).length;

  if (value.length < 6 || requiredCount <= 1) {
    return {
      score: 1,
      label: "Too weak",
      color: "bg-destructive",
      textColor: "text-destructive",
    };
  }

  if (requiredCount < 4) {
    return {
      score: 2,
      label: "Weak",
      color: "bg-amber-500",
      textColor: "text-amber-600 dark:text-amber-400",
    };
  }

  if (hasSpecial || isVeryLong) {
    return {
      score: 4,
      label: "Strong",
      color: "bg-success",
      textColor: "text-success",
    };
  }

  return {
    score: 3,
    label: "Good",
    color: "bg-primary",
    textColor: "text-primary",
  };
}

/** Purely client-side heuristic — never sent anywhere. Mirrors the register/onboarding password rules. */
export function PasswordStrengthMeter({ value, className }: PasswordStrengthMeterProps) {
  if (!value) return null;
  const { score, label, color, textColor } = getStrength(value);

  return (
    <div className={cn("space-y-1.5 pt-1", className)}>
      <div className="flex gap-1.5" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              i <= score ? color : "bg-muted"
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className={cn("font-medium transition-colors duration-200", textColor)}>
          {label}
        </span>
      </div>
    </div>
  );
}

