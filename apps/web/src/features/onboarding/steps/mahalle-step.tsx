"use client";

import type { FormEvent } from "react";
import { Building, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, FormField, Input, Textarea } from "@mahalle/ui";
import { SlugField } from "@/features/tenants/slug-field";
import type { MahalleData } from "../types";

export interface MahalleStepProps {
  value: MahalleData;
  slugTaken: boolean;
  error: string | null;
  onNameChange: (name: string) => void;
  onSlugChange: (slug: string) => void;
  onSlugAvailabilityChange: (taken: boolean) => void;
  onDescriptionChange: (description: string) => void;
  onSubmit: (event: FormEvent) => void;
}

export function MahalleStep({
  value,
  slugTaken,
  error,
  onNameChange,
  onSlugChange,
  onSlugAvailabilityChange,
  onDescriptionChange,
  onSubmit
}: MahalleStepProps) {
  return (
    <Card className="overflow-hidden border-border/80 shadow-md">
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500" />
      <CardHeader className="space-y-2 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">Mahallu Details</CardTitle>
            <CardDescription className="text-sm">
              Enter the primary identity and workspace domain for your Mahallu.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <FormField label="Mahallu Name" htmlFor="onboarding-mahalle-name" required>
            <Input
              id="onboarding-mahalle-name"
              autoFocus
              required
              leadingIcon={<Building />}
              placeholder="e.g. Town Juma Masjid Mahallu"
              value={value.name}
              onChange={(e) => onNameChange(e.target.value)}
            />
          </FormField>

          <SlugField
            id="onboarding-mahalle-slug"
            label="Mahallu Workspace URL"
            value={value.slug}
            onChange={onSlugChange}
            onAvailabilityChange={(a) => onSlugAvailabilityChange(a === "taken")}
          />

          <FormField label="Description & History" htmlFor="onboarding-mahalle-description" hint="Optional">
            <Textarea
              id="onboarding-mahalle-description"
              placeholder="Provide a brief background, history, or note about your Mahallu community..."
              maxLength={1000}
              rows={3}
              value={value.description}
              onChange={(e) => onDescriptionChange(e.target.value)}
            />
          </FormField>

          {error && (
            <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full text-sm font-semibold shadow-xs" size="lg" disabled={slugTaken || !value.name.trim() || !value.slug.trim()}>
            Continue to Location
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
