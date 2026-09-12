"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
  Select,
  Textarea,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import {
  BLOOD_GROUP_LABELS,
  MOVEMENT_STATUS_LABELS,
  RELATION_TO_HEAD_LABELS,
  type BloodGroup,
  type Gender,
  type MaritalStatus,
  type MovementStatus,
  type RelationToHead
} from "@/lib/member-constants";
import type { Member } from "@/lib/members";
import type { Family } from "@/lib/business-resources";

interface MemberFormValues {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  familyId: string;
  gender: Gender | "";
  dateOfBirth: string;
  maritalStatus: MaritalStatus | "";
  bloodGroup: BloodGroup | "";
  occupation: string;
  idNumber: string;
  relationToHead: RelationToHead | "";
  movementStatus: MovementStatus;
  movementDate: string;
  movementNotes: string;
  isYatheem: boolean;
  guardianName: string;
  guardianPhone: string;
  isExpatriate: boolean;
  expatriateCountry: string;
  expatriateOccupation: string;
  expatriateContact: string;
}

const EMPTY_FORM: MemberFormValues = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  familyId: "",
  gender: "",
  dateOfBirth: "",
  maritalStatus: "",
  bloodGroup: "",
  occupation: "",
  idNumber: "",
  relationToHead: "",
  movementStatus: "RESIDENT",
  movementDate: "",
  movementNotes: "",
  isYatheem: false,
  guardianName: "",
  guardianPhone: "",
  isExpatriate: false,
  expatriateCountry: "",
  expatriateOccupation: "",
  expatriateContact: ""
};

function toDateInputValue(iso: string | null): string {
  return iso ? iso.slice(0, 10) : "";
}

