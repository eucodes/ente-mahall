import { Check, cn } from "@mahalle/ui";
import { PROGRESS_STEPS, type OnboardingStep } from "./types";

export function OnboardingSteps({ current }: { current: OnboardingStep }) {
  if (current === "complete") return null;

  const currentIndex = PROGRESS_STEPS.findIndex((s) => s.key === current);
  const total = PROGRESS_STEPS.length;
  const currentStep = PROGRESS_STEPS[currentIndex] ?? PROGRESS_STEPS[0];
  const progressPercent = Math.round(((currentIndex + 1) / total) * 100);

  return (
    <div aria-label="Onboarding progress" className="w-full space-y-4">
      {/* Mobile view */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs sm:hidden">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary text-[10px]">
              {currentIndex + 1}
            </span>
            <span className="font-semibold text-foreground">{currentStep.label}</span>
          </div>
          <span className="font-mono text-[11px] text-muted-foreground font-medium">
            Step {currentIndex + 1} of {total} ({progressPercent}%)
          </span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Desktop / Tablet view: High-end horizontal milestone stepper */}
      <div className="hidden rounded-2xl border border-border/70 bg-card/60 p-4 shadow-2xs backdrop-blur-xs sm:block">
        <ol className="flex w-full items-center justify-between">
          {PROGRESS_STEPS.map((step, index) => {
            const isComplete = index < currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <li key={step.key} className="relative flex flex-1 items-center last:flex-none">
                <div className="group flex flex-col items-center gap-2">
                  <div
                    aria-current={isCurrent ? "step" : undefined}
                    className={cn(
                      "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all duration-200",
                      isComplete
                        ? "bg-emerald-600 text-white shadow-xs shadow-emerald-600/30"
                        : isCurrent
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-xs"
                          : "border border-border/80 bg-background text-muted-foreground"
                    )}
                  >
                    {isComplete ? <Check className="h-4 w-4 stroke-[2.5]" /> : index + 1}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium tracking-tight whitespace-nowrap transition-colors",
                      isCurrent
                        ? "font-bold text-foreground"
                        : isComplete
                          ? "text-foreground/80 font-medium"
                          : "text-muted-foreground/80"
                    )}
                  >
                    {step.label}
                  </span>
                </div>

                {index < PROGRESS_STEPS.length - 1 && (
                  <div className="relative mx-2 h-0.5 flex-1 -translate-y-3">
                    <div className="absolute inset-0 bg-border/60 rounded-full" />
                    <div
                      className={cn(
                        "absolute inset-y-0 left-0 rounded-full transition-all duration-300",
                        isComplete ? "w-full bg-emerald-600" : "w-0 bg-primary"
                      )}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
