"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Checkbox,
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
  User,
  Phone,
  Mail,
  MapPin,
  IdCard,
  HeartHandshake,
  Plane,
  Trash,
  School,
  Building,
  Plus,
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
  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  bloodGroup: string;
  occupation: string;
  idNumber: string;
  relationToHead: string;
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
  if (!iso) return "";
  return iso.slice(0, 10);
}

function getMemberValues(member: Member): MemberFormValues {
  return {
    fullName: member.fullName,
    email: member.email ?? "",
    phone: member.phone ?? "",
    address: member.address ?? "",
    familyId: member.familyId ?? "",
    gender: member.gender ?? "",
    dateOfBirth: toDateInputValue(member.dateOfBirth),
    maritalStatus: member.maritalStatus ?? "",
    bloodGroup: member.bloodGroup ?? "",
    occupation: member.occupation ?? "",
    idNumber: member.idNumber ?? "",
    relationToHead: member.relationToHead ?? "",
    movementStatus: member.movementStatus,
    movementDate: toDateInputValue(member.movementDate),
    movementNotes: member.movementNotes ?? "",
    isYatheem: member.isYatheem,
    guardianName: member.guardianName ?? "",
    guardianPhone: member.guardianPhone ?? "",
    isExpatriate: member.isExpatriate,
    expatriateCountry: member.expatriateCountry ?? "",
    expatriateOccupation: member.expatriateOccupation ?? "",
    expatriateContact: member.expatriateContact ?? ""
  };
}

interface PreviousEducationItem {
  id: string;
  educationType: string;
  year: string;
}

interface QualificationItem {
  id: string;
  degree: string;
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
  const [values, setValues] = useState<MemberFormValues>(() =>
    editingMember ? getMemberValues(editingMember) : EMPTY_FORM
  );

  // Student vs Adult profile classification
  const [profileCategory, setProfileCategory] = useState<"ADULT" | "STUDENT">("ADULT");
  const [currentInstitution, setCurrentInstitution] = useState("");
  const [previousEducations, setPreviousEducations] = useState<PreviousEducationItem[]>([]);
  const [newEduType, setNewEduType] = useState("");
  const [newEduYear, setNewEduYear] = useState("");
  const [occupation, setOccupation] = useState("");
  const [qualificationsList, setQualificationsList] = useState<QualificationItem[]>([]);
  const [newQualInput, setNewQualInput] = useState("");

  // Detailed Address States
  const [useFamilyAddress, setUseFamilyAddress] = useState(false);
  const [houseName, setHouseName] = useState("");
  const [place, setPlace] = useState("");
  const [post, setPost] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("Kerala");
  const [pin, setPin] = useState("");
  const [localBodyType, setLocalBodyType] = useState("Grama Panchayath");
  const [localBodyName, setLocalBodyName] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const addQualification = () => {
    const trimmed = newQualInput.trim();
    if (!trimmed) return;
    setQualificationsList((prev) => [...prev, { id: String(Date.now()), degree: trimmed }]);
    setNewQualInput("");
  };

  const removeQualification = (id: string) => {
    setQualificationsList((prev) => prev.filter((q) => q.id !== id));
  };

  const addPreviousEducation = () => {
    const trimmedType = newEduType.trim();
    if (!trimmedType) return;
    setPreviousEducations((prev) => [
      ...prev,
      { id: String(Date.now()), educationType: trimmedType, year: newEduYear.trim() }
    ]);
    setNewEduType("");
    setNewEduYear("");
  };

