"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
  Textarea,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { PlatformTenant } from "@/lib/platform";

interface ProvisionTenantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTenantCreated?: (tenant: PlatformTenant) => void;
}

export function ProvisionTenantDialog({
  open,
  onOpenChange,
  onTenantCreated
}: ProvisionTenantDialogProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("Kerala");
  const [place, setPlace] = useState("");
  const [masjidName, setMasjidName] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleNameChange(val: string) {
    setName(val);
    // Auto-suggest slug if user hasn't typed a custom slug
    const generated = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generated);
  }

  function resetForm() {
    setName("");
    setSlug("");
    setDescription("");
    setOwnerEmail("");
    setContactEmail("");
    setContactPhone("");
    setDistrict("");
    setState("Kerala");
    setPlace("");
    setMasjidName("");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      setError("Name and slug are required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await apiClient.post<{ tenant: PlatformTenant }>("/platform/tenants", {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        description: description.trim() || undefined,
        ownerEmail: ownerEmail.trim() || undefined,
        contactEmail: contactEmail.trim() || undefined,
        contactPhone: contactPhone.trim() || undefined,
        district: district.trim() || undefined,
        state: state.trim() || undefined,
        place: place.trim() || undefined,
        masjidName: masjidName.trim() || undefined
      });

      toast({
        title: "Mahalle Provisioned",
        description: `${res.tenant.name} (${res.tenant.slug}) has been successfully created.`,
        variant: "success"
      });

      resetForm();
      onOpenChange(false);
      if (onTenantCreated) {
        onTenantCreated(res.tenant);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to provision Mahalle");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto sm:rounded-2xl border-border">
        <DialogHeader>
          <DialogTitle className="text-base">Provision New Mahalle</DialogTitle>
          <DialogDescription className="text-xs">
            Directly commission an active Mahalle tenant on the platform.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Mahalle Name" htmlFor="name" required>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Al-Huda Juma Masjid"
                required
              />
            </FormField>

            <FormField label="Tenant Slug / Domain" htmlFor="slug" required>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                placeholder="e.g. al-huda"
                required
              />
            </FormField>
          </div>

          <FormField label="Description (Optional)" htmlFor="description">
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this Mahalle jurisdiction..."
              rows={2}
            />
          </FormField>

          <div className="border-t border-border/60 pt-3">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Leadership &amp; Location
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Assigned Owner Email (Optional)" htmlFor="ownerEmail">
                <Input
                  id="ownerEmail"
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="admin@example.com"
                />
              </FormField>

              <FormField label="Central Masjid Name" htmlFor="masjidName">
                <Input
                  id="masjidName"
                  value={masjidName}
                  onChange={(e) => setMasjidName(e.target.value)}
                  placeholder="e.g. Masjidul Huda"
                />
              </FormField>

              <FormField label="District" htmlFor="district">
                <Input
                  id="district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Wayanad, Malappuram"
                />
              </FormField>

              <FormField label="Place / Town" htmlFor="place">
                <Input
                  id="place"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  placeholder="e.g. Kalpetta"
                />
              </FormField>

              <FormField label="Official Contact Phone" htmlFor="contactPhone">
                <Input
                  id="contactPhone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+919876543210"
                />
              </FormField>

              <FormField label="Official Contact Email" htmlFor="contactEmail">
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="contact@alhuda.org"
                />
              </FormField>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Provision Mahalle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
