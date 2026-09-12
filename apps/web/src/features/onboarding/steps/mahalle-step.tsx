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
    <Card>
      <CardHeader>
        <CardTitle>Tell us about your Mahallu</CardTitle>
        <CardDescription>Enter the basic information about the Mahallu you want to manage.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <FormField label="Mahallu Name" htmlFor="onboarding-mahalle-name" required>
            <Input
              id="onboarding-mahalle-name"
              autoFocus
              required
              leadingIcon={<Building />}
              placeholder="Enter Mahallu name"
              value={value.name}
              onChange={(e) => onNameChange(e.target.value)}
            />
          </FormField>
          <SlugField
            id="onboarding-mahalle-slug"
            label="Mahallu URL"
            value={value.slug}
            onChange={onSlugChange}
            onAvailabilityChange={(a) => onSlugAvailabilityChange(a === "taken")}
          />
          <FormField label="Mahallu Description" htmlFor="onboarding-mahalle-description" hint="Optional">
            <Textarea
              id="onboarding-mahalle-description"
              placeholder="Write a short description about your Mahallu"
              maxLength={1000}
              value={value.description}
              onChange={(e) => onDescriptionChange(e.target.value)}
            />
          </FormField>
          {error && (
            <p role="alert" className="text-xs font-medium text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" size="lg" disabled={slugTaken}>
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
