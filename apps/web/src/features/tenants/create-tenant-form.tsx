"use client";

import { useState, type FormEvent } from "react";
import { Building, Button, FormField, Input } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import { adminHost } from "@/lib/env";
import { slugify, SlugField } from "./slug-field";

interface CreateTenantResponse {
  tenant: { slug: string };
}

export function CreateTenantForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [slugTaken, setSlugTaken] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugEdited) setSlug(slugify(value));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await apiClient.post<CreateTenantResponse>("/tenants", { name, slug });
      // Not an internal Next.js route — this is a real cross-subdomain
      // navigation to the admin site, where the owner manages their Mahalle.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = `${window.location.protocol}//${adminHost()}/${res.tenant.slug}`;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setError(message);
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormField label="Mahalle name" htmlFor="tenant-name" required>
        <Input
          id="tenant-name"
          required
          autoFocus
          leadingIcon={<Building />}
          placeholder="Al Noor Mahalle"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
        />
      </FormField>
      <SlugField
        id="tenant-slug"
        value={slug}
        onChange={(value) => {
          setSlugEdited(true);
          setSlug(value);
        }}
        onAvailabilityChange={(a) => setSlugTaken(a === "taken")}
      />
      {error && (
        <p role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting} disabled={slugTaken}>
        Create Mahalle
      </Button>
    </form>
  );
}
