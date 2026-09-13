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
      <div className="flex items-center gap-4 rounded-xl border border-border/70 bg-muted/20 p-3">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/60 shadow-2xs">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-6 w-6 text-muted-foreground/60" />
          )}
        </div>
        <div className="flex flex-1 flex-wrap items-center gap-2">
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            isLoading={isUploading}
            onClick={() => inputRef.current?.click()}
            className="text-xs font-semibold"
          >
            {isUploading ? "Uploading..." : url ? "Replace Image" : "Upload File"}
          </Button>
          {url && !isUploading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onUploaded("")}
              className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            >
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
    <Card className="overflow-hidden border-border/80 shadow-md">
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500" />
      <CardHeader className="space-y-2 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">Profile & Masjid Details</CardTitle>
            <CardDescription className="text-sm">
              Configure your visual branding, official communication channels, and primary mosque information.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          {/* Section 1: Branding */}
          <div className="space-y-4 rounded-xl border border-border/60 bg-muted/15 p-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">1. Visual Branding</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ImageUploadField
                label="Mahallu Logo"
                hint="Square (1:1) PNG/JPG recommended"
                url={value.logoUrl}
                onUploaded={(logoUrl) => onChange({ logoUrl })}
              />
              <ImageUploadField
                label="Cover Image"
                hint="Wide landscape photo for header"
                url={value.coverImageUrl}
                onUploaded={(coverImageUrl) => onChange({ coverImageUrl })}
              />
            </div>
          </div>

          {/* Section 2: Contact */}
          <div className="space-y-4 rounded-xl border border-border/60 bg-muted/15 p-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">2. Contact Channels</span>
            </div>
            <FormField label="Official Phone Number" htmlFor="onboarding-contact-phone" required error={errors.contactPhone}>
              <Input
                id="onboarding-contact-phone"
                type="tel"
                required
                leadingIcon={<Phone />}
                invalid={Boolean(errors.contactPhone)}
                placeholder="+91 98765 43210"
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
                  placeholder="contact@mahallu.org"
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
                  placeholder="https://mahallu.org"
                  value={value.website}
                  onChange={(e) => onChange({ website: e.target.value })}
                />
              </FormField>
            </div>
          </div>

          {/* Section 3: Masjid */}
          <div className="space-y-4 rounded-xl border border-border/60 bg-muted/15 p-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">3. Primary Masjid & Leadership</span>
            </div>
            <FormField label="Masjid Name" htmlFor="onboarding-masjid-name" required error={errors.masjidName}>
              <Input
                id="onboarding-masjid-name"
                required
                invalid={Boolean(errors.masjidName)}
                placeholder="e.g. Town Central Juma Masjid"
                value={value.masjidName}
                onChange={(e) => onChange({ masjidName: e.target.value })}
              />
            </FormField>
            <FormField label="Masjid Contact Number" htmlFor="onboarding-masjid-phone" hint="Optional">
              <Input
                id="onboarding-masjid-phone"
                type="tel"
                leadingIcon={<Phone />}
                placeholder="Office or reception contact"
                value={value.masjidPhone}
                onChange={(e) => onChange({ masjidPhone: e.target.value })}
              />
            </FormField>
            <FormField label="Masjid Full Address" htmlFor="onboarding-masjid-address" hint="Optional">
              <Textarea
                id="onboarding-masjid-address"
                placeholder="Complete address if different from administrative office..."
                rows={2}
                value={value.masjidAddress}
                onChange={(e) => onChange({ masjidAddress: e.target.value })}
              />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Imam Name" htmlFor="onboarding-imam-name" hint="Optional">
                <Input
                  id="onboarding-imam-name"
                  placeholder="e.g. Usthad Ahmad Kabeer"
                  value={value.imamName}
                  onChange={(e) => onChange({ imamName: e.target.value })}
                />
              </FormField>
              <FormField label="Khatheeb Name" htmlFor="onboarding-khatheeb-name" hint="Optional">
                <Input
                  id="onboarding-khatheeb-name"
                  placeholder="e.g. Usthad Abdul Rahman"
                  value={value.khatheebName}
                  onChange={(e) => onChange({ khatheebName: e.target.value })}
                />
              </FormField>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="button" variant="outline" size="lg" onClick={onBack} className="min-w-[100px]">
              Back
            </Button>
            <Button type="submit" className="flex-1 text-sm font-semibold shadow-xs" size="lg">
              Continue to Structure
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
