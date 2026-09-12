import { redirect } from "next/navigation";
import { Sparkles } from "@mahalle/ui";
import { ROOT_DOMAIN } from "@/lib/env";
import { getSession } from "@/lib/session";
import { getMyTenants } from "@/lib/tenants";
import { getOnboardingDraft, resolveResumeStep } from "@/lib/onboarding";
import { OnboardingWizard } from "@/features/onboarding/onboarding-wizard";
import type { OnboardingDraftData } from "@/features/onboarding/types";

export default async function OnboardingPage() {
  const user = await getSession();

  // Resume from real backend state, not client guesswork: an account with no
  // Mahalle yet (e.g. the user refreshed mid-flow) picks up exactly where
  // their onboarding draft left off. An account that already owns a Mahalle
  // has nothing left to onboard.
  let initialStep: "account" | "mahalle" | "location" | "profile" | "structure" | "management" | "review" = "account";
  let initialData: OnboardingDraftData = {};

  if (user) {
    const tenants = await getMyTenants();
    if (tenants.length > 0) {
      redirect("/");
    }
    const draft = await getOnboardingDraft();
    initialStep = draft ? resolveResumeStep(draft.currentStep) : "mahalle";
    initialData = draft?.data ?? {};
  }

  return (
    <main className="min-h-screen bg-muted/40">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-semibold tracking-tight">admin.{ROOT_DOMAIN}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10 sm:py-12">
        <OnboardingWizard
          initialStep={initialStep}
          initialData={initialData}
          account={user ? { fullName: user.fullName, email: user.email, phone: user.phone ?? "" } : undefined}
        />
      </div>
    </main>
  );
}
