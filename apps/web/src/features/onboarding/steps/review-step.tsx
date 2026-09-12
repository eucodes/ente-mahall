"use client";

import type { ReactNode } from "react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Checkbox } from "@mahalle/ui";
import { ROOT_DOMAIN } from "@/lib/env";
import type { AccountData, LocationData, MahalleData, ManagementData, ProfileData, StructureData } from "../types";

export interface ReviewStepProps {
  account: AccountData;
  mahalle: MahalleData;
  location: LocationData;
  profile: ProfileData;
  structure: StructureData;
  management: ManagementData;
  confirmed: boolean;
  onConfirmedChange: (confirmed: boolean) => void;
  error: string | null;
  isSubmitting: boolean;
  onEdit: (step: "mahalle" | "location" | "profile" | "structure" | "management") => void;
  onSubmit: () => void;
}

function Section({
  title,
  onEdit,
  children
}: {
  title: string;
  onEdit?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-md border border-border bg-muted/40 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
        {onEdit && (
          <button type="button" className="text-xs font-medium text-primary hover:underline" onClick={onEdit}>
            Edit
          </button>
        )}
      </div>
      <dl className="space-y-2 text-sm">{children}</dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="max-w-[65%] text-right font-medium">{value || "—"}</dd>
    </div>
  );
}

export function ReviewStep({
  account,
  mahalle,
  location,
  profile,
  structure,
  management,
  confirmed,
  onConfirmedChange,
  error,
  isSubmitting,
  onEdit,
  onSubmit
}: ReviewStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review your Mahallu</CardTitle>
        <CardDescription>Review your information before creating your Mahallu.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Section title="Account">
          <Row label="Full Name" value={account.fullName} />
          <Row label="Email" value={account.email} />
          <Row label="Phone" value={account.phone} />
        </Section>

        <Section title="Mahallu" onEdit={() => onEdit("mahalle")}>
          <Row label="Name" value={mahalle.name} />
          <Row label="URL" value={mahalle.slug ? `${mahalle.slug}.${ROOT_DOMAIN}` : ""} />
          <Row label="Description" value={mahalle.description} />
        </Section>

        <Section title="Location" onEdit={() => onEdit("location")}>
          <Row label="Country" value={location.country} />
          <Row label="State" value={location.state} />
          <Row label="District" value={location.district} />
          <Row label="Local Body" value={[location.localBodyType, location.localBody].filter(Boolean).join(" — ")} />
          <Row label="Place" value={location.place} />
          <Row label="PIN Code" value={location.pinCode} />
          <Row
            label="Address"
            value={[location.addressLine1, location.addressLine2].filter(Boolean).join(", ")}
          />
        </Section>

        <Section title="Profile" onEdit={() => onEdit("profile")}>
          <Row label="Logo" value={profile.logoUrl ? "Uploaded" : "Not set"} />
          <Row label="Official Phone" value={profile.contactPhone} />
          <Row label="Official Email" value={profile.contactEmail} />
          <Row label="Website" value={profile.website} />
          <Row label="Masjid Name" value={profile.masjidName} />
          <Row label="Imam" value={profile.imamName} />
        </Section>

        <Section title="Structure" onEdit={() => onEdit("structure")}>
          <Row label="Divisions" value={structure.hasDivisions ? `${structure.divisions.length} ${structure.divisionTerm || "division(s)"}` : "None"} />
          <Row label="House numbers" value={structure.usesHouseNumbers ? structure.houseNumberingMethod : "Not used"} />
        </Section>

        <Section title="Management" onEdit={() => onEdit("management")}>
          <Row label="President" value={management.presidentName} />
          <Row label="Secretary" value={management.secretaryName} />
          <Row label="Treasurer" value={management.treasurerName} />
        </Section>

        <label htmlFor="onboarding-confirm" className="flex items-start gap-2.5 pt-1">
          <Checkbox
            id="onboarding-confirm"
            checked={confirmed}
            onChange={(e) => onConfirmedChange(e.target.checked)}
            className="mt-0.5"
          />
          <span className="text-sm text-muted-foreground">
            I confirm that the information provided is accurate and I am authorized to create and manage this Mahallu.
          </span>
        </label>

        {error && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {error}
          </p>
        )}

        <Button
          type="button"
          className="w-full"
          size="lg"
          disabled={!confirmed}
          isLoading={isSubmitting}
          onClick={onSubmit}
        >
          {isSubmitting ? "Creating your Mahallu..." : "Create Mahallu"}
        </Button>
      </CardContent>
    </Card>
  );
}
