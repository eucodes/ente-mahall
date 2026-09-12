"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FormField,
  Globe,
  ImageIcon,
  Input,
  Mail,
  Phone,
  Textarea
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { ProfileData } from "../types";

export interface ProfileStepProps {
  value: ProfileData;
  errors: Partial<Record<keyof ProfileData, string>>;
  onChange: (patch: Partial<ProfileData>) => void;
  onBack: () => void;
  onSubmit: (event: FormEvent) => void;
}

interface ImageUploadFieldProps {
  label: string;
  hint: string;
  url: string;
  onUploaded: (url: string) => void;
}

function ImageUploadField({ label, hint, url, onUploaded }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const kind = label.toLowerCase().includes("cover") ? "cover" : "logo";

  async function handleFile(file: File) {
    setError(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await apiClient.postForm<{ url: string }>(`/onboarding/uploads/${kind}`, formData);
      onUploaded(res.url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <FormField label={label} hint={!error ? hint : undefined} error={error ?? undefined}>
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-dashed border-border bg-muted">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = "";
            }}
          />
          <Button type="button" variant="outline" size="sm" isLoading={isUploading} onClick={() => inputRef.current?.click()}>
            {isUploading ? "Uploading" : url ? "Change" : "Upload"}
          </Button>
          {url && !isUploading && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onUploaded("")}>
              Remove
            </Button>
          )}
        </div>
      </div>
    </FormField>
  );
}

export function ProfileStep({ value, errors, onChange, onBack, onSubmit }: ProfileStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Set up your Mahallu profile</CardTitle>
        <CardDescription>Add your Mahallu&apos;s contact and profile information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Mahallu branding</h3>
            <ImageUploadField
              label="Mahallu Logo"
              hint="JPG, PNG, or WEBP. Square (1:1) works best. Optional."
              url={value.logoUrl}
              onUploaded={(logoUrl) => onChange({ logoUrl })}
            />
            <ImageUploadField
              label="Cover Image"
              hint="JPG, PNG, or WEBP. Optional."
              url={value.coverImageUrl}
              onUploaded={(coverImageUrl) => onChange({ coverImageUrl })}
            />
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contact information</h3>
            <FormField label="Official Phone Number" htmlFor="onboarding-contact-phone" required error={errors.contactPhone}>
              <Input
                id="onboarding-contact-phone"
                type="tel"
                required
                leadingIcon={<Phone />}
                invalid={Boolean(errors.contactPhone)}
                placeholder="Enter official Mahallu phone number"
                value={value.contactPhone}
                onChange={(e) => onChange({ contactPhone: e.target.value })}
              />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Official Email" htmlFor="onboarding-contact-email" hint="Optional" error={errors.contactEmail}>
                <Input
                  id="onboarding-contact-email"
                  type="email"
                  leadingIcon={<Mail />}
                  invalid={Boolean(errors.contactEmail)}
                  placeholder="mahallu@example.com"
                  value={value.contactEmail}
                  onChange={(e) => onChange({ contactEmail: e.target.value })}
                />
              </FormField>
              <FormField label="Website" htmlFor="onboarding-website" hint="Optional" error={errors.website}>
                <Input
                  id="onboarding-website"
                  type="url"
                  leadingIcon={<Globe />}
                  invalid={Boolean(errors.website)}
                  placeholder="https://example.com"
                  value={value.website}
                  onChange={(e) => onChange({ website: e.target.value })}
                />
              </FormField>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Masjid information</h3>
            <FormField label="Masjid Name" htmlFor="onboarding-masjid-name" required error={errors.masjidName}>
              <Input
                id="onboarding-masjid-name"
                required
                invalid={Boolean(errors.masjidName)}
                placeholder="Enter Masjid name"
                value={value.masjidName}
                onChange={(e) => onChange({ masjidName: e.target.value })}
              />
            </FormField>
            <FormField label="Masjid Phone Number" htmlFor="onboarding-masjid-phone" hint="Optional">
              <Input
                id="onboarding-masjid-phone"
                type="tel"
                value={value.masjidPhone}
                onChange={(e) => onChange({ masjidPhone: e.target.value })}
              />
            </FormField>
            <FormField label="Masjid Address" htmlFor="onboarding-masjid-address" hint="Optional">
              <Textarea
                id="onboarding-masjid-address"
                value={value.masjidAddress}
                onChange={(e) => onChange({ masjidAddress: e.target.value })}
              />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Imam Name" htmlFor="onboarding-imam-name" hint="Optional">
                <Input id="onboarding-imam-name" value={value.imamName} onChange={(e) => onChange({ imamName: e.target.value })} />
              </FormField>
              <FormField label="Khatheeb Name" htmlFor="onboarding-khatheeb-name" hint="Optional">
                <Input
                  id="onboarding-khatheeb-name"
                  value={value.khatheebName}
                  onChange={(e) => onChange({ khatheebName: e.target.value })}
                />
              </FormField>
            </div>
          </section>

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
