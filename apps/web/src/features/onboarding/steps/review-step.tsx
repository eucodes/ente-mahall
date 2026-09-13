import type { ReactNode } from "react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Checkbox, Check } from "@mahalle/ui";
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
  stepNumber,
  onEdit,
  children
}: {
  title: string;
  stepNumber?: number;
  onEdit?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-border/70 bg-card p-4 shadow-2xs">
      <div className="flex items-center justify-between border-b border-border/50 pb-2">
        <div className="flex items-center gap-2">
          {stepNumber && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
              {stepNumber}
            </span>
          )}
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">{title}</span>
        </div>
        {onEdit && (
          <button
            type="button"
            className="text-xs font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
            onClick={onEdit}
          >
            Edit
          </button>
        )}
      </div>
      <dl className="space-y-2 text-xs">{children}</dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-muted-foreground font-medium">{label}</dt>
      <dd className="max-w-[65%] text-right font-semibold text-foreground truncate">{value || "—"}</dd>
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
    <Card className="overflow-hidden border-border/80 shadow-md">
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500" />
      <CardHeader className="space-y-2 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Check className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">Review & Launch</CardTitle>
            <CardDescription className="text-sm">
              Verify your Mahallu configuration details before initializing your workspace.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3.5 sm:grid-cols-2">
          <Section title="Administrator Account" stepNumber={1}>
            <Row label="Name" value={account.fullName} />
            <Row label="Email" value={account.email} />
            <Row label="Phone" value={account.phone} />
          </Section>

          <Section title="Mahallu Workspace" stepNumber={2} onEdit={() => onEdit("mahalle")}>
            <Row label="Name" value={mahalle.name} />
            <Row label="Subdomain" value={mahalle.slug ? `${mahalle.slug}.${ROOT_DOMAIN}` : ""} />
            <Row label="Description" value={mahalle.description} />
          </Section>

          <Section title="Location & Boundaries" stepNumber={3} onEdit={() => onEdit("location")}>
            <Row label="State / Country" value={`${location.state || "—"}, ${location.country}`} />
            <Row label="District" value={location.district} />
            <Row label="Local Body" value={[location.localBodyType, location.localBody].filter(Boolean).join(" — ")} />
            <Row label="Place & PIN" value={[location.place, location.pinCode].filter(Boolean).join(", ")} />
          </Section>

          <Section title="Branding & Mosque" stepNumber={4} onEdit={() => onEdit("profile")}>
            <Row label="Logo / Cover" value={profile.logoUrl ? "Uploaded" : "Default"} />
            <Row label="Official Phone" value={profile.contactPhone} />
            <Row label="Main Masjid" value={profile.masjidName} />
            <Row label="Imam & Khatheeb" value={[profile.imamName, profile.khatheebName].filter(Boolean).join(", ")} />
          </Section>

          <Section title="Zoning & Numbering" stepNumber={5} onEdit={() => onEdit("structure")}>
            <Row
              label="Divisions"
              value={structure.hasDivisions ? `${structure.divisions.length} ${structure.divisionTerm || "division(s)"}` : "None"}
            />
            <Row label="House Numbers" value={structure.usesHouseNumbers ? structure.houseNumberingMethod : "Not used"} />
          </Section>

          <Section title="Key Leadership" stepNumber={6} onEdit={() => onEdit("management")}>
            <Row label="President" value={management.presidentName} />
            <Row label="Secretary" value={management.secretaryName} />
            <Row label="Treasurer" value={management.treasurerName} />
          </Section>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <label htmlFor="onboarding-confirm" className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              id="onboarding-confirm"
              checked={confirmed}
              onChange={(e) => onConfirmedChange(e.target.checked)}
              className="mt-0.5"
            />
            <span className="text-xs text-foreground/90 leading-relaxed font-medium">
              I verify that the information provided is accurate and I am authorized by the Mahallu committee to register and administer this workspace.
            </span>
          </label>
        </div>

        {error && (
          <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive">
            {error}
          </div>
        )}

        <Button
          type="button"
          className="w-full text-sm font-semibold shadow-md bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
          size="lg"
          disabled={!confirmed}
          isLoading={isSubmitting}
          onClick={onSubmit}
        >
          {isSubmitting ? "Initializing Mahallu Workspace..." : "Create & Launch Mahallu"}
        </Button>
      </CardContent>
    </Card>
  );
}