export function MemberFormDialog({
  slug,
  open,
  onOpenChange,
  editingMember,
  families
}: {
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingMember: Member | null;
  families: Family[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [values, setValues] = useState<MemberFormValues>(
    editingMember
      ? {
          fullName: editingMember.fullName,
          email: editingMember.email ?? "",
          phone: editingMember.phone ?? "",
          address: editingMember.address ?? "",
          familyId: editingMember.familyId ?? "",
          gender: editingMember.gender ?? "",
          dateOfBirth: toDateInputValue(editingMember.dateOfBirth),
          maritalStatus: editingMember.maritalStatus ?? "",
          bloodGroup: editingMember.bloodGroup ?? "",
          occupation: editingMember.occupation ?? "",
          idNumber: editingMember.idNumber ?? "",
          relationToHead: editingMember.relationToHead ?? "",
          movementStatus: editingMember.movementStatus,
          movementDate: toDateInputValue(editingMember.movementDate),
          movementNotes: editingMember.movementNotes ?? "",
          isYatheem: editingMember.isYatheem,
          guardianName: editingMember.guardianName ?? "",
          guardianPhone: editingMember.guardianPhone ?? "",
          isExpatriate: editingMember.isExpatriate,
          expatriateCountry: editingMember.expatriateCountry ?? "",
          expatriateOccupation: editingMember.expatriateOccupation ?? "",
          expatriateContact: editingMember.expatriateContact ?? ""
        }
      : EMPTY_FORM
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const payload = {
      fullName: values.fullName,
      email: values.email || undefined,
      phone: values.phone || undefined,
      address: values.address || undefined,
      familyId: values.familyId || undefined,
      gender: values.gender || undefined,
      dateOfBirth: values.dateOfBirth || undefined,
      maritalStatus: values.maritalStatus || undefined,
      bloodGroup: values.bloodGroup || undefined,
      occupation: values.occupation || undefined,
      idNumber: values.idNumber || undefined,
      relationToHead: values.relationToHead || undefined,
      movementStatus: values.movementStatus,
      movementDate: values.movementDate || undefined,
      movementNotes: values.movementNotes || undefined,
      isYatheem: values.isYatheem,
      guardianName: values.isYatheem ? values.guardianName || undefined : undefined,
      guardianPhone: values.isYatheem ? values.guardianPhone || undefined : undefined,
      isExpatriate: values.isExpatriate,
      expatriateCountry: values.isExpatriate ? values.expatriateCountry || undefined : undefined,
      expatriateOccupation: values.isExpatriate ? values.expatriateOccupation || undefined : undefined,
      expatriateContact: values.isExpatriate ? values.expatriateContact || undefined : undefined
    };
    try {
      if (editingMember) {
        await apiClient.patch(`/tenants/${slug}/members/${editingMember.id}`, payload);
        toast({ title: "Member updated", variant: "success" });
      } else {
        await apiClient.post(`/tenants/${slug}/members`, payload);
        toast({ title: "Member added", variant: "success" });
      }
      onOpenChange(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingMember ? "Edit member" : "Add a member"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="space-y-4">
            <FormField label="Full name" htmlFor="member-name" required error={error ?? undefined}>
              <Input
                id="member-name"
                required
                invalid={Boolean(error)}
                value={values.fullName}
                onChange={(e) => setValues((v) => ({ ...v, fullName: e.target.value }))}
              />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Email" htmlFor="member-email">
                <Input
                  id="member-email"
                  type="email"
                  value={values.email}
                  onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                />
              </FormField>
              <FormField label="Phone" htmlFor="member-phone">
                <Input id="member-phone" value={values.phone} onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))} />
              </FormField>
            </div>
            <FormField label="Address" htmlFor="member-address">
              <Textarea id="member-address" value={values.address} onChange={(e) => setValues((v) => ({ ...v, address: e.target.value }))} />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Family"
                htmlFor="member-family"
                hint={families.length === 0 ? "No families yet — add one from the Families page." : undefined}
              >
                <Select id="member-family" value={values.familyId} onChange={(e) => setValues((v) => ({ ...v, familyId: e.target.value }))}>
                  <option value="">No family</option>
                  {families.map((family) => (
                    <option key={family.id} value={family.id}>
                      {family.name}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Relation to head of family" htmlFor="member-relation">
                <Select
                  id="member-relation"
                  value={values.relationToHead}
                  onChange={(e) => setValues((v) => ({ ...v, relationToHead: e.target.value as RelationToHead | "" }))}
                >
                  <option value="">Not set</option>
                  {(Object.entries(RELATION_TO_HEAD_LABELS) as [RelationToHead, string][]).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>
          </div>

          <div className="space-y-4 border-t border-border pt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Personal details</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField label="Gender" htmlFor="member-gender">
                <Select id="member-gender" value={values.gender} onChange={(e) => setValues((v) => ({ ...v, gender: e.target.value as Gender | "" }))}>
                  <option value="">Not set</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </Select>
              </FormField>
              <FormField label="Date of birth" htmlFor="member-dob">
                <Input
                  id="member-dob"
                  type="date"
                  value={values.dateOfBirth}
                  onChange={(e) => setValues((v) => ({ ...v, dateOfBirth: e.target.value }))}
                />
              </FormField>
              <FormField label="Blood group" htmlFor="member-blood-group">
                <Select
                  id="member-blood-group"
                  value={values.bloodGroup}
                  onChange={(e) => setValues((v) => ({ ...v, bloodGroup: e.target.value as BloodGroup | "" }))}
                >
                  <option value="">Not set</option>
                  {(Object.entries(BLOOD_GROUP_LABELS) as [BloodGroup, string][]).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField label="Marital status" htmlFor="member-marital-status">
                <Select
                  id="member-marital-status"
                  value={values.maritalStatus}
                  onChange={(e) => setValues((v) => ({ ...v, maritalStatus: e.target.value as MaritalStatus | "" }))}
                >
                  <option value="">Not set</option>
                  <option value="SINGLE">Single</option>
                  <option value="MARRIED">Married</option>
                  <option value="WIDOWED">Widowed</option>
                  <option value="DIVORCED">Divorced</option>
                </Select>
              </FormField>
              <FormField label="Occupation" htmlFor="member-occupation">
                <Input
                  id="member-occupation"
                  value={values.occupation}
                  onChange={(e) => setValues((v) => ({ ...v, occupation: e.target.value }))}
                />
              </FormField>
              <FormField label="ID number" htmlFor="member-id-number" hint="Aadhaar, ration card, etc.">
                <Input
                  id="member-id-number"
                  value={values.idNumber}
                  onChange={(e) => setValues((v) => ({ ...v, idNumber: e.target.value }))}
                />
              </FormField>
            </div>
          </div>

          <div className="space-y-4 border-t border-border pt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Residency status</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Status" htmlFor="member-movement-status">
                <Select
                  id="member-movement-status"
                  value={values.movementStatus}
                  onChange={(e) => setValues((v) => ({ ...v, movementStatus: e.target.value as MovementStatus }))}
                >
                  {(Object.entries(MOVEMENT_STATUS_LABELS) as [MovementStatus, string][]).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </FormField>
              {values.movementStatus !== "RESIDENT" && (
                <FormField label="Since" htmlFor="member-movement-date">
                  <Input
                    id="member-movement-date"
                    type="date"
                    value={values.movementDate}
                    onChange={(e) => setValues((v) => ({ ...v, movementDate: e.target.value }))}
                  />
                </FormField>
              )}
            </div>
            {values.movementStatus !== "RESIDENT" && (
              <FormField label="Notes" htmlFor="member-movement-notes" hint="Optional — e.g. destination, cause">
                <Textarea
                  id="member-movement-notes"
                  value={values.movementNotes}
                  onChange={(e) => setValues((v) => ({ ...v, movementNotes: e.target.value }))}
                />
              </FormField>
            )}
          </div>

          <div className="space-y-3 border-t border-border pt-4">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Checkbox
                checked={values.isYatheem}
                onChange={(e) => setValues((v) => ({ ...v, isYatheem: e.target.checked }))}
              />
              Include in the Yatheem (orphan) register
            </label>
            {values.isYatheem && (
              <div className="grid gap-4 pl-6 sm:grid-cols-2">
                <FormField label="Guardian name" htmlFor="member-guardian-name">
                  <Input
                    id="member-guardian-name"
                    value={values.guardianName}
                    onChange={(e) => setValues((v) => ({ ...v, guardianName: e.target.value }))}
                  />
                </FormField>
                <FormField label="Guardian phone" htmlFor="member-guardian-phone">
                  <Input
                    id="member-guardian-phone"
                    value={values.guardianPhone}
                    onChange={(e) => setValues((v) => ({ ...v, guardianPhone: e.target.value }))}
                  />
                </FormField>
              </div>
            )}
          </div>

          <div className="space-y-3 border-t border-border pt-4">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Checkbox
                checked={values.isExpatriate}
                onChange={(e) => setValues((v) => ({ ...v, isExpatriate: e.target.checked }))}
              />
              Include in the Expatriate register
            </label>
            {values.isExpatriate && (
              <div className="grid gap-4 pl-6 sm:grid-cols-2">
                <FormField label="Country" htmlFor="member-expat-country">
                  <Input
                    id="member-expat-country"
                    value={values.expatriateCountry}
                    onChange={(e) => setValues((v) => ({ ...v, expatriateCountry: e.target.value }))}
                  />
                </FormField>
                <FormField label="Occupation abroad" htmlFor="member-expat-occupation">
                  <Input
                    id="member-expat-occupation"
                    value={values.expatriateOccupation}
                    onChange={(e) => setValues((v) => ({ ...v, expatriateOccupation: e.target.value }))}
                  />
                </FormField>
                <FormField label="Contact abroad" htmlFor="member-expat-contact" className="sm:col-span-2">
                  <Input
                    id="member-expat-contact"
                    value={values.expatriateContact}
                    onChange={(e) => setValues((v) => ({ ...v, expatriateContact: e.target.value }))}
                  />
                </FormField>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingMember ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
