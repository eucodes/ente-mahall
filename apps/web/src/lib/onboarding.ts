import "server-only";
import { serverApiGet } from "./server-api";
import type { OnboardingDraftData } from "@/features/onboarding/types";

type ResumableStep = "mahalle" | "location" | "profile" | "structure" | "management" | "review";

export interface OnboardingDraft {
  status: "DRAFT" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
  currentStep: string;
  data: OnboardingDraftData;
}

/** Real backend state for resuming onboarding after a refresh — never guessed from client-only state. Null if signed out. */
export async function getOnboardingDraft(): Promise<OnboardingDraft | null> {
  const { status, body } = await serverApiGet<{ draft: OnboardingDraft }>("/onboarding");
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.draft;
}

const RESUMABLE_STEPS = new Set<string>(["mahalle", "location", "profile", "structure", "management", "review"]);

/** Guards against a stale/unexpected currentStep value ever landing the wizard somewhere it can't render. */
export function resolveResumeStep(currentStep: string): ResumableStep {
  return RESUMABLE_STEPS.has(currentStep) ? (currentStep as ResumableStep) : "mahalle";
}
