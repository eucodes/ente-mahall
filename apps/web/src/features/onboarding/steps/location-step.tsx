"use client";

import { useState, type FormEvent } from "react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, FormField, Input, MapPin, Select } from "@mahalle/ui";
import { INDIAN_STATES, KERALA_DISTRICTS, LOCAL_BODY_TYPES, type LocationData } from "../types";

export interface LocationStepProps {
  value: LocationData;
  errors: Partial<Record<keyof LocationData, string>>;
  onChange: (patch: Partial<LocationData>) => void;
  onBack: () => void;
  onSubmit: (event: FormEvent) => void;
}

export function LocationStep({ value, errors, onChange, onBack, onSubmit }: LocationStepProps) {
  const [showCoordinates, setShowCoordinates] = useState(Boolean(value.latitude || value.longitude));
  const isKerala = value.state === "Kerala";

  return (
    <Card className="overflow-hidden border-border/80 shadow-md">
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500" />
      <CardHeader className="space-y-2 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">Location & Jurisdiction</CardTitle>
            <CardDescription className="text-sm">
              Specify the geographic location and local administrative boundaries of your Mahallu.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Country" htmlFor="onboarding-country" required>
              <Select id="onboarding-country" value={value.country} onChange={(e) => onChange({ country: e.target.value })}>
                <option value="India">India</option>
              </Select>
            </FormField>
            <FormField label="State" htmlFor="onboarding-state" required error={errors.state}>
              <Select
                id="onboarding-state"
                required
                invalid={Boolean(errors.state)}
                value={value.state}
                onChange={(e) => onChange({ state: e.target.value, district: "" })}
              >
                <option value="">Select a state</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="District" htmlFor="onboarding-district" required error={errors.district}>
              {isKerala ? (
                <Select
                  id="onboarding-district"
                  required
                  invalid={Boolean(errors.district)}
                  value={value.district}
                  onChange={(e) => onChange({ district: e.target.value })}
                >
                  <option value="">Select district in Kerala</option>
                  {KERALA_DISTRICTS.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input
                  id="onboarding-district"
                  required
                  invalid={Boolean(errors.district)}
                  placeholder="e.g. Coimbatore"
                  value={value.district}
                  onChange={(e) => onChange({ district: e.target.value })}
                />
              )}
            </FormField>
            <FormField label="Local Body Type" htmlFor="onboarding-local-body-type" required>
              <Select
                id="onboarding-local-body-type"
                required
                value={value.localBodyType}
                onChange={(e) => onChange({ localBodyType: e.target.value })}
              >
                <option value="">Select local body type</option>
                {LOCAL_BODY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField label="Local Body Name" htmlFor="onboarding-local-body" required error={errors.localBody}>
            <Input
              id="onboarding-local-body"
              required
              invalid={Boolean(errors.localBody)}
              placeholder="e.g. Parappur Grama Panchayat or Kozhikode Corporation"
              value={value.localBody}
              onChange={(e) => onChange({ localBody: e.target.value })}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Place / Village / Town" htmlFor="onboarding-place" required error={errors.place}>
              <Input
                id="onboarding-place"
                required
                leadingIcon={<MapPin />}
                invalid={Boolean(errors.place)}
                placeholder="e.g. Parappur Town"
                value={value.place}
                onChange={(e) => onChange({ place: e.target.value })}
              />
            </FormField>
            <FormField label="PIN Code" htmlFor="onboarding-pincode" required error={errors.pinCode}>
              <Input
                id="onboarding-pincode"
                required
                inputMode="numeric"
                invalid={Boolean(errors.pinCode)}
                placeholder="676503"
                value={value.pinCode}
                onChange={(e) => onChange({ pinCode: e.target.value })}
              />
            </FormField>
          </div>

          <FormField label="Address Line 1" htmlFor="onboarding-address-1" required error={errors.addressLine1}>
            <Input
              id="onboarding-address-1"
              required
              invalid={Boolean(errors.addressLine1)}
              placeholder="Main Road, Near Old Post Office"
              value={value.addressLine1}
              onChange={(e) => onChange({ addressLine1: e.target.value })}
            />
          </FormField>
          <FormField label="Address Line 2" htmlFor="onboarding-address-2" hint="Optional">
            <Input
              id="onboarding-address-2"
              placeholder="Building, Landmark, or Post Box"
              value={value.addressLine2}
              onChange={(e) => onChange({ addressLine2: e.target.value })}
            />
          </FormField>

          <div className="rounded-xl border border-dashed border-border/80 bg-muted/30 p-4 transition-colors">
            {showCoordinates ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" /> GPS Coordinates
                  </span>
                  <button
                    type="button"
                    className="text-xs font-semibold text-destructive hover:underline"
                    onClick={() => {
                      setShowCoordinates(false);
                      onChange({ latitude: "", longitude: "" });
                    }}
                  >
                    Clear coordinates
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    aria-label="Latitude"
                    inputMode="decimal"
                    placeholder="Latitude (e.g. 11.0501)"
                    value={value.latitude}
                    onChange={(e) => onChange({ latitude: e.target.value })}
                  />
                  <Input
                    aria-label="Longitude"
                    inputMode="decimal"
                    placeholder="Longitude (e.g. 76.0711)"
                    value={value.longitude}
                    onChange={(e) => onChange({ longitude: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="flex items-center gap-2 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                onClick={() => setShowCoordinates(true)}
              >
                <MapPin className="h-4 w-4" /> Add precise GPS coordinates (Optional)
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="button" variant="outline" size="lg" onClick={onBack} className="min-w-[100px]">
              Back
            </Button>
            <Button type="submit" className="flex-1 text-sm font-semibold shadow-xs" size="lg">
              Continue to Profile
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
