"use client";

import { useState, type FormEvent } from "react";
import { Button, FormField, Input } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import { adminHost, ROOT_DOMAIN } from "@/lib/env";

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

interface CreateTenantResponse {
  tenant: { slug: string };
}

export function CreateTenantForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
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
        <Input id="tenant-name" required value={name} onChange={(e) => handleNameChange(e.target.value)} />
      </FormField>
      <FormField
        label="Mahalle URL"
        htmlFor="tenant-slug"
        required
        hint={`This will be reachable at ${slug || "your-mahalle"}.${ROOT_DOMAIN}`}
        error={error ?? undefined}
      >
        <Input
          id="tenant-slug"
          required
          invalid={Boolean(error)}
          value={slug}
          onChange={(e) => {
            setSlugEdited(true);
            setSlug(slugify(e.target.value));
          }}
        />
      </FormField>
      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Create Mahalle
      </Button>
    </form>
  );
}
