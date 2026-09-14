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
  Heart,
  User,
  ShieldAlert,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Family } from "@/lib/business-resources";
import type { House } from "@/lib/houses";
import type { Member } from "@/lib/members";
import type { Division, FamilyStatus } from "@/lib/structure";

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

  const [activeTab, setActiveTab] = useState<"details" | "welfare">("details");

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

  // Family Status Division
  const [familyStatuses, setFamilyStatuses] = useState<FamilyStatus[]>([]);
  const [hasFamilyStatuses, setHasFamilyStatuses] = useState(false);
  const [familyStatusTerm, setFamilyStatusTerm] = useState("Category");
  const [familyStatusId, setFamilyStatusId] = useState("");
  const [category, setCategory] = useState("");

  // Form State
  const [wardId, setWardId] = useState("");
  const [municipalHouseNumber, setMunicipalHouseNumber] = useState("");
  const [mahallHouseNumber, setMahallHouseNumber] = useState("");
  const [houseName, setHouseName] = useState("");
  const [headMemberId, setHeadMemberId] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [requiresCommunitySupport, setRequiresCommunitySupport] = useState(false);
  const [supportCategory, setSupportCategory] = useState("");
  const [supportStatus, setSupportStatus] = useState<"ACTIVE" | "MONITORING" | "RESOLVED">("ACTIVE");
  const [supportNotes, setSupportNotes] = useState("");

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
      setActiveTab("details");
      apiClient
        .get<{
          structure: {
            hasDivisions: boolean;
            divisionTerm: string | null;
            houseNumberPrefix?: string | null;
            hasFamilyStatuses?: boolean;
            familyStatusTerm?: string | null;
          };
          divisions: Division[];
          familyStatuses?: FamilyStatus[];
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
          if (res?.structure) {
            setHasFamilyStatuses(res.structure.hasFamilyStatuses ?? false);
            if (res.structure.familyStatusTerm) {
              setFamilyStatusTerm(res.structure.familyStatusTerm);
            }
          }
          if (res?.familyStatuses) {
            setFamilyStatuses(res.familyStatuses);
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
      setEmergencyContactName(editingFamily.emergencyContactName ?? "");
      setEmergencyContactPhone(editingFamily.emergencyContactPhone ?? "");
      setRequiresCommunitySupport(Boolean(editingFamily.requiresCommunitySupport));
      setSupportCategory(editingFamily.supportCategory ?? "");
      setSupportStatus(editingFamily.supportStatus ?? "ACTIVE");
      setSupportNotes(editingFamily.supportNotes ?? "");
      setFamilyStatusId(editingFamily.familyStatusId ?? editingFamily.familyStatus?.id ?? "");
      setCategory(editingFamily.category ?? editingFamily.familyStatus?.name ?? "");
    } else {
      setWardId("");
      setMunicipalHouseNumber("");
      setMahallHouseNumber("");
      setHouseName("");
      setHeadMemberId("");
      setPhone("");
      setAddress("");
      setNotes("");
      setEmergencyContactName("");
      setEmergencyContactPhone("");
      setRequiresCommunitySupport(false);
      setSupportCategory("");
      setSupportStatus("ACTIVE");
      setSupportNotes("");
      setFamilyStatusId("");
      setCategory("");
    }
  }, [open, editingFamily, divisions, globalHousePrefix]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const cleanHouseName = houseName.trim();
    if (!cleanHouseName) {
      setError("House Name / Family Name is required.");
      setActiveTab("details");
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
        familyStatusId: hasFamilyStatuses && familyStatusId ? familyStatusId : null,
        category: hasFamilyStatuses && category ? category : null,
        notes: finalNotes,
        emergencyContactName: emergencyContactName.trim() || null,
        emergencyContactPhone: emergencyContactPhone.trim() || null,
        requiresCommunitySupport,
        supportCategory: requiresCommunitySupport ? supportCategory.trim() || null : null,
        supportStatus: requiresCommunitySupport ? supportStatus : null,
        supportNotes: requiresCommunitySupport ? supportNotes.trim() || null : null
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
        <DialogContent className="w-[95vw] max-w-2xl sm:w-[680px] h-[640px] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl shadow-xl">
          <DialogHeader className="p-5 pb-3 border-b border-border bg-muted/20 shrink-0">
            <DialogTitle className="text-xl font-bold">
              {editingFamily ? `Edit ${editingFamily.name}` : "Register New Family"}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Update household dwelling numbers, jurisdiction, contact points, and community welfare aid.
            </p>
          </DialogHeader>

          {/* Clean Step Navigation Tabs */}
          <div className="flex items-center border-b border-border bg-muted/30 px-5 text-xs font-semibold shrink-0 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`py-2.5 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === "details"
                  ? "border-primary text-primary font-bold bg-background/60 rounded-t-md"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Home className="h-3.5 w-3.5" />
              <span>1. House & Location</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("welfare")}
              className={`py-2.5 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === "welfare"
                  ? "border-rose-500 text-rose-600 font-bold bg-background/60 rounded-t-md"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Heart className="h-3.5 w-3.5 text-rose-500" />
              <span>2. Emergency & Welfare</span>
              {requiresCommunitySupport && (
                <span className="ml-1 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold">
                  Active
                </span>
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0" noValidate>
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium">
                  {error}
                </div>
              )}

              {/* TAB 1: HOUSE & BASIC DETAILS */}
              {activeTab === "details" && (
                <div className="space-y-4 animate-in fade-in-50 duration-150">
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
                          : "Official internal house code & number"
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
                      <FormField
                        label="House Name"
                        htmlFor="edit-house-name"
                        required
                      >
                        <Input
                          id="edit-house-name"
                          leadingIcon={<Home className="h-4 w-4 text-muted-foreground" />}
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
                      label="Head of Family (Applicant / Househead)"
                      htmlFor="family-head"
                      hint="Designates the primary head of family"
                    >
                      <Select
                        id="family-head"
                        value={headMemberId}
                        onChange={(e) => setHeadMemberId(e.target.value)}
                      >
                        <option value="">Select head of family</option>
                        {familyMembers.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.fullName} ({m.relationToHead ?? "Resident"})
                          </option>
                        ))}
                      </Select>
                    </FormField>
                  )}

                  {/* Family Status (if enabled in settings) */}
                  {hasFamilyStatuses && (
                    <FormField label={`Family ${familyStatusTerm}`} htmlFor="edit-family-status">
                      <Select
                        id="edit-family-status"
                        value={familyStatusId}
                        onChange={(e) => {
                          const selId = e.target.value;
                          setFamilyStatusId(selId);
                          const found = familyStatuses.find((s) => s.id === selId);
                          if (found) setCategory(found.name);
                          else setCategory("");
                        }}
                      >
                        <option value="">-- Select {familyStatusTerm} --</option>
                        {familyStatuses
                          .filter((s) => s.isActive || s.id === familyStatusId)
                          .map((st) => (
                            <option key={st.id} value={st.id}>
                              {st.name} {st.code ? `(${st.code})` : ""}
                            </option>
                          ))}
                      </Select>
                    </FormField>
                  )}

                  {/* Primary Contact Phone & Locality Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Primary Contact Phone" htmlFor="family-phone">
                      <Input
                        id="family-phone"
                        leadingIcon={<Phone className="h-4 w-4 text-muted-foreground" />}
                        placeholder="e.g. +91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </FormField>

                    <FormField label="Registered Locality / Road" htmlFor="family-address">
                      <Input
                        id="family-address"
                        leadingIcon={<MapPin className="h-4 w-4 text-muted-foreground" />}
                        placeholder="Street / Place / Locality"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </FormField>
                  </div>

                  {/* Notes */}
                  <FormField label="Administrative Notes" htmlFor="family-notes" hint="Optional internal annotations">
                    <Textarea
                      id="family-notes"
                      placeholder="Internal administration annotations..."
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </FormField>
                </div>
              )}

              {/* TAB 2: EMERGENCY & WELFARE */}
              {activeTab === "welfare" && (
                <div className="space-y-4 animate-in fade-in-50 duration-150">
                  {/* Emergency Contact Card */}
                  <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">
                        Household Emergency Contact
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Reliable contact person or relative in case of urgent domestic or medical emergencies.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <FormField label="Emergency Contact Person" htmlFor="family-emer-name">
                        <Input
                          id="family-emer-name"
                          placeholder="Contact person name"
                          value={emergencyContactName}
                          onChange={(e) => setEmergencyContactName(e.target.value)}
                        />
                      </FormField>
                      <FormField label="Emergency Phone" htmlFor="family-emer-phone">
                        <Input
                          id="family-emer-phone"
                          leadingIcon={<Phone className="h-4 w-4 text-muted-foreground" />}
                          placeholder="e.g. +91 98765 43210"
                          value={emergencyContactPhone}
                          onChange={(e) => setEmergencyContactPhone(e.target.value)}
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Mahallu Community Welfare & Support */}
                  <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-rose-600" />
                        <div>
                          <span className="text-sm font-semibold text-foreground block">
                            Mahallu Community Welfare Support
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Enrolls this household in the active community support registry.
                          </span>
                        </div>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-lg border border-rose-500/30 bg-background text-rose-700 dark:text-rose-300 hover:bg-rose-500/10 transition-colors">
                        <input
                          type="checkbox"
                          checked={requiresCommunitySupport}
                          onChange={(e) => setRequiresCommunitySupport(e.target.checked)}
                          className="rounded border-border text-rose-600 focus:ring-rose-500 h-4 w-4"
                        />
                        <span>Needs Support</span>
                      </label>
                    </div>

                    {requiresCommunitySupport && (
                      <div className="pt-3 space-y-3 border-t border-rose-500/15 animate-in fade-in-50 duration-150">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <FormField label="Welfare Category" htmlFor="support-category">
                            <Select
                              id="support-category"
                              value={supportCategory}
                              onChange={(e) => setSupportCategory(e.target.value)}
                            >
                              <option value="">Select Category</option>
                              <option value="Medical assistance">Medical assistance</option>
                              <option value="Medicine aid">Regular medicine aid</option>
                              <option value="Financial assistance">Financial assistance</option>
                              <option value="Home visit">Home visit / Elderly care</option>
                              <option value="Mobility assistance">Mobility assistance</option>
                              <option value="Counselling">Counselling / Guidance</option>
                              <option value="Education aid">Children education aid</option>
                              <option value="Other">Other welfare aid</option>
                            </Select>
                          </FormField>

                          <FormField label="Support Status" htmlFor="support-status">
                            <Select
                              id="support-status"
                              value={supportStatus}
                              onChange={(e) => setSupportStatus(e.target.value as "ACTIVE" | "MONITORING" | "RESOLVED")}
                            >
                              <option value="ACTIVE">Active Support</option>
                              <option value="MONITORING">Monitoring / Periodic</option>
                              <option value="RESOLVED">Resolved / Discontinued</option>
                            </Select>
                          </FormField>
                        </div>

                        <FormField label="Welfare Notes / Case Summary" htmlFor="support-notes">
                          <Textarea
                            id="support-notes"
                            rows={3}
                            placeholder="Details regarding family situation, required aid, or monthly allocation..."
                            value={supportNotes}
                            onChange={(e) => setSupportNotes(e.target.value)}
                          />
                        </FormField>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Docked Footer */}
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
                {activeTab === "details" ? (
                  <>
                    <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("welfare")}
                      className="gap-1.5"
                    >
                      <span>Emergency & Welfare →</span>
                    </Button>
                    <Button type="submit" size="sm" isLoading={isSubmitting}>
                      {editingFamily ? "Save Changes" : "Register"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("details")}
                    >
                      ← Back
                    </Button>
                    <Button type="submit" size="sm" isLoading={isSubmitting}>
                      {editingFamily ? "Save Changes" : "Register"}
                    </Button>
                  </>
                )}
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
