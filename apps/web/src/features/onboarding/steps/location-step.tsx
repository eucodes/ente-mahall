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
    <Card>
      <CardHeader>
        <CardTitle>Where is your Mahallu located?</CardTitle>
        <CardDescription>Add the location and address of your Mahallu.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
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
                  <option value="">Select a district</option>
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
                  placeholder="Enter your district"
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
                <option value="">Select a type</option>
                {LOCAL_BODY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField label="Local Body" htmlFor="onboarding-local-body" required error={errors.localBody}>
            <Input
              id="onboarding-local-body"
              required
              invalid={Boolean(errors.localBody)}
              placeholder="e.g. Parappur Grama Panchayat"
              value={value.localBody}
              onChange={(e) => onChange({ localBody: e.target.value })}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Place / Area" htmlFor="onboarding-place" required error={errors.place}>
              <Input
                id="onboarding-place"
                required
                leadingIcon={<MapPin />}
                invalid={Boolean(errors.place)}
                placeholder="Enter your place or area"
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
                placeholder="Enter PIN code"
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
              placeholder="Building / Street / Locality"
              value={value.addressLine1}
              onChange={(e) => onChange({ addressLine1: e.target.value })}
            />
          </FormField>
          <FormField label="Address Line 2" htmlFor="onboarding-address-2" hint="Optional">
            <Input
              id="onboarding-address-2"
              placeholder="Apartment, landmark, etc."
              value={value.addressLine2}
              onChange={(e) => onChange({ addressLine2: e.target.value })}
            />
          </FormField>

          <div className="rounded-md border border-dashed border-border p-3">
            {showCoordinates ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Map coordinates (optional)</p>
                  <button
                    type="button"
                    className="text-xs font-medium text-primary hover:underline"
                    onClick={() => {
                      setShowCoordinates(false);
                      onChange({ latitude: "", longitude: "" });
                    }}
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    aria-label="Latitude"
                    inputMode="decimal"
                    placeholder="Latitude"
                    value={value.latitude}
                    onChange={(e) => onChange({ latitude: e.target.value })}
                  />
                  <Input
                    aria-label="Longitude"
                    inputMode="decimal"
                    placeholder="Longitude"
                    value={value.longitude}
                    onChange={(e) => onChange({ longitude: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                onClick={() => setShowCoordinates(true)}
              >
                <MapPin className="h-4 w-4" /> Set location on map
              </button>
            )}
          </div>

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
