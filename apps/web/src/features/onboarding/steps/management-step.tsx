"use client";

import type { FormEvent } from "react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, FormField, Input, Phone, User } from "@mahalle/ui";
import type { ManagementData } from "../types";

export interface ManagementStepProps {
  value: ManagementData;
  onChange: (patch: Partial<ManagementData>) => void;
  onBack: () => void;
  onSubmit: (event: FormEvent) => void;
}

const ROLES: { key: "president" | "secretary" | "treasurer"; label: string; badge: string; desc: string }[] = [
  { key: "president", label: "President", badge: "Primary Executive", desc: "Leads committee meetings and oversees administrative governance." },
  { key: "secretary", label: "General Secretary", badge: "Administrative Lead", desc: "Maintains records, family registries, and day-to-day operations." },
  { key: "treasurer", label: "Treasurer", badge: "Financial Officer", desc: "Oversees accounts, collections, and financial disbursements." }
];

export function ManagementStep({ value, onChange, onBack, onSubmit }: ManagementStepProps) {
  return (
    <Card className="overflow-hidden border-border/80 shadow-md">
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500" />
      <CardHeader className="space-y-2 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">Key Leadership Committee</CardTitle>
            <CardDescription className="text-sm">
              Designate the primary executive office bearers. You can add the full committee and advisors later.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          {ROLES.map(({ key, label, badge, desc }) => (
            <div key={key} className="space-y-3 rounded-xl border border-border/70 bg-card p-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-border/50 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">{label}</span>
                  <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                    {badge}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{desc}</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 pt-1">
                <FormField label="Full Name" htmlFor={`onboarding-${key}-name`} hint="Optional">
                  <Input
                    id={`onboarding-${key}-name`}
                    leadingIcon={<User />}
                    placeholder={`Enter ${label}'s name`}
                    value={value[`${key}Name`]}
                    onChange={(e) => onChange({ [`${key}Name`]: e.target.value } as Partial<ManagementData>)}
                  />
                </FormField>
                <FormField label="Phone Number" htmlFor={`onboarding-${key}-phone`} hint="Optional">
                  <Input
                    id={`onboarding-${key}-phone`}
                    type="tel"
                    leadingIcon={<Phone />}
                    placeholder="+91 98765 43210"
                    value={value[`${key}Phone`]}
                    onChange={(e) => onChange({ [`${key}Phone`]: e.target.value } as Partial<ManagementData>)}
                  />
                </FormField>
              </div>
            </div>
          ))}

          <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5 text-xs text-muted-foreground flex items-center gap-2">
            <span>ℹ️</span>
            <span>All designations are optional now. You can manage complete committee terms, vice presidents, and members in Committee Management after launch.</span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="button" variant="outline" size="lg" onClick={onBack} className="min-w-[100px]">
              Back
            </Button>
            <Button type="submit" className="flex-1 text-sm font-semibold shadow-xs" size="lg">
              Continue to Review
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
