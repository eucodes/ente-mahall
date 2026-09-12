"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiClient, ApiError } from "@/lib/api-client";
import { slugify } from "@/features/tenants/slug-field";
import { OnboardingSteps } from "./onboarding-steps";
import { AccountStep } from "./steps/account-step";
import { MahalleStep } from "./steps/mahalle-step";
import { LocationStep } from "./steps/location-step";
import { ProfileStep } from "./steps/profile-step";
import { StructureStep } from "./steps/structure-step";
import { ManagementStep } from "./steps/management-step";
import { ReviewStep } from "./steps/review-step";
import { CompleteStep } from "./steps/complete-step";
import {
  EMPTY_LOCATION,
  EMPTY_MANAGEMENT,
  EMPTY_PROFILE,
  EMPTY_STRUCTURE,
  type AccountData,
  type LocationData,
  type MahalleData,
  type ManagementData,
  type OnboardingDraftData,
  type OnboardingStep,
  type ProfileData,
  type StructureData
} from "./types";

export interface OnboardingWizardProps {
  /** Resolved server-side from the real session/onboarding-draft state, not client guesswork — lets a refresh resume correctly. */
  initialStep: Exclude<OnboardingStep, "complete">;
  initialData: OnboardingDraftData;
  account?: AccountData;
}

const GENERIC_ERROR = "Something went wrong. Please check your connection and try again.";
const PHONE_PATTERN = /^\+?[0-9]{7,15}$/;

/** Drops empty-string/undefined values — class-validator's @IsOptional() only skips undefined, not "", so an untouched optional field must never reach the API as "". */
function omitEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === "" || value === undefined || value === null) continue;
    (result as Record<string, unknown>)[key] = value;
  }
  return result;
}

/** Best-effort autosave — a failed draft write shouldn't block the user's progress, only their ability to resume it later. */
async function saveDraft(currentStep: string, data: OnboardingDraftData) {
  try {
    await apiClient.patch("/onboarding", { currentStep, data });
  } catch {
    // Ignored — see comment above.
  }
}

