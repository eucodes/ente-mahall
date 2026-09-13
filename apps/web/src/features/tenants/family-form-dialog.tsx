"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  ConfirmDialog,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
  Select,
  Textarea,
  Home,
  MapPin,
  Phone,
  Trash,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Family } from "@/lib/business-resources";
import type { House } from "@/lib/houses";
import type { Member } from "@/lib/members";

interface Division {
  id: string;
  name: string;
  code: string | null;
}

export function FamilyFormDialog({
  slug,
  open,
  onOpenChange,
  editingFamily,
  houses = [],
  members = []
}: {
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingFamily: Family | null;
  houses?: House[];
  members?: Member[];
}) {
  const router = useRouter();
  const { toast } = useToast();

  // Find members belonging to this family
  const familyMembers = editingFamily
    ? members.filter((m) => m.familyId === editingFamily.id)
    : [];

  const currentHead = familyMembers.find((m) => m.relationToHead === "HEAD");

  // Divisions / Structure configuration
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [hasDivisions, setHasDivisions] = useState(false);
  const [divisionTerm, setDivisionTerm] = useState("Ward / Division");
  const [globalHousePrefix, setGlobalHousePrefix] = useState("");

  // Form State
  const [wardId, setWardId] = useState("");
  const [municipalHouseNumber, setMunicipalHouseNumber] = useState("");
  const [mahallHouseNumber, setMahallHouseNumber] = useState("");
  const [houseName, setHouseName] = useState("");
  const [headMemberId, setHeadMemberId] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Active division and house number prefix code
  const selectedDivision = divisions.find((d) => d.id === wardId);
  const activeHouseCode = (selectedDivision?.code || (!hasDivisions || !selectedDivision ? globalHousePrefix : "") || "").trim();

  // Fetch tenant structure when dialog opens
  useEffect(() => {
    if (open) {
      apiClient
        .get<{
          structure: {
            hasDivisions: boolean;
            divisionTerm: string | null;
            houseNumberPrefix?: string | null;
          };
          divisions: Division[];
        }>(`/tenants/${slug}/structure`)
        .then((res) => {
          if (res?.divisions) {
            setDivisions(res.divisions);
            setHasDivisions(res.structure?.hasDivisions ?? false);
            if (res.structure?.divisionTerm) {
              setDivisionTerm(res.structure.divisionTerm);
            }
            if (res.structure?.houseNumberPrefix) {
              setGlobalHousePrefix(res.structure.houseNumberPrefix);
            }
          }
        })
        .catch(() => {
          // ignore if structure endpoint is unavailable
        });
    }
  }, [open, slug]);

  // Populate form fields on open / family change
  useEffect(() => {
    if (!open) return;
    setError(null);

    if (editingFamily) {
      const head = familyMembers.find((m) => m.relationToHead === "HEAD");
      setHeadMemberId(head?.id ?? "");
      setPhone(editingFamily.phone ?? "");

      // 1. Division: from family.house?.divisionId or notes
      let detectedWardId = editingFamily.house?.divisionId ?? "";
      if (!detectedWardId && editingFamily.notes) {
        const wardMatch = editingFamily.notes.match(/Ward:\s*([^|]+)/i);
        if (wardMatch) {
          const wName = wardMatch[1].trim().toLowerCase();
          const found = divisions.find(
            (d) => d.name.toLowerCase() === wName || d.code?.toLowerCase() === wName
          );
          if (found) detectedWardId = found.id;
        }
      }
      setWardId(detectedWardId);

      // Selected division code for prefix trimming
      const divObj = divisions.find((d) => d.id === detectedWardId);
      const codeForTrim = (divObj?.code || globalHousePrefix || "").trim();

      // 2. Mahall House Number
      let detectedMahall = "";
      if (editingFamily.notes) {
        const mMatch = editingFamily.notes.match(/Mahall House:\s*([^|]+)/i);
        if (mMatch) detectedMahall = mMatch[1].trim();
      }
      if (!detectedMahall && editingFamily.address) {
        const mMatch = editingFamily.address.match(/Mahall House No:\s*([^,]+)/i);
        if (mMatch) detectedMahall = mMatch[1].trim();
      }
      if (!detectedMahall && editingFamily.house?.displayNumber) {
        detectedMahall = editingFamily.house.displayNumber.trim();
      }
      if (codeForTrim && detectedMahall.toUpperCase().startsWith(codeForTrim.toUpperCase())) {
        detectedMahall = detectedMahall.slice(codeForTrim.length).trim();
      }
      setMahallHouseNumber(detectedMahall);

      // 3. Municipal House Number
      let detectedMunicipal = "";
      if (editingFamily.notes) {
        const muniMatch = editingFamily.notes.match(/Municipal House:\s*([^|]+)/i);
        if (muniMatch) detectedMunicipal = muniMatch[1].trim();
      }
      if (!detectedMunicipal && editingFamily.address) {
        const muniMatch = editingFamily.address.match(/Municipal Door No:\s*([^,]+)/i);
        if (muniMatch) detectedMunicipal = muniMatch[1].trim();
      }
      setMunicipalHouseNumber(detectedMunicipal);

      // 4. House Name
      let detectedHouseName = "";
      if (editingFamily.address) {
        const hMatch = editingFamily.address.match(/House:\s*([^,]+)/i);
        if (hMatch) detectedHouseName = hMatch[1].trim();
      }
      if (!detectedHouseName && editingFamily.name) {
        detectedHouseName = editingFamily.name.replace(/\s+Family$/i, "").trim();
      }
      setHouseName(detectedHouseName);

      // 5. Clean Address
      let cleanAddress = editingFamily.address ?? "";
      if (cleanAddress) {
        const parts = cleanAddress
          .split(",")
          .map((p) => p.trim())
          .filter((p) => {
            if (p.startsWith("House:")) return false;
            if (p.startsWith("Mahall House No:")) return false;
            if (p.startsWith("Municipal Door No:")) return false;
            return true;
          });
        cleanAddress = parts.join(", ");
      }
      setAddress(cleanAddress);

      // 6. Clean Notes
      let cleanNotes = editingFamily.notes ?? "";
      if (cleanNotes) {
        const parts = cleanNotes
          .split("|")
          .map((p) => p.trim())
          .filter((p) => {
            if (p.startsWith("Ward:")) return false;
            if (p.startsWith("Mahall House:")) return false;
            if (p.startsWith("Municipal House:")) return false;
            return true;
          });
        cleanNotes = parts.join(" | ");
      }
      setNotes(cleanNotes);
    } else {
      setWardId("");
      setMunicipalHouseNumber("");
      setMahallHouseNumber("");
      setHouseName("");
      setHeadMemberId("");
      setPhone("");
      setAddress("");
      setNotes("");
    }
  }, [open, editingFamily, divisions, globalHousePrefix]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const cleanHouseName = houseName.trim();
    if (!cleanHouseName) {
      setError("House Name / Family Name is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Build Family Display Name
      const familyDisplayName = cleanHouseName.toLowerCase().endsWith("family")
        ? cleanHouseName
        : `${cleanHouseName} Family`;

      // 2. Format Mahall and Municipal House Numbers
      const currentHouseCode = activeHouseCode.trim();
      const rawMahallNum = mahallHouseNumber.trim();
      const finalMahallHouseNumber = rawMahallNum
        ? currentHouseCode && !rawMahallNum.toUpperCase().startsWith(currentHouseCode.toUpperCase())
          ? `${currentHouseCode}${rawMahallNum}`
          : rawMahallNum
        : "";

      const finalMunicipalHouseNumber = municipalHouseNumber.trim();

      // 3. Build Full Address
      const addressParts = [
        cleanHouseName ? `House: ${cleanHouseName}` : null,
        finalMahallHouseNumber ? `Mahall House No: ${finalMahallHouseNumber}` : null,
        finalMunicipalHouseNumber ? `Municipal Door No: ${finalMunicipalHouseNumber}` : null,
        address.trim() || null
      ].filter(Boolean);

      const fullAddress = addressParts.join(", ");

      // 4. Build Structured Notes
      const notesParts: string[] = [];
      if (selectedDivision) notesParts.push(`Ward: ${selectedDivision.name}`);
      if (finalMahallHouseNumber) notesParts.push(`Mahall House: ${finalMahallHouseNumber}`);
      if (finalMunicipalHouseNumber) notesParts.push(`Municipal House: ${finalMunicipalHouseNumber}`);
      if (notes.trim()) notesParts.push(notes.trim());
      const finalNotes = notesParts.length > 0 ? notesParts.join(" | ") : null;

      // 5. Resolve dwelling / house link
      let resolvedHouseId = editingFamily?.houseId ?? null;
      const numToUse = finalMahallHouseNumber || finalMunicipalHouseNumber || `${cleanHouseName} House`;

      if (resolvedHouseId) {
        try {
          await apiClient.patch(`/tenants/${slug}/houses/${resolvedHouseId}`, {
            displayNumber: numToUse || undefined,
            name: cleanHouseName || undefined,
            divisionId: wardId || undefined,
            address: fullAddress || undefined
          });
        } catch {
          // non-fatal if house patch fails
        }
      } else if (numToUse) {
        const existing = houses.find((h) => h.displayNumber.toLowerCase() === numToUse.toLowerCase());
        if (existing) {
          resolvedHouseId = existing.id;
        } else {
          try {
            const houseRes = await apiClient.post<{ house: { id: string } }>(
              `/tenants/${slug}/houses`,
              {
                displayNumber: numToUse,
                name: cleanHouseName || undefined,
                divisionId: wardId || undefined,
                address: fullAddress || undefined
              }
            );
            resolvedHouseId = houseRes?.house?.id ?? null;
          } catch {
            // non-fatal
          }
        }
      }

      const payload = {
        name: familyDisplayName,
        address: fullAddress || null,
        phone: phone.trim() || null,
        houseId: resolvedHouseId,
        notes: finalNotes
      };

      if (editingFamily) {
        await apiClient.patch(`/tenants/${slug}/families/${editingFamily.id}`, payload);

        // If head member was changed
        if (headMemberId && headMemberId !== currentHead?.id) {
          await apiClient.patch(`/tenants/${slug}/members/${headMemberId}`, {
            relationToHead: "HEAD"
          });

          if (currentHead && currentHead.id !== headMemberId) {
            await apiClient.patch(`/tenants/${slug}/members/${currentHead.id}`, {
              relationToHead: "OTHER"
            });
          }
        }

        toast({ title: "Family updated", variant: "success" });
      } else {
        await apiClient.post(`/tenants/${slug}/families`, payload);
        toast({ title: "Family registered", variant: "success" });
      }

      onOpenChange(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!editingFamily) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/tenants/${slug}/families/${editingFamily.id}`);
      toast({ title: `Removed ${editingFamily.name}`, variant: "success" });
      setDeleteConfirmOpen(false);
      onOpenChange(false);
      router.push(`/${slug}/families`);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to delete family.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-xl sm:w-[600px] h-[640px] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl">
          <DialogHeader className="p-5 pb-3 border-b border-border bg-muted/20 shrink-0">
            <DialogTitle>{editingFamily ? "Edit Family Details" : "Register Family"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0" noValidate>
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium">
                  {error}
                </div>
              )}

            {/* Division / Ward Selector (if enabled) */}
            {hasDivisions && (
              <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 flex flex-col gap-2">
                <FormField
                  label={`Select ${divisionTerm}`}
                  htmlFor="edit-ward-select"
                  hint={`Household's ${divisionTerm.toLowerCase()} jurisdiction`}
                >
                  <Select
                    id="edit-ward-select"
                    value={wardId}
                    onChange={(e) => setWardId(e.target.value)}
                    className="bg-background font-medium"
                  >
                    <option value="">-- Choose {divisionTerm} / Area --</option>
                    {divisions.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} {d.code ? `(${d.code})` : ""}
                      </option>
                    ))}
                  </Select>
                </FormField>
              </div>
            )}

            {/* House Numbers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Municipal House Number"
                htmlFor="edit-municipal-house-number"
                hint="Local body / Panchayat / Municipality door number"
              >
                <Input
                  id="edit-municipal-house-number"
                  placeholder="e.g. 12/450-A"
                  value={municipalHouseNumber}
                  onChange={(e) => setMunicipalHouseNumber(e.target.value)}
                />
              </FormField>

              <FormField
                label="Mahall House Number"
                htmlFor="edit-mahall-house-number"
                hint={
                  activeHouseCode
                    ? `Prefixed by ${selectedDivision ? `${selectedDivision.name} code (${activeHouseCode})` : `code (${activeHouseCode})`}`
                    : "Official Mahall internal house code & number"
                }
              >
                <div className="flex rounded-md border border-input bg-background shadow-xs overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:border-ring">
                  {activeHouseCode ? (
                    <div className="bg-muted px-3 py-2 text-xs font-mono font-bold text-foreground border-r border-border flex items-center select-none flex-shrink-0">
                      {activeHouseCode}
                    </div>
                  ) : null}
                  <input
                    id="edit-mahall-house-number"
                    className="flex-1 px-3 py-2 text-sm bg-transparent outline-none placeholder:text-muted-foreground min-w-0"
                    placeholder={activeHouseCode ? "01" : "e.g. MH-01"}
                    value={mahallHouseNumber}
                    onChange={(e) => setMahallHouseNumber(e.target.value)}
                  />
                </div>
              </FormField>

              <div className="sm:col-span-2">
                <FormField label="House Name" htmlFor="edit-house-name" hint="Dwelling / Villa / Residence Name" required>
                  <Input
                    id="edit-house-name"
                    leadingIcon={<Home />}
                    placeholder="e.g. Baitul Noor, Al Baraka"
                    required
                    value={houseName}
                    onChange={(e) => setHouseName(e.target.value)}
                  />
                </FormField>
              </div>
            </div>

            {/* Head of Family (if editing family with members) */}
            {familyMembers.length > 0 && (
              <FormField
                label="Head of Family (Applicant)"
                htmlFor="family-head"
                hint="Designates the primary head of household"
              >
                <Select
                  id="family-head"
                  value={headMemberId}
                  onChange={(e) => setHeadMemberId(e.target.value)}
                >
                  <option value="">Select head of household</option>
                  {familyMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.relationToHead ?? "Resident"})
                    </option>
                  ))}
                </Select>
              </FormField>
            )}

            {/* Primary Contact Phone */}
            <FormField label="Primary Contact Phone" htmlFor="family-phone">
              <Input
                id="family-phone"
                leadingIcon={<Phone />}
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </FormField>

            {/* Address */}
            <FormField label="Registered Address / Locality" htmlFor="family-address">
              <Input
                id="family-address"
                leadingIcon={<MapPin />}
                placeholder="Street / Place / Locality"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </FormField>

            {/* Notes */}
            <FormField label="Administrative Notes" htmlFor="family-notes" hint="Optional">
              <Textarea
                id="family-notes"
                placeholder="Internal notes or welfare annotations..."
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </FormField>
            </div>

            <DialogFooter className="p-4 px-6 border-t border-border bg-muted/20 flex items-center justify-between gap-2 shrink-0 sm:justify-between">
              {editingFamily ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="text-destructive hover:bg-destructive/10 hover:border-destructive/30 gap-1.5"
                >
                  <Trash className="h-4 w-4" />
                  <span>Delete Family</span>
                </Button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" isLoading={isSubmitting}>
                  {editingFamily ? "Save Changes" : "Register"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={`Delete ${editingFamily?.name ?? "this family"}?`}
        description="This removes the family unit record. Member records will be unlinked from this family. This action cannot be undone."
        confirmLabel="Delete Family"
        destructive
        isConfirming={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
