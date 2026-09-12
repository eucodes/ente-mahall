import { Check, cn } from "@mahalle/ui";
import { PROGRESS_STEPS, type OnboardingStep } from "./types";

/**
 * Desktop: a compact horizontal row of numbered/checkmarked steps.
 * Mobile: collapses to "Step X of 7" plus a thin progress bar — a 7-circle
 * row has no room on a phone screen, per the spec's mobile mockup.
 */
export function OnboardingSteps({ current }: { current: OnboardingStep }) {
  if (current === "complete") return null;

  const currentIndex = PROGRESS_STEPS.findIndex((s) => s.key === current);
  const total = PROGRESS_STEPS.length;

  return (
    <div aria-label="Onboarding progress">
      {/* Mobile */}
      <div className="sm:hidden">
        <p className="text-xs font-medium text-muted-foreground">
          Step {currentIndex + 1} of {total}
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop / tablet */}
      <ol className="hidden sm:flex sm:w-full sm:items-center">
        {PROGRESS_STEPS.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <li key={step.key} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    isComplete
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                        ? "bg-primary/15 text-primary ring-2 ring-primary"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {isComplete ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </div>
                <span
                  className={cn(
                    "text-[11px] font-medium",
                    isCurrent || isComplete ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < PROGRESS_STEPS.length - 1 && (
                <div className={cn("mx-1.5 h-px flex-1 -translate-y-2.5 lg:mx-2", isComplete ? "bg-primary" : "bg-border")} />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
