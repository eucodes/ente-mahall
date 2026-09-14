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
  SearchableSelect,
  Textarea,
  useToast
} from "@mahalle/ui";
import { STATE_OPTIONS, getDistrictOptions } from "@/lib/location-data";
import { apiClient, ApiError } from "@/lib/api-client";
import type { PlatformTenant } from "@/lib/platform";

interface EditTenantDialogProps {
  tenant: PlatformTenant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTenantDialog({ tenant, open, onOpenChange }: EditTenantDialogProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState(tenant.name);
  const [description, setDescription] = useState(tenant.description ?? "");
  const [contactEmail, setContactEmail] = useState(tenant.contactEmail ?? "");
  const [contactPhone, setContactPhone] = useState(tenant.contactPhone ?? "");
  const [website, setWebsite] = useState(tenant.website ?? "");

  const [masjidName, setMasjidName] = useState(tenant.masjidName ?? "");
  const [masjidPhone, setMasjidPhone] = useState(tenant.masjidPhone ?? "");
  const [masjidAddress, setMasjidAddress] = useState(tenant.masjidAddress ?? "");
  const [imamName, setImamName] = useState(tenant.imamName ?? "");
  const [khatheebName, setKhatheebName] = useState(tenant.khatheebName ?? "");

  const [state, setState] = useState(tenant.state ?? "Kerala");
  const [district, setDistrict] = useState(tenant.district ?? "");
  const [place, setPlace] = useState(tenant.place ?? "");
  const [pinCode, setPinCode] = useState(tenant.pinCode ?? "");
  const [addressLine1, setAddressLine1] = useState(tenant.addressLine1 ?? "");

  const [presidentName, setPresidentName] = useState(tenant.presidentName ?? "");
  const [presidentPhone, setPresidentPhone] = useState(tenant.presidentPhone ?? "");
  const [secretaryName, setSecretaryName] = useState(tenant.secretaryName ?? "");
  const [secretaryPhone, setSecretaryPhone] = useState(tenant.secretaryPhone ?? "");
  const [treasurerName, setTreasurerName] = useState(tenant.treasurerName ?? "");
  const [treasurerPhone, setTreasurerPhone] = useState(tenant.treasurerPhone ?? "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Mahalle name cannot be empty");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await apiClient.patch(`/platform/tenants/${tenant.id}`, {
        name: name.trim(),
        description: description.trim() || null,
        contactEmail: contactEmail.trim() || null,
        contactPhone: contactPhone.trim() || null,
        website: website.trim() || null,
        masjidName: masjidName.trim() || null,
        masjidPhone: masjidPhone.trim() || null,
        masjidAddress: masjidAddress.trim() || null,
        imamName: imamName.trim() || null,
        khatheebName: khatheebName.trim() || null,
        state: state.trim() || null,
        district: district.trim() || null,
        place: place.trim() || null,
        pinCode: pinCode.trim() || null,
        addressLine1: addressLine1.trim() || null,
        presidentName: presidentName.trim() || null,
        presidentPhone: presidentPhone.trim() || null,
        secretaryName: secretaryName.trim() || null,
        secretaryPhone: secretaryPhone.trim() || null,
        treasurerName: treasurerName.trim() || null,
        treasurerPhone: treasurerPhone.trim() || null
      });

      toast({
        title: "Profile Updated",
        description: "Mahalle information updated successfully.",
        variant: "success"
      });

      onOpenChange(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update Mahalle profile");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:rounded-2xl border-border">
        <DialogHeader>
          <DialogTitle className="text-base">Edit Mahalle Profile &amp; Metadata</DialogTitle>
          <DialogDescription className="text-xs">
            Superadmin override for {tenant.name} ({tenant.slug})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              {error}
            </div>
          )}

          {/* Core Info */}
          <div className="space-y-3">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Basic Information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Mahalle Name" htmlFor="edit-name" required>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Slug (Immutable)" htmlFor="edit-slug">
                <Input id="edit-slug" value={tenant.slug} disabled className="bg-muted text-muted-foreground" />
              </FormField>
            </div>

            <FormField label="Description" htmlFor="edit-desc">
              <Textarea
                id="edit-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormField label="Contact Email" htmlFor="edit-email">
                <Input
                  id="edit-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </FormField>
              <FormField label="Contact Phone" htmlFor="edit-phone">
                <Input
                  id="edit-phone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </FormField>
              <FormField label="Website" htmlFor="edit-website">
                <Input
                  id="edit-website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </FormField>
            </div>
          </div>

