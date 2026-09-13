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
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[800px] rounded-full bg-emerald-500/8 blur-[120px] dark:bg-emerald-500/12" />

      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xs shadow-emerald-700/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-foreground text-base">Ente Mahallu</span>
              <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                Setup Wizard
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="hidden sm:inline">Need assistance?</span>
            <a
              href={`https://${ROOT_DOMAIN}`}
              className="inline-flex items-center gap-1 rounded-lg border border-border/80 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted/70"
            >
              Exit to portal
            </a>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <OnboardingWizard
          initialStep={initialStep}
          initialData={initialData}
          account={user ? { fullName: user.fullName, email: user.email, phone: user.phone ?? "" } : undefined}
        />
      </div>
    </main>
  );
}