  const removePreviousEducation = (id: string) => {
    setPreviousEducations((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    if (open) {
      setError(null);
      if (editingMember) {
        const mv = getMemberValues(editingMember);
        setValues(mv);

        // Check if student
        const isStudent =
          mv.occupation.toLowerCase().includes("student") ||
          mv.movementNotes.toLowerCase().includes("[student]");

        if (isStudent) {
          setProfileCategory("STUDENT");
          let inst = "";
          const prevItems: PreviousEducationItem[] = [];

          if (mv.occupation.includes("•")) {
            const parts = mv.occupation.split("•")[1]?.trim() ?? "";
            if (parts.includes("(Prev:")) {
              const [i, prevStr] = parts.split("(Prev:");
              inst = i.trim();
              const rawPrev = prevStr.replace(/\)$/, "").trim();
              const splitted = rawPrev.split(",");
              for (const item of splitted) {
                const trimmed = item.trim();
                if (!trimmed) continue;
                const match = trimmed.match(/^(.+?)\s*[\(\[](\d{4})[\)\]]$/);
                if (match) {
                  prevItems.push({
                    id: String(Math.random()),
                    educationType: match[1]?.trim() ?? trimmed,
                    year: match[2]?.trim() ?? ""
                  });
                } else {
                  prevItems.push({
                    id: String(Math.random()),
                    educationType: trimmed,
                    year: ""
                  });
                }
              }
            } else {
              inst = parts;
            }
          } else {
            inst = mv.occupation.replace(/student:?/i, "").trim();
          }

          setCurrentInstitution(inst);
          setPreviousEducations(prevItems);
          setNewEduType("");
          setNewEduYear("");
          setOccupation("");
          setQualificationsList([]);
        } else {
          setProfileCategory("ADULT");
          setCurrentInstitution("");
          setPreviousEducations([]);
          setNewEduType("");
          setNewEduYear("");

          if (mv.occupation.includes("• Qualifications:")) {
            const [occ, qualStr] = mv.occupation.split("• Qualifications:");
            setOccupation(occ.trim());
            const parsedQuals = qualStr.split(",").map((q) => q.trim()).filter(Boolean);
            setQualificationsList(parsedQuals.map((degree) => ({ id: String(Math.random()), degree })));
          } else {
            setOccupation(mv.occupation);
            setQualificationsList([]);
          }
        }

        // Check if address matches family address
        const linkedFamily = families.find((f) => f.id === mv.familyId);
        if (linkedFamily?.address && mv.address && mv.address === linkedFamily.address) {
          setUseFamilyAddress(true);
        } else {
          setUseFamilyAddress(false);
          setPlace(mv.address);
        }
      } else {
        setValues(EMPTY_FORM);
        setProfileCategory("ADULT");
        setOccupation("");
        setCurrentInstitution("");
        setPreviousEducations([]);
        setNewEduType("");
        setNewEduYear("");
        setQualificationsList([]);
        setNewQualInput("");
        setUseFamilyAddress(false);
        setHouseName("");
        setPlace("");
        setPost("");
        setDistrict("");
        setState("Kerala");
        setPin("");
        setLocalBodyName("");
      }
    }
  }, [open, editingMember, families]);

  // Handle "Use Family Address" checkbox change
  const handleToggleFamilyAddress = (checked: boolean) => {
    setUseFamilyAddress(checked);
    if (checked) {
      if (!values.familyId) {
        toast({
          title: "Select family first",
          description: "Assign a linked family to pull its registered address."
        });
        return;
      }
      const fam = families.find((f) => f.id === values.familyId);
      if (fam?.address) {
        toast({ title: "Family address applied", description: fam.address });
      }
    }
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!values.fullName.trim()) {
      setError("Member full name is required.");
      return;
    }

    setIsSubmitting(true);
    const isEdit = Boolean(editingMember);

    // 1. Calculate final formatted occupation & notes
    let finalOccupation: string | null = null;
    let notePrefix = "";

    if (profileCategory === "STUDENT") {
      const inst = currentInstitution.trim();
      const prevStr = previousEducations
        .map((p) => (p.year ? `${p.educationType} (${p.year})` : p.educationType))
        .join(", ");

      if (inst && prevStr) {
        finalOccupation = `Student • ${inst} (Prev: ${prevStr})`;
      } else if (inst) {
        finalOccupation = `Student • ${inst}`;
      } else if (prevStr) {
        finalOccupation = `Student (Prev: ${prevStr})`;
      } else {
        finalOccupation = "Student";
      }
      notePrefix = `[Student Institution: ${inst || "General"} | Prev: ${prevStr || "None"}]`;
    } else {
      const qualStr = qualificationsList.map((q) => q.degree).join(", ");
      finalOccupation = qualStr
        ? `${occupation.trim()}${occupation.trim() ? " • " : ""}Qualifications: ${qualStr}`
        : occupation.trim() || null;
      if (qualStr) {
        notePrefix = `[Qualifications: ${qualStr}]`;
      }
    }

