"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
  Select,
  Plus,
  Trash,
  Home,
  User,
  Users,
  School,
  Building,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { House } from "@/lib/houses";

interface QualificationItem {
  id: string;
  degree: string;
}

interface PreviousEducationItem {
  id: string;
  educationType: string;
  year: string;
}

interface MemberListItem {
  id: string;
  fullName: string;
  dateOfBirth: string;
  phone: string;
  occupation: string;
  relationToHead: string;
  idType: string;
  idNumber: string;
  memberType: "ADULT" | "STUDENT";
  currentInstitution: string;
  previousEducations: PreviousEducationItem[];
  newEduType?: string;
  newEduYear?: string;
}

interface Division {
  id: string;
  name: string;
  code: string | null;
}

export function AddFamilyDialog({
  slug,
  open,
  onOpenChange,
  houses = [],
  defaultDivisionId
}: {
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  houses?: House[];
  defaultDivisionId?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();

  // Active step / tab inside dialog
  const [activeTab, setActiveTab] = useState<"location" | "applicant" | "members">("location");

  // Divisions / Wards
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [hasDivisions, setHasDivisions] = useState(false);
  const [divisionTerm, setDivisionTerm] = useState("Ward / Division");
  const [globalHousePrefix, setGlobalHousePrefix] = useState("");

  // Form Section 1: Location & Housing
  const [wardId, setWardId] = useState(defaultDivisionId ?? "");
  const [municipalHouseNumber, setMunicipalHouseNumber] = useState("");
  const [mahallHouseNumber, setMahallHouseNumber] = useState("");
  const [houseName, setHouseName] = useState("");

  // Form Section 2: Applicant / Househead details
  const [applicantName, setApplicantName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("MALE");
  const [bloodGroup, setBloodGroup] = useState("");
  const [familyCategory, setFamilyCategory] = useState("General");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [place, setPlace] = useState("");
  const [post, setPost] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("Kerala");
  const [pin, setPin] = useState("");
  const [localBodyType, setLocalBodyType] = useState("Grama Panchayath");
  const [localBodyName, setLocalBodyName] = useState("");
  const [applicantType, setApplicantType] = useState<"ADULT" | "STUDENT">("ADULT");
  const [applicantInstitution, setApplicantInstitution] = useState("");
  const [applicantPrevEducations, setApplicantPrevEducations] = useState<PreviousEducationItem[]>([]);
  const [newApplicantEduType, setNewApplicantEduType] = useState("");
  const [newApplicantEduYear, setNewApplicantEduYear] = useState("");
  const [occupation, setOccupation] = useState("");
  const [idType, setIdType] = useState("Aadhaar Card");
  const [idNumber, setIdNumber] = useState("");

  // Dynamic Qualifications
  const [qualifications, setQualifications] = useState<QualificationItem[]>([]);
  const [newQualInput, setNewQualInput] = useState("");

  // Form Section 3: Family Member List
  const [memberList, setMemberList] = useState<MemberListItem[]>([]);

  // Submission & Error State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active division and house number prefix code
  const selectedDivision = divisions.find((d) => d.id === wardId);
  const activeHouseCode = (selectedDivision?.code || (!hasDivisions || !selectedDivision ? globalHousePrefix : "") || "").trim();

  // Load structure/divisions on mount
  useEffect(() => {
    if (open) {
      if (defaultDivisionId) {
        setWardId(defaultDivisionId);
      }
      apiClient
        .get<{
          structure: {
            hasDivisions: boolean;
            divisionTerm: string | null;
            houseNumberPrefix?: string | null;
            houseNumberingMethod?: string | null;
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
  }, [open, slug, defaultDivisionId]);

  const addQualification = () => {
    const trimmed = newQualInput.trim();
    if (!trimmed) return;
    setQualifications((prev) => [...prev, { id: String(Date.now()), degree: trimmed }]);
    setNewQualInput("");
  };

  const removeQualification = (id: string) => {
    setQualifications((prev) => prev.filter((q) => q.id !== id));
  };

  const addApplicantPreviousEducation = () => {
    const trimmed = newApplicantEduType.trim();
    if (!trimmed) return;
    setApplicantPrevEducations((prev) => [
      ...prev,
      { id: String(Date.now()), educationType: trimmed, year: newApplicantEduYear.trim() }
    ]);
    setNewApplicantEduType("");
    setNewApplicantEduYear("");
  };

  const removeApplicantPreviousEducation = (id: string) => {
    setApplicantPrevEducations((prev) => prev.filter((item) => item.id !== id));
  };

  const addMemberRow = () => {
    setMemberList((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        fullName: "",
        dateOfBirth: "",
        phone: "",
        occupation: "",
        relationToHead: "SPOUSE",
        idType: "Aadhaar Card",
        idNumber: "",
        memberType: "ADULT",
        currentInstitution: "",
        previousEducations: [],
        newEduType: "",
        newEduYear: ""
      }
    ]);
  };

  const updateMemberRow = (id: string, field: keyof MemberListItem, value: any) => {
    setMemberList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const addMemberPreviousEducation = (memberId: string) => {
    setMemberList((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m;
        const type = (m.newEduType || "").trim();
        if (!type) return m;
        return {
          ...m,
          previousEducations: [
            ...(m.previousEducations || []),
            { id: String(Date.now()), educationType: type, year: (m.newEduYear || "").trim() }
          ],
          newEduType: "",
          newEduYear: ""
        };
      })
    );
  };

  const removeMemberPreviousEducation = (memberId: string, eduId: string) => {
    setMemberList((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m;
        return {
          ...m,
          previousEducations: (m.previousEducations || []).filter((e) => e.id !== eduId)
        };
      })
    );
  };

  const removeMemberRow = (id: string) => {
    setMemberList((prev) => prev.filter((m) => m.id !== id));
  };

  const resetForm = () => {
    setActiveTab("location");
    setWardId(defaultDivisionId ?? "");
    setApplicantPrevEducations([]);
    setNewApplicantEduType("");
    setNewApplicantEduYear("");
    setMunicipalHouseNumber("");
    setMahallHouseNumber("");
    setHouseName("");
    setApplicantName("");
    setFatherName("");
    setDateOfBirth("");
    setGender("MALE");
    setBloodGroup("");
    setFamilyCategory("General");
    setPhone("");
    setEmail("");
    setPlace("");
    setPost("");
    setDistrict("");
    setState("Kerala");
    setPin("");
    setLocalBodyType("Grama Panchayath");
    setLocalBodyName("");
    setOccupation("");
    setIdType("Aadhaar Card");
    setIdNumber("");
    setQualifications([]);
    setNewQualInput("");
    setMemberList([]);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!applicantName.trim()) {
      setError("Please provide the Applicant / Househead Name.");
      setActiveTab("applicant");
      return;
    }

    if (!phone.trim()) {
      setError("Please provide the primary contact phone number.");
      setActiveTab("applicant");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Build family name
      const familyDisplayName = houseName.trim()
        ? `${houseName.trim()} Family`
        : `${applicantName.trim()} Family`;

      // Formulate final mahall house number including prefix if defined
      const currentHouseCode = activeHouseCode.trim();
      const rawMahallNum = mahallHouseNumber.trim();
      const finalMahallHouseNumber = rawMahallNum
        ? currentHouseCode && !rawMahallNum.toUpperCase().startsWith(currentHouseCode.toUpperCase())
          ? `${currentHouseCode}${rawMahallNum}`
          : rawMahallNum
        : "";

      const finalMunicipalHouseNumber = municipalHouseNumber.trim();

      // 2. Build full address string
      const addressParts = [
        houseName ? `House: ${houseName}` : null,
        finalMahallHouseNumber ? `Mahall House No: ${finalMahallHouseNumber}` : null,
        finalMunicipalHouseNumber ? `Municipal Door No: ${finalMunicipalHouseNumber}` : null,
        place,
        post ? `PO: ${post}` : null,
        localBodyName ? `${localBodyName} (${localBodyType})` : null,
        district,
        state,
        pin ? `PIN: ${pin}` : null
      ].filter(Boolean);

      const fullAddress = addressParts.join(", ");

      // Selected ward name
      const selectedWard = divisions.find((d) => d.id === wardId);

      // Structured internal notes
      const notesParts: string[] = [];
      if (familyCategory) notesParts.push(`Category: ${familyCategory}`);
      if (selectedWard) notesParts.push(`Ward: ${selectedWard.name}`);
      if (finalMahallHouseNumber) notesParts.push(`Mahall House: ${finalMahallHouseNumber}`);
      if (finalMunicipalHouseNumber) notesParts.push(`Municipal House: ${finalMunicipalHouseNumber}`);
      if (fatherName.trim()) notesParts.push(`Father: ${fatherName.trim()}`);
      const notes = notesParts.length > 0 ? notesParts.join(" | ") : null;

      // 3. Resolve dwelling / house link with division
      let resolvedHouseId: string | null = null;
      const numToUse = finalMahallHouseNumber || finalMunicipalHouseNumber || `${applicantName.trim()} House`;
      if (numToUse) {
        const existing = houses.find((h) => h.displayNumber.toLowerCase() === numToUse.toLowerCase());
        if (existing) {
          resolvedHouseId = existing.id;
        } else {
          try {
            const houseRes = await apiClient.post<{ house: { id: string } }>(
              `/tenants/${slug}/houses`,
              {
                displayNumber: numToUse,
                name: houseName.trim() || undefined,
                divisionId: wardId || undefined,
                address: fullAddress || undefined
              }
            );
            resolvedHouseId = houseRes?.house?.id ?? null;
          } catch {
            // non-fatal if house creation is restricted
          }
        }
      }

      // Register family record
      const familyRes = await apiClient.post<{ family: { id: string } }>(
        `/tenants/${slug}/families`,
        {
          name: familyDisplayName,
          address: fullAddress || null,
          phone: phone.trim() || null,
          houseId: resolvedHouseId,
          notes: notes || null
        }
      );

      const createdFamilyId = familyRes?.family?.id;

      if (!createdFamilyId) {
        throw new Error("Failed to initialize family record.");
      }

      // Compile applicant occupation string
      const qualStr = qualifications.map((q) => q.degree).join(", ");
      const applicantPrevEduStr = applicantPrevEducations
        .map((p) => (p.year ? `${p.educationType} (${p.year})` : p.educationType))
        .join(", ");
      const applicantOccFinal = applicantType === "STUDENT"
        ? (applicantInstitution.trim()
          ? `Student • ${applicantInstitution.trim()}${applicantPrevEduStr ? ` (Prev: ${applicantPrevEduStr})` : ""}`
          : applicantPrevEduStr
            ? `Student (Prev: ${applicantPrevEduStr})`
            : "Student")
        : qualStr
          ? `${occupation.trim()}${occupation.trim() ? " • " : ""}Qualifications: ${qualStr}`
          : occupation.trim();

      // 4. Create Applicant as Head Member
      await apiClient.post(`/tenants/${slug}/members`, {
        fullName: applicantName.trim(),
        familyId: createdFamilyId,
        relationToHead: "HEAD",
        gender: gender || undefined,
        dateOfBirth: dateOfBirth || undefined,
        bloodGroup: bloodGroup || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        occupation: applicantOccFinal || undefined,
        movementNotes: applicantType === "STUDENT" ? "[Student]" : undefined,
        idNumber: idNumber.trim() ? `${idType}: ${idNumber.trim()}` : undefined,
        address: fullAddress || undefined
      });

      // 5. Create each listed family member
      for (const m of memberList) {
        if (!m.fullName.trim()) continue;
        const memberPrevEduStr = m.previousEducations
          ?.map((p) => (p.year ? `${p.educationType} (${p.year})` : p.educationType))
          .join(", ");
        const memberOccFinal = m.memberType === "STUDENT"
          ? (m.currentInstitution.trim()
            ? `Student • ${m.currentInstitution.trim()}${memberPrevEduStr ? ` (Prev: ${memberPrevEduStr})` : ""}`
            : memberPrevEduStr
              ? `Student (Prev: ${memberPrevEduStr})`
              : "Student")
          : m.occupation.trim();

        await apiClient.post(`/tenants/${slug}/members`, {
          fullName: m.fullName.trim(),
          familyId: createdFamilyId,
          relationToHead: m.relationToHead || "OTHER",
          dateOfBirth: m.dateOfBirth || undefined,
          phone: m.phone.trim() || undefined,
          occupation: memberOccFinal || undefined,
          movementNotes: m.memberType === "STUDENT" ? "[Student]" : undefined,
          idNumber: m.idNumber.trim() ? `${m.idType}: ${m.idNumber.trim()}` : undefined,
          address: fullAddress || undefined
        });
      }

      toast({
        title: "Family Registered",
        description: `${familyDisplayName} and members have been registered successfully.`
      });

      onOpenChange(false);
      resetForm();
      router.push(`/${slug}/families/${createdFamilyId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong while creating the family record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-3xl sm:w-[780px] h-[680px] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="p-5 pb-3 border-b border-border bg-muted/20 shrink-0">
          <DialogTitle className="text-xl font-bold">Register New Family Household</DialogTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create a family household unit, designate the househead, and register immediate members.
          </p>
        </DialogHeader>

        {/* Step Tabs Bar */}
        <div className="flex items-center border-b border-border bg-muted/40 px-5 text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("location")}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${activeTab === "location"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
          >
            <Home className="h-3.5 w-3.5" />
            <span>1. Location & Housing</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("applicant")}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${activeTab === "applicant"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>2. Applicant / Househead</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("members")}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${activeTab === "members"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>3. Family Members ({memberList.length})</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                {error}
              </div>
            )}

            {/* TAB 1: LOCATION & HOUSING */}
            {activeTab === "location" && (
              <div className="space-y-4 animate-in fade-in-50 duration-150">
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 text-xs text-muted-foreground">
                  Define the residential dwelling, municipal house number, and area jurisdiction for this household.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {hasDivisions && (
                    <div className="sm:col-span-2 p-3.5 rounded-xl bg-primary/5 border border-primary/20 flex flex-col gap-2">
                      <FormField
                        label={`Select ${divisionTerm}`}
                        htmlFor="ward-select"
                        hint={`Assign this household to a ${divisionTerm.toLowerCase()} jurisdiction`}
                      >
                        <Select
                          id="ward-select"
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

                  <FormField
                    label="Municipal House Number"
                    htmlFor="municipal-house-number"
                    hint="Local body / Panchayat / Municipality door number"
                  >
                    <Input
                      id="municipal-house-number"
                      placeholder="e.g. 12/450-A"
                      value={municipalHouseNumber}
                      onChange={(e) => setMunicipalHouseNumber(e.target.value)}
                    />
                  </FormField>

                  <FormField
                    label="Mahall House Number"
                    htmlFor="mahall-house-number"
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
                        id="mahall-house-number"
                        className="flex-1 px-3 py-2 text-sm bg-transparent outline-none placeholder:text-muted-foreground min-w-0"
                        placeholder={activeHouseCode ? "01" : "e.g. MH-01"}
                        value={mahallHouseNumber}
                        onChange={(e) => setMahallHouseNumber(e.target.value)}
                      />
                    </div>
                  </FormField>

                  <div className="sm:col-span-2">
                    <FormField label="House Name" htmlFor="house-name" hint="Dwelling / Villa / Residence Name">
                      <Input
                        id="house-name"
                        placeholder="e.g. Baitul Noor, Al-Falah"
                        value={houseName}
                        onChange={(e) => setHouseName(e.target.value)}
                      />
                    </FormField>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: APPLICANT / HOUSEHEAD */}
            {activeTab === "applicant" && (
              <div className="space-y-4 animate-in fade-in-50 duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  <div className="sm:col-span-2">
                    <FormField label="Househead / Applicant Name" htmlFor="applicant-name" required>
                      <Input
                        id="applicant-name"
                        required
                        placeholder="Full legal name"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                      />
                    </FormField>
                  </div>

                  <FormField label="Father's Name" htmlFor="father-name">
                    <Input
                      id="father-name"
                      placeholder="Father's full name"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                    />
                  </FormField>

                  <FormField label="Date of Birth" htmlFor="applicant-dob">
                    <Input
                      id="applicant-dob"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                  </FormField>

                  <FormField label="Gender" htmlFor="applicant-gender">
                    <Select id="applicant-gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </Select>
                  </FormField>

                  <FormField label="Blood Group" htmlFor="applicant-blood">
                    <Select id="applicant-blood" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                      <option value="">Select Blood Group</option>
                      <option value="A_POSITIVE">A+ (A Positive)</option>
                      <option value="A_NEGATIVE">A- (A Negative)</option>
                      <option value="B_POSITIVE">B+ (B Positive)</option>
                      <option value="B_NEGATIVE">B- (B Negative)</option>
                      <option value="O_POSITIVE">O+ (O Positive)</option>
                      <option value="O_NEGATIVE">O- (O Negative)</option>
                      <option value="AB_POSITIVE">AB+ (AB Positive)</option>
                      <option value="AB_NEGATIVE">AB- (AB Negative)</option>
                    </Select>
                  </FormField>

                  <FormField label="Family Category" htmlFor="family-category">
                    <Select id="family-category" value={familyCategory} onChange={(e) => setFamilyCategory(e.target.value)}>
                      <option value="General">General</option>
                      <option value="APL">APL (Above Poverty Line)</option>
                      <option value="BPL">BPL (Below Poverty Line)</option>
                      <option value="Welfare Support">Welfare Support</option>
                      <option value="Zakath Eligible">Zakath Eligible</option>
                    </Select>
                  </FormField>

                  <FormField label="Mobile Phone" htmlFor="applicant-phone" required>
                    <Input
                      id="applicant-phone"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </FormField>

                  <FormField label="Email Address" htmlFor="applicant-email">
                    <Input
                      id="applicant-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormField>

                  <FormField label="Govt ID Type" htmlFor="applicant-id-type">
                    <Select id="applicant-id-type" value={idType} onChange={(e) => setIdType(e.target.value)}>
                      <option value="Aadhaar Card">Aadhaar Card</option>
                      <option value="Voter ID">Voter ID</option>
                      <option value="Passport">Passport</option>
                      <option value="Driving License">Driving License</option>
                      <option value="Ration Card">Ration Card</option>
                    </Select>
                  </FormField>

                  <FormField label="ID Number" htmlFor="applicant-id-num">
                    <Input
                      id="applicant-id-num"
                      placeholder="Enter ID number"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                    />
                  </FormField>
                </div>

                {/* Address Matrix */}
                <div className="pt-2 border-t border-border">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2.5">
                    Detailed Address Breakdown
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    <div className="col-span-2">
                      <FormField label="Place / Locality" htmlFor="place">
                        <Input id="place" placeholder="e.g. Kalpetta" value={place} onChange={(e) => setPlace(e.target.value)} />
                      </FormField>
                    </div>

                    <div className="col-span-2">
                      <FormField label="Post Office" htmlFor="post">
                        <Input id="post" placeholder="e.g. Kalpetta North" value={post} onChange={(e) => setPost(e.target.value)} />
                      </FormField>
                    </div>

                    <div className="col-span-2">
                      <FormField label="District" htmlFor="district">
                        <Input id="district" placeholder="e.g. Wayanad" value={district} onChange={(e) => setDistrict(e.target.value)} />
                      </FormField>
                    </div>

                    <div className="col-span-1">
                      <FormField label="State" htmlFor="state">
                        <Input id="state" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
                      </FormField>
                    </div>

                    <div className="col-span-1">
                      <FormField label="PIN Code" htmlFor="pin">
                        <Input id="pin" placeholder="e.g. 673121" value={pin} onChange={(e) => setPin(e.target.value)} />
                      </FormField>
                    </div>

                    <div className="col-span-2">
                      <FormField label="Local Body Type" htmlFor="local-body-type">
                        <Select id="local-body-type" value={localBodyType} onChange={(e) => setLocalBodyType(e.target.value)}>
                          <option value="Grama Panchayath">Panchayath</option>
                          <option value="Municipality">Municipality</option>
                          <option value="Corporation">Corporation</option>
                        </Select>
                      </FormField>
                    </div>

                    <div className="col-span-2">
                      <FormField label="Local Body Name" htmlFor="local-body-name">
                        <Input id="local-body-name" placeholder="Name" value={localBodyName} onChange={(e) => setLocalBodyName(e.target.value)} />
                      </FormField>
                    </div>
                  </div>
                </div>

                {/* Profile Classification & Education / Occupation */}
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Profile Classification & Activity
                    </span>
                    <div className="inline-flex rounded-lg border border-border p-0.5 bg-muted/40">
                      <button
                        type="button"
                        onClick={() => setApplicantType("STUDENT")}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${applicantType === "STUDENT"
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        <School className="h-3.5 w-3.5" />
                        <span>Student</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setApplicantType("ADULT")}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${applicantType === "ADULT"
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        <Building className="h-3.5 w-3.5" />
                        <span>Adult / Working</span>
                      </button>
                    </div>
                  </div>

                  {applicantType === "STUDENT" ? (
                    <div className="p-3.5 rounded-xl bg-muted/30 border border-border/80 space-y-3.5 animate-in fade-in-50 duration-150">
                      <FormField
                        label="Current Institution / School / College"
                        htmlFor="applicant-inst"
                        hint="e.g. Farook College, Calicut University, GHSS Meenangadi"
                      >
                        <Input
                          id="applicant-inst"
                          placeholder="e.g. WMO Arts & Science College, Calicut University"
                          value={applicantInstitution}
                          onChange={(e) => setApplicantInstitution(e.target.value)}
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
                            value={newApplicantEduType}
                            onChange={(e) => setNewApplicantEduType(e.target.value)}
                            className="flex-1"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addApplicantPreviousEducation();
                              }
                            }}
                          />
                          <Input
                            placeholder="Year (e.g. 2022)"
                            value={newApplicantEduYear}
                            onChange={(e) => setNewApplicantEduYear(e.target.value)}
                            className="w-full sm:w-28"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addApplicantPreviousEducation();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={addApplicantPreviousEducation}
                            className="gap-1 flex-shrink-0"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add</span>
                          </Button>
                        </div>

                        {applicantPrevEducations.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {applicantPrevEducations.map((item) => (
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
                                  onClick={() => removeApplicantPreviousEducation(item.id)}
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
                    <div className="space-y-3">
                      <FormField label="Occupation" htmlFor="applicant-occupation">
                        <Input
                          id="applicant-occupation"
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

                        {qualifications.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {qualifications.map((q) => (
                              <span
                                key={q.id}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-foreground text-xs font-medium border border-border"
                              >
                                <span>{q.degree}</span>
                                <button
                                  type="button"
                                  onClick={() => removeQualification(q.id)}
                                  className="hover:text-destructive text-muted-foreground ml-1"
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
              </div>
            )}

            {/* TAB 3: MEMBER LIST */}
            {activeTab === "members" && (
              <div className="space-y-4 animate-in fade-in-50 duration-150">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/80">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">Family Member Roster</span>
                    <span className="text-[11px] text-muted-foreground">
                      Add spouse, children, and immediate family members. Other detailed fields can be updated later from each member&apos;s page.
                    </span>
                  </div>
                  <Button type="button" size="sm" onClick={addMemberRow} className="gap-1 shadow-sm text-xs">
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Member</span>
                  </Button>
                </div>

                {memberList.length === 0 ? (
                  <div className="p-8 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
                    No additional family members added yet. Click &quot;Add Member&quot; to register family members.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {memberList.map((m, index) => (
                      <div
                        key={m.id}
                        className="p-3.5 rounded-xl border border-border bg-card shadow-xs flex flex-col gap-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">Member #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeMemberRow(m.id)}
                            className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
                          >
                            <Trash className="h-3 w-3" />
                            <span>Remove</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                          <FormField label="Member Name" htmlFor={`m-name-${m.id}`} required>
                            <Input
                              id={`m-name-${m.id}`}
                              required
                              placeholder="Full name"
                              value={m.fullName}
                              onChange={(e) => updateMemberRow(m.id, "fullName", e.target.value)}
                            />
                          </FormField>

                          <FormField label="Relation to Head" htmlFor={`m-rel-${m.id}`}>
                            <Select
                              id={`m-rel-${m.id}`}
                              value={m.relationToHead}
                              onChange={(e) => updateMemberRow(m.id, "relationToHead", e.target.value)}
                            >
                              <option value="SPOUSE">Spouse</option>
                              <option value="SON">Son</option>
                              <option value="DAUGHTER">Daughter</option>
                              <option value="PARENT">Parent</option>
                              <option value="SIBLING">Sibling</option>
                              <option value="OTHER">Other</option>
                            </Select>
                          </FormField>

                          <FormField label="Date of Birth" htmlFor={`m-dob-${m.id}`}>
                            <Input
                              id={`m-dob-${m.id}`}
                              type="date"
                              value={m.dateOfBirth}
                              onChange={(e) => updateMemberRow(m.id, "dateOfBirth", e.target.value)}
                            />
                          </FormField>

                          <FormField label="Phone Number" htmlFor={`m-phone-${m.id}`}>
                            <Input
                              id={`m-phone-${m.id}`}
                              placeholder="Mobile phone"
                              value={m.phone}
                              onChange={(e) => updateMemberRow(m.id, "phone", e.target.value)}
                            />
                          </FormField>

                          {/* Classification Pill */}
                          <div className="sm:col-span-2 md:col-span-4 flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/60">
                            <span className="text-[11px] font-semibold text-muted-foreground">
                              Classification: {m.memberType === "STUDENT" ? "Student" : "Adult"}
                            </span>
                            <div className="inline-flex rounded-lg border border-border p-0.5 bg-muted/40">
                              <button
                                type="button"
                                onClick={() => updateMemberRow(m.id, "memberType", "STUDENT")}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${m.memberType === "STUDENT"
                                    ? "bg-primary text-primary-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                                  }`}
                              >
                                <School className="h-3.5 w-3.5" />
                                <span>Student</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => updateMemberRow(m.id, "memberType", "ADULT")}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${m.memberType !== "STUDENT"
                                    ? "bg-primary text-primary-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                                  }`}
                              >
                                <Building className="h-3.5 w-3.5" />
                                <span>Adult / Working</span>
                              </button>
                            </div>
                          </div>

                          {m.memberType === "STUDENT" ? (
                            <div className="sm:col-span-2 md:col-span-4 p-3 rounded-lg bg-muted/20 border border-border/60 space-y-3">
                              <FormField label="Current Institution / School / College" htmlFor={`m-inst-${m.id}`}>
                                <Input
                                  id={`m-inst-${m.id}`}
                                  placeholder="e.g. WMO Arts & Science College, GHSS"
                                  value={m.currentInstitution}
                                  onChange={(e) => updateMemberRow(m.id, "currentInstitution", e.target.value)}
                                />
                              </FormField>

                              <div className="pt-2 border-t border-border/60">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                                  Previous Education History
                                </span>
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <Input
                                    placeholder="Education Type (e.g. SSLC, Plus Two)"
                                    value={m.newEduType || ""}
                                    onChange={(e) => updateMemberRow(m.id, "newEduType", e.target.value)}
                                    className="flex-1 text-xs"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        addMemberPreviousEducation(m.id);
                                      }
                                    }}
                                  />
                                  <Input
                                    placeholder="Year (e.g. 2022)"
                                    value={m.newEduYear || ""}
                                    onChange={(e) => updateMemberRow(m.id, "newEduYear", e.target.value)}
                                    className="w-full sm:w-28 text-xs"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        addMemberPreviousEducation(m.id);
                                      }
                                    }}
                                  />
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => addMemberPreviousEducation(m.id)}
                                    className="gap-1 flex-shrink-0 text-xs"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                    <span>Add</span>
                                  </Button>
                                </div>

                                {(m.previousEducations && m.previousEducations.length > 0) ? (
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    {m.previousEducations.map((item) => (
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
                                          onClick={() => removeMemberPreviousEducation(m.id, item.id)}
                                          className="hover:text-destructive text-muted-foreground ml-1 font-bold"
                                        >
                                          ×
                                        </button>
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-[11px] text-muted-foreground mt-1 italic">
                                    No previous education added yet.
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="sm:col-span-2 md:col-span-4">
                              <FormField label="Occupation" htmlFor={`m-occ-${m.id}`}>
                                <Input
                                  id={`m-occ-${m.id}`}
                                  placeholder="e.g. Business, Teacher, Driver, Private Job"
                                  value={m.occupation}
                                  onChange={(e) => updateMemberRow(m.id, "occupation", e.target.value)}
                                />
                              </FormField>
                            </div>
                          )}

                          <FormField label="Govt ID Type" htmlFor={`m-id-type-${m.id}`}>
                            <Select
                              id={`m-id-type-${m.id}`}
                              value={m.idType}
                              onChange={(e) => updateMemberRow(m.id, "idType", e.target.value)}
                            >
                              <option value="Aadhaar Card">Aadhaar Card</option>
                              <option value="Voter ID">Voter ID</option>
                              <option value="Passport">Passport</option>
                              <option value="Driving License">Driving License</option>
                              <option value="Ration Card">Ration Card</option>
                            </Select>
                          </FormField>

                          <div className="sm:col-span-2 md:col-span-3">
                            <FormField label="ID Number" htmlFor={`m-id-num-${m.id}`}>
                              <Input
                                id={`m-id-num-${m.id}`}
                                placeholder="ID number"
                                value={m.idNumber}
                                onChange={(e) => updateMemberRow(m.id, "idNumber", e.target.value)}
                              />
                            </FormField>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Fixed Standard Docked Footer */}
          <div className="p-4 px-6 border-t border-border bg-muted/20 flex items-center justify-between shrink-0">
            <div>
              {activeTab === "location" && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
              {activeTab === "applicant" && (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("location")}
                  >
                    ← Back: Location
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              )}
              {activeTab === "members" && (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("applicant")}
                  >
                    ← Back: Applicant
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {activeTab === "location" && (
                <Button type="button" size="sm" onClick={() => setActiveTab("applicant")}>
                  Next: Applicant Details →
                </Button>
              )}
              {activeTab === "applicant" && (
                <Button type="button" size="sm" onClick={() => setActiveTab("members")}>
                  Next: Family Members →
                </Button>
              )}
              {activeTab === "members" && (
                <Button type="submit" size="sm" isLoading={isSubmitting} className="gap-1.5">
                  <span>Save & Register Family</span>
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