          {/* Central Masjid */}
          <div className="border-t border-border/60 pt-3 space-y-3">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Central Masjid &amp; Religious Staff
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Masjid Name" htmlFor="edit-masjid">
                <Input
                  id="edit-masjid"
                  value={masjidName}
                  onChange={(e) => setMasjidName(e.target.value)}
                />
              </FormField>
              <FormField label="Masjid Phone" htmlFor="edit-masjid-phone">
                <Input
                  id="edit-masjid-phone"
                  value={masjidPhone}
                  onChange={(e) => setMasjidPhone(e.target.value)}
                />
              </FormField>
              <FormField label="Imam Name" htmlFor="edit-imam">
                <Input
                  id="edit-imam"
                  value={imamName}
                  onChange={(e) => setImamName(e.target.value)}
                />
              </FormField>
              <FormField label="Khatheeb Name" htmlFor="edit-khatheeb">
                <Input
                  id="edit-khatheeb"
                  value={khatheebName}
                  onChange={(e) => setKhatheebName(e.target.value)}
                />
              </FormField>
            </div>
            <FormField label="Masjid Address" htmlFor="edit-masjid-addr">
              <Input
                id="edit-masjid-addr"
                value={masjidAddress}
                onChange={(e) => setMasjidAddress(e.target.value)}
              />
            </FormField>
          </div>

          {/* Location */}
          <div className="border-t border-border/60 pt-3 space-y-3">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Jurisdiction &amp; Location
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormField label="State" htmlFor="edit-state">
                <SearchableSelect
                  id="edit-state"
                  placeholder="Select State"
                  searchPlaceholder="Search state..."
                  value={state}
                  onChange={(val) => setState(val)}
                  options={STATE_OPTIONS}
                  allowCustom
                />
              </FormField>
              <FormField label="District" htmlFor="edit-district">
                <SearchableSelect
                  id="edit-district"
                  placeholder="Select District"
                  searchPlaceholder="Search district..."
                  value={district}
                  onChange={(val) => setDistrict(val)}
                  options={getDistrictOptions(state)}
                  allowCustom
                />
              </FormField>
              <FormField label="Place / Town" htmlFor="edit-place">
                <Input
                  id="edit-place"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                />
              </FormField>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Address Line" htmlFor="edit-addr1">
                <Input
                  id="edit-addr1"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                />
              </FormField>
              <FormField label="PIN / Postal Code" htmlFor="edit-pin">
                <Input
                  id="edit-pin"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                />
              </FormField>
            </div>
          </div>

          {/* Primary Committee */}
          <div className="border-t border-border/60 pt-3 space-y-3">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Primary Committee Office Bearers
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="President Name" htmlFor="edit-pres-name">
                <Input
                  id="edit-pres-name"
                  value={presidentName}
                  onChange={(e) => setPresidentName(e.target.value)}
                />
              </FormField>
              <FormField label="President Phone" htmlFor="edit-pres-phone">
                <Input
                  id="edit-pres-phone"
                  value={presidentPhone}
                  onChange={(e) => setPresidentPhone(e.target.value)}
                />
              </FormField>
              <FormField label="Secretary Name" htmlFor="edit-sec-name">
                <Input
                  id="edit-sec-name"
                  value={secretaryName}
                  onChange={(e) => setSecretaryName(e.target.value)}
                />
              </FormField>
              <FormField label="Secretary Phone" htmlFor="edit-sec-phone">
                <Input
                  id="edit-sec-phone"
                  value={secretaryPhone}
                  onChange={(e) => setSecretaryPhone(e.target.value)}
                />
              </FormField>
              <FormField label="Treasurer Name" htmlFor="edit-tres-name">
                <Input
                  id="edit-tres-name"
                  value={treasurerName}
                  onChange={(e) => setTreasurerName(e.target.value)}
                />
              </FormField>
              <FormField label="Treasurer Phone" htmlFor="edit-tres-phone">
                <Input
                  id="edit-tres-phone"
                  value={treasurerPhone}
                  onChange={(e) => setTreasurerPhone(e.target.value)}
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
              Save Profile Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