    // 2. Calculate final address
    let finalAddress: string | null = null;
    if (useFamilyAddress && values.familyId) {
      const fam = families.find((f) => f.id === values.familyId);
      finalAddress = fam?.address || null;
    } else {
      const addrParts: string[] = [];
      if (houseName.trim()) addrParts.push(houseName.trim());
      if (place.trim()) addrParts.push(place.trim());
      if (post.trim()) addrParts.push(`${post.trim()} PO`);
      if (district.trim()) addrParts.push(district.trim());
      if (state.trim()) addrParts.push(state.trim());
      if (pin.trim()) addrParts.push(`PIN: ${pin.trim()}`);
      if (localBodyName.trim()) addrParts.push(`(${localBodyType}: ${localBodyName.trim()})`);

      finalAddress = addrParts.length > 0 ? addrParts.join(", ") : values.address.trim() || null;
    }

    const compiledNotes = [notePrefix, values.movementNotes.trim()].filter(Boolean).join(" | ");

    const payload = {
      fullName: values.fullName.trim(),
      email: values.email.trim() ? values.email.trim() : isEdit ? null : undefined,
      phone: values.phone.trim() ? values.phone.trim() : isEdit ? null : undefined,
      address: finalAddress ? finalAddress : isEdit ? null : undefined,
      familyId: values.familyId ? values.familyId : isEdit ? null : undefined,
      gender: values.gender ? values.gender : isEdit ? null : undefined,
      dateOfBirth: values.dateOfBirth ? values.dateOfBirth : isEdit ? null : undefined,
      maritalStatus: values.maritalStatus ? values.maritalStatus : isEdit ? null : undefined,
      bloodGroup: values.bloodGroup ? values.bloodGroup : isEdit ? null : undefined,
      occupation: finalOccupation ? finalOccupation : isEdit ? null : undefined,
      idNumber: values.idNumber.trim() ? values.idNumber.trim() : isEdit ? null : undefined,
      relationToHead: values.relationToHead ? values.relationToHead : isEdit ? null : undefined,
      movementStatus: values.movementStatus,
      movementDate: values.movementDate ? values.movementDate : isEdit ? null : undefined,
      movementNotes: compiledNotes ? compiledNotes : isEdit ? null : undefined,
      isYatheem: values.isYatheem,
      guardianName: values.isYatheem ? values.guardianName.trim() || null : isEdit ? null : undefined,
      guardianPhone: values.isYatheem ? values.guardianPhone.trim() || null : isEdit ? null : undefined,
      isExpatriate: values.isExpatriate,
      expatriateCountry: values.isExpatriate ? values.expatriateCountry.trim() || null : isEdit ? null : undefined,
      expatriateOccupation: values.isExpatriate ? values.expatriateOccupation.trim() || null : isEdit ? null : undefined,
      expatriateContact: values.isExpatriate ? values.expatriateContact.trim() || null : isEdit ? null : undefined
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

  async function handleDelete() {
    if (!editingMember) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/tenants/${slug}/members/${editingMember.id}`);
      toast({ title: `Removed ${editingMember.fullName}`, variant: "success" });
      setDeleteConfirmOpen(false);
      onOpenChange(false);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to delete member.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  }

  const selectedFamily = families.find((f) => f.id === values.familyId);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-2xl sm:w-[720px] h-[680px] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl">
          <DialogHeader className="p-5 pb-3 border-b border-border bg-muted/20 shrink-0">
            <DialogTitle>{editingMember ? "Edit Member Profile" : "Add New Member"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0" noValidate>
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium">
                  {error}
                </div>
              )}

            {/* Section 1: Basic Identity & Household */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Personal Identity
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <FormField label="Full Name" htmlFor="member-name" required>
                    <Input
                      id="member-name"
                      leadingIcon={<User />}
                      placeholder="e.g. Muhammed Basheer"
                      required
                      value={values.fullName}
                      onChange={(e) => setValues((v) => ({ ...v, fullName: e.target.value }))}
                    />
                  </FormField>
                </div>

                <FormField label="Linked Family / Household" htmlFor="member-family">
                  <Select
                    id="member-family"
                    value={values.familyId}
                    onChange={(e) => {
                      const newFamId = e.target.value;
                      setValues((v) => ({ ...v, familyId: newFamId }));
                      if (useFamilyAddress && newFamId) {
                        const fam = families.find((f) => f.id === newFamId);
                        if (fam?.address) {
                          toast({ title: "Family address applied", description: fam.address });
                        }
                      }
                    }}
                  >
                    <option value="">No family assigned</option>
                    {families.map((family) => (
                      <option key={family.id} value={family.id}>
                        {family.name}
                        {family.house ? ` (House ${family.house.displayNumber})` : ""}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Relation to Head of Family" htmlFor="member-relation">
                  <Select
                    id="member-relation"
                    value={values.relationToHead}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, relationToHead: e.target.value as RelationToHead | "" }))
                    }
                  >
                    <option value="">Select relation</option>
                    {(Object.entries(RELATION_TO_HEAD_LABELS) as [RelationToHead, string][]).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      )
                    )}
                  </Select>
                </FormField>
              </div>
            </div>

            {/* Section 2: Student vs Adult Education & Occupation */}
            <div className="space-y-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Activity Classification & Education
                </span>

                {/* Pill selector for Student vs Adult */}
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted border border-border">
                  <button
                    type="button"
                    onClick={() => setProfileCategory("STUDENT")}
                    className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      profileCategory === "STUDENT"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <School className="h-3.5 w-3.5" />
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfileCategory("ADULT")}
                    className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      profileCategory === "ADULT"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Building className="h-3.5 w-3.5" />
                    <span>Adult / Working</span>
                  </button>
                </div>
              </div>

              {/* Conditional Form Fields based on Student vs Adult */}
              {profileCategory === "STUDENT" ? (
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border/80 space-y-3.5 animate-in fade-in-50 duration-150">
                  <FormField
                    label="Current Institution / School / College"
                    htmlFor="current-institution"
                    hint="e.g. Farook College, Calicut University, GHSS Meenangadi"
                  >
                    <Input
                      id="current-institution"
                      placeholder="e.g. WMO Arts & Science College, Calicut University"
                      value={currentInstitution}
                      onChange={(e) => setCurrentInstitution(e.target.value)}
                    />
                  </FormField>

                  {/* Multiple Previous Education History */}
                  <div className="pt-2 border-t border-border/60">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                      Previous Education History
                    </span>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        placeholder="Education Type (e.g. SSLC, Plus Two, CBSE 10th)"
                        value={newEduType}
                        onChange={(e) => setNewEduType(e.target.value)}
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addPreviousEducation();
                          }
                        }}
                      />
                      <Input
                        placeholder="Year (e.g. 2022)"
                        value={newEduYear}
                        onChange={(e) => setNewEduYear(e.target.value)}
                        className="w-full sm:w-28"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addPreviousEducation();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={addPreviousEducation}
                        className="gap-1 flex-shrink-0"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </Button>
                    </div>

                    {previousEducations.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {previousEducations.map((item) => (
                          <span
                            key={item.id}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-medium border border-emerald-500/20"
                          >
                            <School className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            <span>{item.educationType}</span>
                            {item.year && (
                              <span className="font-mono text-[10px] font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-800 dark:text-emerald-200">
                                {item.year}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => removePreviousEducation(item.id)}
                              className="hover:text-destructive text-muted-foreground ml-1 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-muted-foreground mt-1.5 italic">
                        No previous education records added yet. Add past certifications or schooling.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border/80 space-y-3.5 animate-in fade-in-50 duration-150">
                  <FormField label="Occupation" htmlFor="member-occupation">
                    <Input
                      id="member-occupation"
                      placeholder="e.g. Business, Teacher, Driver, Engineer"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                    />
                  </FormField>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                      Educational Qualifications
                    </span>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g. SSLC, Plus Two, B.Com, Alim Sanad"
                        value={newQualInput}
                        onChange={(e) => setNewQualInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addQualification();
                          }
                        }}
                        className="flex-1"
                      />
                      <Button type="button" size="sm" variant="outline" onClick={addQualification} className="gap-1">
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </Button>
                    </div>

                    {qualificationsList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {qualificationsList.map((q) => (
                          <span
                            key={q.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-foreground text-xs font-medium border border-border"
                          >
                            <span>{q.degree}</span>
                            <button
                              type="button"
                              onClick={() => removeQualification(q.id)}
                              className="hover:text-destructive text-muted-foreground ml-1 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Demographics */}
            <div className="space-y-3 pt-3 border-t border-border">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Demographics
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <FormField label="Date of Birth" htmlFor="member-dob">
                  <Input
                    id="member-dob"
                    type="date"
                    value={values.dateOfBirth}
                    onChange={(e) => setValues((v) => ({ ...v, dateOfBirth: e.target.value }))}
                  />
                </FormField>

                <FormField label="Gender" htmlFor="member-gender">
                  <Select
                    id="member-gender"
                    value={values.gender}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, gender: e.target.value as Gender | "" }))
                    }
                  >
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </Select>
                </FormField>

                <FormField label="Blood Group" htmlFor="member-blood-group">
                  <Select
                    id="member-blood-group"
                    value={values.bloodGroup}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, bloodGroup: e.target.value as BloodGroup | "" }))
                    }
                  >
                    <option value="">Select blood group</option>
                    {(Object.entries(BLOOD_GROUP_LABELS) as [BloodGroup, string][]).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      )
                    )}
                  </Select>
                </FormField>

                <FormField label="Marital Status" htmlFor="member-marital-status">
                  <Select
                    id="member-marital-status"
                    value={values.maritalStatus}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, maritalStatus: e.target.value as MaritalStatus | "" }))
                    }
                  >
                    <option value="">Select status</option>
                    <option value="SINGLE">Single</option>
                    <option value="MARRIED">Married</option>
                    <option value="WIDOWED">Widowed</option>
                    <option value="DIVORCED">Divorced</option>
                  </Select>
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <FormField label="National ID / Aadhaar" htmlFor="member-id-number">
                  <Input
                    id="member-id-number"
                    leadingIcon={<IdCard />}
                    placeholder="e.g. 12-digit Aadhaar number"
                    value={values.idNumber}
                    onChange={(e) => setValues((v) => ({ ...v, idNumber: e.target.value }))}
                  />
                </FormField>

                <FormField label="Primary Phone Number" htmlFor="member-phone">
                  <Input
                    id="member-phone"
                    leadingIcon={<Phone />}
                    placeholder="e.g. +91 98765 43210"
                    value={values.phone}
                    onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
                  />
                </FormField>
              </div>
            </div>

            {/* Section 4: Detailed Residential Address */}
            <div className="space-y-3 pt-3 border-t border-border">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Residential Address
                </span>

                {/* Option to use family address */}
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                  <Checkbox
                    checked={useFamilyAddress}
                    onChange={(e) => handleToggleFamilyAddress(e.target.checked)}
                  />
                  <span>Use Family / Household Address</span>
                </label>
              </div>

              {useFamilyAddress ? (
                <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-2.5 text-xs">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">Linked Household Address:</span>
                    <span className="text-muted-foreground mt-0.5">
                      {selectedFamily?.address ||
                        "No address recorded for selected family. Uncheck above to enter a custom address."}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border/80 space-y-3 animate-in fade-in-50 duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField label="House / Building Name" htmlFor="m-house-name">
                      <Input
                        id="m-house-name"
                        placeholder="House Name / Flat"
                        value={houseName}
                        onChange={(e) => setHouseName(e.target.value)}
                      />
                    </FormField>

                    <FormField label="Place / Locality" htmlFor="m-place">
                      <Input
                        id="m-place"
                        placeholder="Place / Locality"
                        value={place}
                        onChange={(e) => setPlace(e.target.value)}
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <FormField label="Post Office" htmlFor="m-post">
                      <Input
                        id="m-post"
                        placeholder="Post Office"
                        value={post}
                        onChange={(e) => setPost(e.target.value)}
                      />
                    </FormField>

                    <FormField label="District" htmlFor="m-district">
                      <Input
                        id="m-district"
                        placeholder="District"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                      />
                    </FormField>

                    <FormField label="State" htmlFor="m-state">
                      <Input
                        id="m-state"
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      />
                    </FormField>

                    <FormField label="PIN Code" htmlFor="m-pin">
                      <Input
                        id="m-pin"
                        placeholder="6-digit PIN"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField label="Local Body Type" htmlFor="m-local-body-type">
                      <Select
                        id="m-local-body-type"
                        value={localBodyType}
                        onChange={(e) => setLocalBodyType(e.target.value)}
                      >
                        <option value="Grama Panchayath">Grama Panchayath</option>
                        <option value="Municipality">Municipality</option>
                        <option value="Corporation">Corporation</option>
                      </Select>
                    </FormField>

                    <FormField label="Local Body Name" htmlFor="m-local-body-name">
                      <Input
                        id="m-local-body-name"
                        placeholder="Name of Panchayath / Municipality"
                        value={localBodyName}
                        onChange={(e) => setLocalBodyName(e.target.value)}
                      />
                    </FormField>
                  </div>
                </div>
              )}
            </div>

            {/* Section 5: Residency & Welfare Registers */}
            <div className="space-y-3 pt-3 border-t border-border">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Residency & Welfare Registers
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Residency Status" htmlFor="member-movement-status">
                  <Select
                    id="member-movement-status"
                    value={values.movementStatus}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, movementStatus: e.target.value as MovementStatus }))
                    }
                  >
                    {(Object.entries(MOVEMENT_STATUS_LABELS) as [MovementStatus, string][]).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      )
                    )}
                  </Select>
                </FormField>

                {values.movementStatus !== "RESIDENT" && (
                  <FormField label="Status Effective Date" htmlFor="member-movement-date">
                    <Input
                      id="member-movement-date"
                      type="date"
                      value={values.movementDate}
                      onChange={(e) => setValues((v) => ({ ...v, movementDate: e.target.value }))}
                    />
                  </FormField>
                )}
              </div>

              {/* Welfare Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* NRI Register */}
                <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-2.5">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <Checkbox
                      checked={values.isExpatriate}
                      onChange={(e) => setValues((v) => ({ ...v, isExpatriate: e.target.checked }))}
                    />
                    <Plane className="h-3.5 w-3.5 text-blue-500" />
                    <span>Pravasi / NRI Register</span>
                  </label>

                  {values.isExpatriate && (
                    <div className="space-y-2 pt-1 border-t border-border/60">
                      <Input
                        placeholder="Country of residence (e.g. UAE, Saudi Arabia)"
                        value={values.expatriateCountry}
                        onChange={(e) => setValues((v) => ({ ...v, expatriateCountry: e.target.value }))}
                        className="text-xs h-8"
                      />
                      <Input
                        placeholder="Occupation abroad"
                        value={values.expatriateOccupation}
                        onChange={(e) => setValues((v) => ({ ...v, expatriateOccupation: e.target.value }))}
                        className="text-xs h-8"
                      />
                    </div>
                  )}
                </div>

                {/* Yatheem Register */}
                <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-2.5">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <Checkbox
                      checked={values.isYatheem}
                      onChange={(e) => setValues((v) => ({ ...v, isYatheem: e.target.checked }))}
                    />
                    <HeartHandshake className="h-3.5 w-3.5 text-amber-500" />
                    <span>Yatheem (Orphan) Register</span>
                  </label>

                  {values.isYatheem && (
                    <div className="space-y-2 pt-1 border-t border-border/60">
                      <Input
                        placeholder="Guardian Name"
                        value={values.guardianName}
                        onChange={(e) => setValues((v) => ({ ...v, guardianName: e.target.value }))}
                        className="text-xs h-8"
                      />
                      <Input
                        placeholder="Guardian Phone"
                        value={values.guardianPhone}
                        onChange={(e) => setValues((v) => ({ ...v, guardianPhone: e.target.value }))}
                        className="text-xs h-8"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            </div>

            <DialogFooter className="p-4 px-6 border-t border-border bg-muted/20 flex items-center justify-between gap-2 shrink-0 sm:justify-between">
              {editingMember ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="text-destructive hover:bg-destructive/10 hover:border-destructive/30 gap-1.5"
                >
                  <Trash className="h-4 w-4" />
                  <span>Delete Member</span>
                </Button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" isLoading={isSubmitting}>
                  {editingMember ? "Save Changes" : "Add Member"}
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
        title={`Delete ${editingMember?.fullName ?? "this member"}?`}
        description="This will remove the member from the directory and any linked household records. This action cannot be undone."
        confirmLabel="Delete Member"
        destructive
        isConfirming={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
