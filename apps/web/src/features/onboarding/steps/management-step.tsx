"use client";

import type { FormEvent } from "react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, FormField, Input, Phone } from "@mahalle/ui";
import type { ManagementData } from "../types";

export interface ManagementStepProps {
  value: ManagementData;
  onChange: (patch: Partial<ManagementData>) => void;
  onBack: () => void;
  onSubmit: (event: FormEvent) => void;
}

const ROLES: { key: "president" | "secretary" | "treasurer"; label: string }[] = [
  { key: "president", label: "President" },
  { key: "secretary", label: "Secretary" },
  { key: "treasurer", label: "Treasurer" }
];

export function ManagementStep({ value, onChange, onBack, onSubmit }: ManagementStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Set up your Mahallu management</CardTitle>
        <CardDescription>Add the primary management members. You can add the complete committee later.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          {ROLES.map(({ key, label }) => (
            <section key={key} className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Name" htmlFor={`onboarding-${key}-name`} hint="Optional">
                  <Input
                    id={`onboarding-${key}-name`}
                    value={value[`${key}Name`]}
                    onChange={(e) => onChange({ [`${key}Name`]: e.target.value } as Partial<ManagementData>)}
                  />
                </FormField>
                <FormField label="Phone Number" htmlFor={`onboarding-${key}-phone`} hint="Optional">
                  <Input
                    id={`onboarding-${key}-phone`}
                    type="tel"
                    leadingIcon={<Phone />}
                    value={value[`${key}Phone`]}
                    onChange={(e) => onChange({ [`${key}Phone`]: e.target.value } as Partial<ManagementData>)}
                  />
                </FormField>
              </div>
            </section>
          ))}

          <p className="text-sm text-muted-foreground">
            You can add and manage all committee members later from Committee Management.
          </p>

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" className="w-full" size="lg">
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