export function OnboardingWizard({ initialStep, initialData, account: accountFromSession }: OnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>(initialStep);
  const isResuming = Boolean(accountFromSession);

  const [account, setAccount] = useState<AccountData>(accountFromSession ?? { fullName: "", email: "", phone: "" });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const [mahalle, setMahalle] = useState<MahalleData>({
    name: initialData.mahalle?.name ?? "",
    slug: initialData.mahalle?.slug ?? "",
    description: initialData.mahalle?.description ?? ""
  });
  const [slugEdited, setSlugEdited] = useState(Boolean(initialData.mahalle?.slug));
  const [slugTaken, setSlugTaken] = useState(false);
  const [mahalleError, setMahalleError] = useState<string | null>(null);

  const [location, setLocation] = useState<LocationData>({ ...EMPTY_LOCATION, ...initialData.location });
  const [locationErrors, setLocationErrors] = useState<Partial<Record<keyof LocationData, string>>>({});

  const [profile, setProfile] = useState<ProfileData>({ ...EMPTY_PROFILE, ...initialData.profile });
  const [profileErrors, setProfileErrors] = useState<Partial<Record<keyof ProfileData, string>>>({});

  const [structure, setStructure] = useState<StructureData>({
    ...EMPTY_STRUCTURE,
    ...initialData.structure,
    divisions: initialData.structure?.divisions ?? []
  });
  const [structureError, setStructureError] = useState<string | null>(null);

  const [management, setManagement] = useState<ManagementData>({ ...EMPTY_MANAGEMENT, ...initialData.management });

  const [confirmed, setConfirmed] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [isCreatingMahalle, setIsCreatingMahalle] = useState(false);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);

  function handleMahalleNameChange(name: string) {
    setMahalle((m) => ({ ...m, name, slug: slugEdited ? m.slug : slugify(name) }));
  }

  async function handleAccountSubmit(event: FormEvent) {
    event.preventDefault();
    setAccountError(null);

    if (!account.fullName.trim() || !account.email.trim()) {
      setAccountError("Please fill in your name and email.");
      return;
    }
    if (password.length < 10) {
      setAccountError("Password must be at least 10 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setAccountError("Passwords do not match.");
      return;
    }
    if (!agreedToTerms) {
      setAccountError("Please agree to the Terms of Service and Privacy Policy to continue.");
      return;
    }

    setIsCreatingAccount(true);
    try {
      await apiClient.post("/auth/register", {
        email: account.email.trim(),
        password,
        fullName: account.fullName.trim(),
        phone: account.phone.trim() || undefined
      });
      setStep("mahalle");
      void saveDraft("mahalle", {});
    } catch (err) {
      setAccountError(err instanceof ApiError ? err.message : GENERIC_ERROR);
    } finally {
      setIsCreatingAccount(false);
    }
  }

  function handleMahalleSubmit(event: FormEvent) {
    event.preventDefault();
    setMahalleError(null);
    if (!mahalle.name.trim()) {
      setMahalleError("Enter a name for your Mahallu.");
      return;
    }
    if (mahalle.slug.trim().length < 3) {
      setMahalleError("The Mahallu URL must be at least 3 characters.");
      return;
    }
    if (slugTaken) {
      setMahalleError("That URL is already taken — choose another.");
      return;
    }
    setStep("location");
    void saveDraft("location", { mahalle });
  }

  function handleLocationSubmit(event: FormEvent) {
    event.preventDefault();
    const errors: Partial<Record<keyof LocationData, string>> = {};
    if (!location.state.trim()) errors.state = "Select a state.";
    if (!location.district.trim()) errors.district = "Enter a district.";
    if (!location.localBody.trim()) errors.localBody = "Enter your local body.";
    if (!location.place.trim()) errors.place = "Enter your place or area.";
    if (!/^[0-9A-Za-z -]{3,12}$/.test(location.pinCode.trim())) errors.pinCode = "Enter a valid PIN code.";
    if (!location.addressLine1.trim()) errors.addressLine1 = "Enter your address.";
    setLocationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStep("profile");
    void saveDraft("profile", { location });
  }

  function handleProfileSubmit(event: FormEvent) {
    event.preventDefault();
    const errors: Partial<Record<keyof ProfileData, string>> = {};
    if (!PHONE_PATTERN.test(profile.contactPhone.trim())) errors.contactPhone = "Enter a valid phone number.";
    if (!profile.masjidName.trim()) errors.masjidName = "Enter the Masjid name.";
    if (profile.contactEmail.trim() && !/^\S+@\S+\.\S+$/.test(profile.contactEmail.trim())) {
      errors.contactEmail = "Enter a valid email address.";
    }
    if (profile.website.trim() && !/^https?:\/\/.+/.test(profile.website.trim())) {
      errors.website = "Enter a full URL, including https://.";
    }
    setProfileErrors(errors);
    if (Object.keys(errors).length > 0 || !profile.masjidName.trim()) return;

    setStep("structure");
    void saveDraft("structure", { profile });
  }

  function handleStructureSubmit(event: FormEvent) {
    event.preventDefault();
    setStructureError(null);
    if (structure.hasDivisions && !structure.divisionTerm.trim()) {
      setStructureError("Choose what you'd like to call your divisions.");
      return;
    }
    setStep("management");
    void saveDraft("management", { structure });
  }

  function handleManagementSubmit(event: FormEvent) {
    event.preventDefault();
    setStep("review");
    void saveDraft("review", { management });
  }

  function handleEdit(target: "mahalle" | "location" | "profile" | "structure" | "management") {
    setStep(target);
  }

  async function handleCreateMahalle() {
    setReviewError(null);
    setIsCreatingMahalle(true);
    try {
      const payload = omitEmpty({
        slug: mahalle.slug,
        name: mahalle.name,
        description: mahalle.description.trim() || undefined,

        country: location.country,
        state: location.state,
        district: location.district,
        localBodyType: location.localBodyType,
        localBody: location.localBody,
        place: location.place,
        pinCode: location.pinCode,
        addressLine1: location.addressLine1,
        addressLine2: location.addressLine2,
        latitude: location.latitude.trim() ? Number(location.latitude) : undefined,
        longitude: location.longitude.trim() ? Number(location.longitude) : undefined,

        logoUrl: profile.logoUrl,
        coverImageUrl: profile.coverImageUrl,
        contactPhone: profile.contactPhone,
        contactEmail: profile.contactEmail,
        website: profile.website,
        masjidName: profile.masjidName,
        masjidPhone: profile.masjidPhone,
        masjidAddress: profile.masjidAddress,
        imamName: profile.imamName,
        khatheebName: profile.khatheebName,

        hasDivisions: structure.hasDivisions,
        divisionTerm: structure.hasDivisions ? structure.divisionTerm : undefined,
        divisions:
          structure.hasDivisions && structure.divisions.length > 0
            ? structure.divisions.map((d) => omitEmpty({ name: d.name, code: d.code, description: d.description }))
            : undefined,
        houseNumberingMethod: structure.usesHouseNumbers ? structure.houseNumberingMethod : undefined,

        presidentName: management.presidentName,
        presidentPhone: management.presidentPhone,
        secretaryName: management.secretaryName,
        secretaryPhone: management.secretaryPhone,
        treasurerName: management.treasurerName,
        treasurerPhone: management.treasurerPhone
      });

      const res = await apiClient.post<{ tenant: { slug: string } }>("/tenants", payload);
      setCreatedSlug(res.tenant.slug);
      setStep("complete");
      void apiClient.delete("/onboarding").catch(() => undefined);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409 && err.message.toLowerCase().includes("url")) {
        // Someone else claimed this slug between our availability check and submission — send them back to fix it.
        setMahalleError(err.message);
        setStep("mahalle");
      } else {
        setReviewError(err instanceof ApiError ? err.message : GENERIC_ERROR);
      }
    } finally {
      setIsCreatingMahalle(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-8">
      <OnboardingSteps current={step} />

      {step === "account" && (
        <AccountStep
          value={account}
          password={password}
          confirmPassword={confirmPassword}
          agreedToTerms={agreedToTerms}
          error={accountError}
          isSubmitting={isCreatingAccount}
          onChange={(patch) => setAccount((a) => ({ ...a, ...patch }))}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onAgreedToTermsChange={setAgreedToTerms}
          onSubmit={handleAccountSubmit}
        />
      )}

      {step === "mahalle" && (
        <MahalleStep
          value={mahalle}
          slugTaken={slugTaken}
          error={mahalleError}
          onNameChange={handleMahalleNameChange}
          onSlugChange={(slug) => {
            setSlugEdited(true);
            setMahalle((m) => ({ ...m, slug }));
          }}
          onSlugAvailabilityChange={setSlugTaken}
          onDescriptionChange={(description) => setMahalle((m) => ({ ...m, description }))}
          onSubmit={handleMahalleSubmit}
        />
      )}

      {step === "location" && (
        <LocationStep
          value={location}
          errors={locationErrors}
          onChange={(patch) => setLocation((l) => ({ ...l, ...patch }))}
          onBack={() => setStep("mahalle")}
          onSubmit={handleLocationSubmit}
        />
      )}

      {step === "profile" && (
        <ProfileStep
          value={profile}
          errors={profileErrors}
          onChange={(patch) => setProfile((p) => ({ ...p, ...patch }))}
          onBack={() => setStep("location")}
          onSubmit={handleProfileSubmit}
        />
      )}

      {step === "structure" && (
        <StructureStep
          value={structure}
          error={structureError}
          onChange={(patch) => setStructure((s) => ({ ...s, ...patch }))}
          onBack={() => setStep("profile")}
          onSubmit={handleStructureSubmit}
        />
      )}

      {step === "management" && (
        <ManagementStep
          value={management}
          onChange={(patch) => setManagement((m) => ({ ...m, ...patch }))}
          onBack={() => setStep("structure")}
          onSubmit={handleManagementSubmit}
        />
      )}

      {step === "review" && (
        <ReviewStep
          account={account}
          mahalle={mahalle}
          location={location}
          profile={profile}
          structure={structure}
          management={management}
          confirmed={confirmed}
          onConfirmedChange={setConfirmed}
          error={reviewError}
          isSubmitting={isCreatingMahalle}
          onEdit={handleEdit}
          onSubmit={handleCreateMahalle}
        />
      )}

      {step === "complete" && createdSlug && (
        <CompleteStep
          slug={createdSlug}
          onGoToDashboard={() => {
            router.push(`/${createdSlug}`);
            router.refresh();
          }}
        />
      )}

      {isResuming && (step === "mahalle" || step === "location") && (
        <p className="text-center text-xs text-muted-foreground">Welcome back — pick up right where you left off.</p>
      )}
    </div>
  );
}
