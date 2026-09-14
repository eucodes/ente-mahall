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
  Briefcase,
  GraduationCap,
  HeartPulse,
  ShieldAlert,
  Activity,
  Accessibility,
  X,
  SearchableSelect,
  useToast
} from "@mahalle/ui";
import { STATE_OPTIONS, getDistrictOptions } from "@/lib/location-data";
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
import type { Member, HealthConditionStatus, DisabilityType, SupportStatus, EducationHistoryItem } from "@/lib/members";
import type { Family } from "@/lib/business-resources";

export const EDUCATION_LEVEL_OPTIONS = [
  { value: "NONE", label: "None / Informal" },
  { value: "PRIMARY", label: "Primary (Up to 7th)" },
  { value: "SECONDARY_SSLC", label: "Secondary / SSLC (10th)" },
  { value: "HIGHER_SECONDARY", label: "Higher Secondary / Plus Two (+2)" },
  { value: "DIPLOMA", label: "Diploma / Polytechnic" },
  { value: "GRADUATE", label: "Graduate / Bachelor's (BA/B.Sc/B.Com/B.Tech)" },
  { value: "POST_GRADUATE", label: "Post Graduate / Master's (MA/M.Sc/M.Com)" },
  { value: "DOCTORATE", label: "Doctorate / Ph.D" },
  { value: "MADRASSA_ISLAMIC", label: "Madrassa / Islamic Studies" },
  { value: "VOCATIONAL", label: "Vocational / ITI / Skill Training" },
  { value: "OTHER", label: "Other" }
];

export const EMPLOYMENT_STATUS_OPTIONS = [
  { value: "EMPLOYED", label: "Employed (Salaried / Private / Govt)" },
  { value: "SELF_EMPLOYED", label: "Self-Employed / Professional" },
  { value: "BUSINESS", label: "Business / Entrepreneur / Shop" },
  { value: "GOVERNMENT_SERVICE", label: "Government Service / PSU" },
  { value: "PRIVATE_SECTOR", label: "Private Company / Corporate" },
  { value: "DAILY_WAGE", label: "Daily Wage / Labor" },
  { value: "JOB_SEEKER", label: "Job Seeker / Looking for Job" },
  { value: "STUDENT", label: "Student" },
  { value: "HOMEMAKER", label: "Homemaker" },
  { value: "RETIRED", label: "Retired" },
  { value: "UNABLE_TO_WORK", label: "Unable to Work / Medically Unfit" }
];

export const DISABILITY_TYPE_OPTIONS = [
  { value: "PHYSICAL", label: "Physical / Locomotor" },
  { value: "VISUAL", label: "Visual Impairment / Blindness" },
  { value: "HEARING", label: "Hearing Impairment / Deafness" },
  { value: "SPEECH", label: "Speech / Language Disability" },
  { value: "INTELLECTUAL", label: "Intellectual / Learning Disability" },
  { value: "MULTIPLE", label: "Multiple Disabilities" },
  { value: "OTHER", label: "Other" }
];

export const CHRONIC_CONDITION_OPTIONS = [
  "Diabetes",
  "Hypertension (BP)",
  "Heart Disease",
  "Kidney Disease / Dialysis",
  "Cancer",
  "Asthma / Respiratory",
  "Liver Disease",
  "Stroke / Paralysis",
  "Other"
];

export const ASSISTANCE_TYPE_OPTIONS = [
  "Mobility / Bedridden",
  "Personal Care",
  "Medication Management",
  "Daily Activities"
];

export const SUPPORT_CATEGORY_OPTIONS = [
  "Medical Assistance",
  "Medicine Aid (Monthly)",
  "Financial Aid / Pension",
  "Home Visit / Palliative Care",
  "Mobility Aid / Wheelchair",
  "Food Kit / Ration",
  "Counselling / Guidance",
  "Other"
];

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
  families,
  defaultFamilyId
}: {
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingMember: Member | null;
  families: Family[];
  defaultFamilyId?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [values, setValues] = useState<MemberFormValues>(() =>
    editingMember
      ? getMemberValues(editingMember)
      : { ...EMPTY_FORM, familyId: defaultFamilyId || "" }
  );
  const [activeTab, setActiveTab] = useState<"identity" | "education" | "health" | "address">("identity");

  // Education & Employment States
  const [profileType, setProfileType] = useState<"WORKER" | "STUDENT">("WORKER");
  const [educationLevel, setEducationLevel] = useState("");
  const [educationDetails, setEducationDetails] = useState("");
  const [institution, setInstitution] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [employerOrBusiness, setEmployerOrBusiness] = useState("");
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [isJobSeeker, setIsJobSeeker] = useState(false);

  // Multiple Education Background History
  const [educationHistory, setEducationHistory] = useState<EducationHistoryItem[]>([]);
  const [newEduLevel, setNewEduLevel] = useState("SECONDARY_SSLC");
  const [newEduDegree, setNewEduDegree] = useState("");
  const [newEduInstitution, setNewEduInstitution] = useState("");
  const [newEduYear, setNewEduYear] = useState("");

  // Health & Support States
  const [healthStatus, setHealthStatus] = useState<HealthConditionStatus>("NO_KNOWN_CONDITION");
  const [hasDisability, setHasDisability] = useState(false);
  const [disabilityType, setDisabilityType] = useState("");
  const [disabilityPercentage, setDisabilityPercentage] = useState("");
  const [disabilityCertificate, setDisabilityCertificate] = useState(false);
  const [disabilityCertificateNo, setDisabilityCertificateNo] = useState("");

  const [hasChronicIllness, setHasChronicIllness] = useState(false);
  const [chronicConditions, setChronicConditions] = useState<string[]>([]);
  const [chronicDetails, setChronicDetails] = useState("");
  const [treatmentRequired, setTreatmentRequired] = useState(false);
  const [regularMedicationRequired, setRegularMedicationRequired] = useState(false);

  const [requiresMentalHealthSupport, setRequiresMentalHealthSupport] = useState(false);
  const [mentalHealthSupportType, setMentalHealthSupportType] = useState("");

  const [requiresAssistance, setRequiresAssistance] = useState(false);
  const [assistanceTypes, setAssistanceTypes] = useState<string[]>([]);
  const [primaryCaregiverName, setPrimaryCaregiverName] = useState("");
  const [caregiverRelationship, setCaregiverRelationship] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");

  const [requiresCommunitySupport, setRequiresCommunitySupport] = useState(false);
  const [supportCategory, setSupportCategory] = useState("");
  const [supportStatus, setSupportStatus] = useState<SupportStatus>("ACTIVE");
  const [supportNotes, setSupportNotes] = useState("");

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

  const addSkill = () => {
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    if (!skillsList.includes(trimmed)) {
      setSkillsList((prev) => [...prev, trimmed]);
    }
    setNewSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setSkillsList((prev) => prev.filter((s) => s !== skill));
  };

  const toggleChronicCondition = (condition: string) => {
    setChronicConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition]
    );
  };

  const toggleAssistanceType = (type: string) => {
    setAssistanceTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const addEducationHistoryItem = () => {
    const deg = newEduDegree.trim();
    const inst = newEduInstitution.trim();
    const yr = newEduYear.trim();
    if (!deg && !inst && !newEduLevel) return;

    const newItem: EducationHistoryItem = {
      id: String(Date.now()),
      level: newEduLevel,
      degree: deg || undefined,
      institution: inst || undefined,
      year: yr || undefined
    };

    setEducationHistory((prev) => [...prev, newItem]);
    setNewEduDegree("");
    setNewEduInstitution("");
    setNewEduYear("");
    if (!educationLevel) {
      setEducationLevel(newEduLevel);
    }
  };

  const removeEducationHistoryItem = (id: string) => {
    setEducationHistory((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    if (open) {
      setError(null);
      setActiveTab("identity");
      if (editingMember) {
        const mv = getMemberValues(editingMember);
        setValues(mv);

        // Education & Employment
        const isStud = editingMember.employmentStatus === "STUDENT" || (mv.movementNotes && mv.movementNotes.includes("[Student]")) || (editingMember.occupation && editingMember.occupation.toLowerCase().startsWith("student"));
        setProfileType(isStud ? "STUDENT" : "WORKER");
        setEducationLevel(editingMember.educationLevel ?? "");
        setEducationDetails(editingMember.educationDetails ?? "");
        setInstitution(editingMember.institution ?? "");
        setEmploymentStatus(editingMember.employmentStatus ?? "");
        setJobTitle(editingMember.jobTitle ?? mv.occupation);
        setEmployerOrBusiness(editingMember.employerOrBusiness ?? "");
        setSkillsList(editingMember.skills ?? []);
        setIsJobSeeker(editingMember.isJobSeeker ?? false);

        let history: EducationHistoryItem[] = [];
        if (Array.isArray(editingMember.educationHistory)) {
          history = editingMember.educationHistory;
        } else if (editingMember.educationLevel || editingMember.educationDetails) {
          history = [
            {
              id: "primary",
              level: editingMember.educationLevel ?? "OTHER",
              degree: editingMember.educationDetails ?? "",
              institution: editingMember.institution ?? ""
            }
          ];
        }
        setEducationHistory(history);
        setNewEduLevel("SECONDARY_SSLC");
        setNewEduDegree("");
        setNewEduInstitution("");
        setNewEduYear("");

        // Health & Support
        const hp = editingMember.healthProfile;
        if (hp) {
          setHealthStatus(hp.status ?? "NO_KNOWN_CONDITION");
          setHasDisability(hp.hasDisability ?? false);
          setDisabilityType(hp.disabilityType ?? "");
          setDisabilityPercentage(hp.disabilityPercentage ? String(hp.disabilityPercentage) : "");
          setDisabilityCertificate(hp.disabilityCertificate ?? false);
          setDisabilityCertificateNo(hp.disabilityCertificateNo ?? "");

          setHasChronicIllness(hp.hasChronicIllness ?? false);
          setChronicConditions(hp.chronicConditions ?? []);
          setChronicDetails(hp.chronicDetails ?? "");
          setTreatmentRequired(hp.treatmentRequired ?? false);
          setRegularMedicationRequired(hp.regularMedicationRequired ?? false);

          setRequiresMentalHealthSupport(hp.requiresMentalHealthSupport ?? false);
          setMentalHealthSupportType(hp.mentalHealthSupportType ?? "");

          setRequiresAssistance(hp.requiresAssistance ?? false);
          setAssistanceTypes(hp.assistanceTypes ?? []);
          setPrimaryCaregiverName(hp.primaryCaregiverName ?? "");
          setCaregiverRelationship(hp.caregiverRelationship ?? "");
          setEmergencyContactName(hp.emergencyContactName ?? "");
          setEmergencyContactPhone(hp.emergencyContactPhone ?? "");

          setRequiresCommunitySupport(hp.requiresCommunitySupport ?? false);
          setSupportCategory(hp.supportCategory ?? "");
          setSupportStatus(hp.supportStatus ?? "ACTIVE");
          setSupportNotes(hp.supportNotes ?? "");
        } else {
          setHealthStatus("NO_KNOWN_CONDITION");
          setHasDisability(false);
          setDisabilityType("");
          setDisabilityPercentage("");
          setDisabilityCertificate(false);
          setDisabilityCertificateNo("");
          setHasChronicIllness(false);
          setChronicConditions([]);
          setChronicDetails("");
          setTreatmentRequired(false);
          setRegularMedicationRequired(false);
          setRequiresMentalHealthSupport(false);
          setMentalHealthSupportType("");
          setRequiresAssistance(false);
          setAssistanceTypes([]);
          setPrimaryCaregiverName("");
          setCaregiverRelationship("");
          setEmergencyContactName("");
          setEmergencyContactPhone("");
          setRequiresCommunitySupport(false);
          setSupportCategory("");
          setSupportStatus("ACTIVE");
          setSupportNotes("");
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
        setValues({
          ...EMPTY_FORM,
          familyId: defaultFamilyId || ""
        });
        setProfileType("WORKER");
        setEducationLevel("");
        setEducationDetails("");
        setInstitution("");
        setEmploymentStatus("");
        setJobTitle("");
        setEmployerOrBusiness("");
        setSkillsList([]);
        setIsJobSeeker(false);
        setEducationHistory([]);
        setNewEduLevel("SECONDARY_SSLC");
        setNewEduDegree("");
        setNewEduInstitution("");
        setNewEduYear("");

        setHealthStatus("NO_KNOWN_CONDITION");
        setHasDisability(false);
        setDisabilityType("");
        setDisabilityPercentage("");
        setDisabilityCertificate(false);
        setDisabilityCertificateNo("");
        setHasChronicIllness(false);
        setChronicConditions([]);
        setChronicDetails("");
        setTreatmentRequired(false);
        setRegularMedicationRequired(false);
        setRequiresMentalHealthSupport(false);
        setMentalHealthSupportType("");
        setRequiresAssistance(false);
        setAssistanceTypes([]);
        setPrimaryCaregiverName("");
        setCaregiverRelationship("");
        setEmergencyContactName("");
        setEmergencyContactPhone("");
        setRequiresCommunitySupport(false);
        setSupportCategory("");
        setSupportStatus("ACTIVE");
        setSupportNotes("");

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

    // Calculate final address
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
      occupation: profileType === "STUDENT"
        ? (institution.trim() ? `Student • ${institution.trim()}` : "Student")
        : (jobTitle.trim() || (employmentStatus ? employmentStatus : undefined) || (isEdit ? null : undefined)),
      idNumber: values.idNumber.trim() ? values.idNumber.trim() : isEdit ? null : undefined,
      relationToHead: values.relationToHead ? values.relationToHead : isEdit ? null : undefined,
      movementStatus: values.movementStatus,
      movementDate: values.movementDate ? values.movementDate : isEdit ? null : undefined,
      movementNotes: profileType === "STUDENT" ? "[Student]" : (values.movementNotes.trim() ? values.movementNotes.trim() : isEdit ? null : undefined),
      isYatheem: values.isYatheem,
      guardianName: values.isYatheem ? values.guardianName.trim() || null : isEdit ? null : undefined,
      guardianPhone: values.isYatheem ? values.guardianPhone.trim() || null : isEdit ? null : undefined,
      isExpatriate: values.isExpatriate,
      expatriateCountry: values.isExpatriate ? values.expatriateCountry.trim() || null : isEdit ? null : undefined,
      expatriateOccupation: values.isExpatriate ? values.expatriateOccupation.trim() || null : isEdit ? null : undefined,
      expatriateContact: values.isExpatriate ? values.expatriateContact.trim() || null : isEdit ? null : undefined,

      // Education & Employment
      educationLevel: educationLevel || undefined,
      educationDetails: educationDetails.trim() || undefined,
      institution: institution.trim() || undefined,
      employmentStatus: profileType === "STUDENT" ? "STUDENT" : (employmentStatus || undefined),
      jobTitle: profileType === "STUDENT" ? undefined : (jobTitle.trim() || undefined),
      employerOrBusiness: profileType === "STUDENT" ? undefined : (employerOrBusiness.trim() || undefined),
      skills: skillsList.length > 0 ? skillsList : undefined,
      isJobSeeker: profileType === "STUDENT" ? false : isJobSeeker,
      educationHistory: educationHistory.length > 0 ? educationHistory : undefined,

      // Health & Support Profile
      healthProfile: {
        status: healthStatus,
        hasDisability,
        disabilityType: hasDisability && disabilityType ? disabilityType : undefined,
        disabilityPercentage: hasDisability && disabilityPercentage ? parseInt(disabilityPercentage, 10) : undefined,
        disabilityCertificate: hasDisability ? disabilityCertificate : false,
        disabilityCertificateNo: hasDisability && disabilityCertificateNo.trim() ? disabilityCertificateNo.trim() : undefined,
        hasChronicIllness,
        chronicConditions: hasChronicIllness ? chronicConditions : [],
        chronicDetails: hasChronicIllness && chronicDetails.trim() ? chronicDetails.trim() : undefined,
        treatmentRequired: hasChronicIllness ? treatmentRequired : false,
        regularMedicationRequired: hasChronicIllness ? regularMedicationRequired : false,
        requiresMentalHealthSupport,
        mentalHealthSupportType: requiresMentalHealthSupport && mentalHealthSupportType ? mentalHealthSupportType : undefined,
        requiresAssistance,
        assistanceTypes: requiresAssistance ? assistanceTypes : [],
        primaryCaregiverName: requiresAssistance && primaryCaregiverName.trim() ? primaryCaregiverName.trim() : undefined,
        caregiverRelationship: requiresAssistance && caregiverRelationship.trim() ? caregiverRelationship.trim() : undefined,
        emergencyContactName: emergencyContactName.trim() || undefined,
        emergencyContactPhone: emergencyContactPhone.trim() || undefined,
        requiresCommunitySupport,
        supportCategory: requiresCommunitySupport && supportCategory ? supportCategory : undefined,
        supportStatus: requiresCommunitySupport ? supportStatus : "ACTIVE",
        supportNotes: requiresCommunitySupport && supportNotes.trim() ? supportNotes.trim() : undefined
      }
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
        <DialogContent className="w-[95vw] max-w-2xl sm:w-[740px] h-[660px] max-h-[92vh] flex flex-col p-0 overflow-hidden rounded-2xl">
          <DialogHeader className="p-5 pb-3 border-b border-border bg-muted/20 shrink-0">
            <DialogTitle>{editingMember ? "Edit Member Profile" : "Add New Member"}</DialogTitle>
          </DialogHeader>

          {/* Navigation Tabs */}
          <div className="flex items-center border-b border-border bg-muted/30 px-6 overflow-x-auto shrink-0 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("identity")}
              className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === "identity"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>1. Identity & Demographics</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("education")}
              className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === "education"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>2. Education & Work</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("health")}
              className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === "health"
                  ? "border-rose-500 text-rose-600 dark:text-rose-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <HeartPulse className="h-3.5 w-3.5" />
              <span>3. Health & Support</span>
              {healthStatus === "HAS_CONDITION" && (
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("address")}
              className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === "address"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>4. Address & Registers</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0" noValidate>
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium">
                  {error}
                </div>
              )}

              {/* TAB 1: IDENTITY & DEMOGRAPHICS */}
              {activeTab === "identity" && (
                <div className="space-y-4 animate-in fade-in-50 duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="sm:col-span-2">
                      <FormField label="Full Legal Name" htmlFor="member-name" required>
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

                  <div className="pt-2 border-t border-border">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">
                      Demographic Attributes
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                  </div>

                  <div className="pt-2 border-t border-border">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">
                      Identity & Primary Contact
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <FormField label="Primary Phone Number" htmlFor="member-phone">
                        <Input
                          id="member-phone"
                          leadingIcon={<Phone />}
                          placeholder="e.g. +91 98765 43210"
                          value={values.phone}
                          onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
                        />
                      </FormField>

                      <FormField label="Email Address" htmlFor="member-email">
                        <Input
                          id="member-email"
                          leadingIcon={<Mail />}
                          placeholder="e.g. name@example.com"
                          type="email"
                          value={values.email}
                          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                        />
                      </FormField>

                      <div className="sm:col-span-2">
                        <FormField label="National ID / Aadhaar" htmlFor="member-id-number">
                          <Input
                            id="member-id-number"
                            leadingIcon={<IdCard />}
                            placeholder="e.g. 12-digit Aadhaar number"
                            value={values.idNumber}
                            onChange={(e) => setValues((v) => ({ ...v, idNumber: e.target.value }))}
                          />
                        </FormField>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: EDUCATION & WORK */}
              {activeTab === "education" && (
                <div className="space-y-4 animate-in fade-in-50 duration-150">
                  {/* 1. Profile Classification: Student vs Worker / Adult */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-card border border-border shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        {profileType === "STUDENT" ? <School className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-foreground block">
                          Profile Classification
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {profileType === "STUDENT"
                            ? "Currently pursuing education / studies"
                            : "Working professional, business owner, homemaker, or job seeker"}
                        </span>
                      </div>
                    </div>

                    <div className="inline-flex rounded-lg border border-border p-1 bg-muted/40 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileType("STUDENT");
                          setEmploymentStatus("STUDENT");
                        }}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                          profileType === "STUDENT"
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <School className="h-3.5 w-3.5" />
                        <span>Student</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setProfileType("WORKER");
                          if (employmentStatus === "STUDENT") setEmploymentStatus("EMPLOYED");
                        }}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                          profileType === "WORKER"
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Briefcase className="h-3.5 w-3.5" />
                        <span>Worker / Adult</span>
                      </button>
                    </div>
                  </div>

                  {/* 2. Conditional Section: If Student -> Current Education Status */}
                  {profileType === "STUDENT" ? (
                    <div className="p-4 rounded-xl bg-muted/30 border border-border/80 space-y-3.5">
                      <div className="flex items-center gap-2">
                        <School className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Current Student Status & Institution
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <FormField
                          label="Current Course / Class / Standard"
                          htmlFor="member-student-course"
                        >
                          <Input
                            id="member-student-course"
                            placeholder="e.g. Plus Two Science, Class 10, B.Tech CS"
                            value={educationDetails}
                            onChange={(e) => setEducationDetails(e.target.value)}
                          />
                        </FormField>

                        <FormField
                          label="Current Institution / School / College"
                          htmlFor="member-student-inst"
                        >
                          <Input
                            id="member-student-inst"
                            placeholder="e.g. Farook College, Govt HSS"
                            value={institution}
                            onChange={(e) => setInstitution(e.target.value)}
                          />
                        </FormField>
                      </div>
                    </div>
                  ) : (
                    /* If Worker / Adult -> Employment & Job Details */
                    <div className="p-4 rounded-xl bg-muted/30 border border-border/80 space-y-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Employment & Workplace Details
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <FormField label="Employment Status" htmlFor="member-emp-status">
                          <Select
                            id="member-emp-status"
                            value={employmentStatus}
                            onChange={(e) => setEmploymentStatus(e.target.value)}
                          >
                            <option value="">Select Employment Status</option>
                            {EMPLOYMENT_STATUS_OPTIONS.filter((o) => o.value !== "STUDENT").map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </Select>
                        </FormField>

                        <FormField label="Job Title / Designation" htmlFor="member-job-title">
                          <Input
                            id="member-job-title"
                            placeholder="e.g. Accountant, Electrician, Driver, Merchant"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                          />
                        </FormField>

                        <div className="sm:col-span-2">
                          <FormField label="Employer / Company / Business Name" htmlFor="member-employer">
                            <Input
                              id="member-employer"
                              placeholder="e.g. Lulu Hypermarket, Self - Own Shop, Freelance"
                              value={employerOrBusiness}
                              onChange={(e) => setEmployerOrBusiness(e.target.value)}
                            />
                          </FormField>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-card shadow-xs cursor-pointer hover:bg-muted/40 transition-colors">
                            <input
                              type="checkbox"
                              checked={isJobSeeker}
                              onChange={(e) => setIsJobSeeker(e.target.checked)}
                              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                            />
                            <div>
                              <span className="text-xs font-semibold text-foreground block">
                                Actively Seeking Employment (Enroll in Mahallu Job Desk)
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
 {/* 4. Educational Background (Multiple records - Needed for BOTH) */}
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                            Educational Background & Qualifications
                          </span>

                        </div>
                      </div>
                    </div>

                    {/* Highest Level selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <FormField label="Highest Education Level" htmlFor="member-edu-level">
                        <Select
                          id="member-edu-level"
                          value={educationLevel}
                          onChange={(e) => setEducationLevel(e.target.value)}
                        >
                          <option value="">Select Highest Education Level</option>
                          {EDUCATION_LEVEL_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </Select>
                      </FormField>

                      {profileType === "WORKER" && (
                        <FormField label="Primary Qualification / Major" htmlFor="member-edu-details-primary">
                          <Input
                            id="member-edu-details-primary"
                            placeholder="e.g. B.Com, Plus Two Science, Alimiyya"
                            value={educationDetails}
                            onChange={(e) => setEducationDetails(e.target.value)}
                          />
                        </FormField>
                      )}
                    </div>

                    {/* Multiple Education Records List */}
                    <div className="pt-3 border-t border-border/60 space-y-3">
                      <span className="text-xs font-bold text-foreground block">
                        Multiple Education Background Entries ({educationHistory.length})
                      </span>

                      {/* Form to add a new qualification entry */}
                      <div className="p-3 rounded-xl border border-border bg-card space-y-3">
                        <span className="text-[11px] font-semibold text-muted-foreground block uppercase tracking-wider">
                          + Add Education Entry
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                          <FormField label="Level" htmlFor="new-edu-level">
                            <Select
                              id="new-edu-level"
                              value={newEduLevel}
                              onChange={(e) => setNewEduLevel(e.target.value)}
                            >
                              {EDUCATION_LEVEL_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </Select>
                          </FormField>

                          <FormField label="Degree / Course" htmlFor="new-edu-degree">
                            <Input
                              id="new-edu-degree"
                              placeholder="e.g. SSLC, Plus Two, B.Com"
                              value={newEduDegree}
                              onChange={(e) => setNewEduDegree(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addEducationHistoryItem();
                                }
                              }}
                            />
                          </FormField>

                          <FormField label="Institution / Board" htmlFor="new-edu-inst">
                            <Input
                              id="new-edu-inst"
                              placeholder="e.g. Govt HSS, Calicut Univ"
                              value={newEduInstitution}
                              onChange={(e) => setNewEduInstitution(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addEducationHistoryItem();
                                }
                              }}
                            />
                          </FormField>

                          <div className="flex items-end gap-2">
                            <div className="flex-1">
                              <FormField label="Year" htmlFor="new-edu-year">
                                <Input
                                  id="new-edu-year"
                                  placeholder="e.g. 2021"
                                  value={newEduYear}
                                  onChange={(e) => setNewEduYear(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      addEducationHistoryItem();
                                    }
                                  }}
                                />
                              </FormField>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              onClick={addEducationHistoryItem}
                              className="gap-1 flex-shrink-0 h-9"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>Add</span>
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Display added qualification cards */}
                      {educationHistory.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {educationHistory.map((item) => (
                            <div
                              key={item.id}
                              className="p-2.5 rounded-lg border border-border bg-background shadow-xs flex items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                                  <School className="h-3.5 w-3.5" />
                                </div>
                                <div className="min-w-0">
                                  <span className="text-xs font-semibold text-foreground block truncate">
                                    {item.degree || item.level?.replace("_", " ") || "Qualification"}
                                  </span>
                                  <span className="text-[11px] text-muted-foreground block truncate">
                                    {item.institution || item.level?.replace("_", " ")}
                                    {item.year ? ` • (${item.year})` : ""}
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeEducationHistoryItem(item.id)}
                                className="text-muted-foreground hover:text-destructive p-1 rounded-md text-sm font-bold leading-none flex-shrink-0 cursor-pointer"
                                title="Remove qualification"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* 3. Skills & Competencies (Needed for ALL: both student & worker/adult) */}
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/80 space-y-3">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                          Skills & Competencies
                        </span>

                      </div>
                    </div>

                    <FormField label="Add Skill" hint="Type skill and click Add or press Enter">
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g. Electrician, Driving, Plumbing, Coding, Graphic Design, Tuition/Teaching, Accounting"
                          value={newSkillInput}
                          onChange={(e) => setNewSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addSkill();
                            }
                          }}
                          className="flex-1"
                        />
                        <Button type="button" size="sm" variant="outline" onClick={addSkill} className="gap-1 flex-shrink-0">
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add</span>
                        </Button>
                      </div>
                    </FormField>

                    {/* Quick suggestion pills */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground mr-1">Suggestions:</span>
                      {["Driving", "Electrician", "Plumbing", "Accounting", "Teaching", "Coding", "Graphic Design", "Sales"].map((sugg) => (
                        <button
                          key={sugg}
                          type="button"
                          onClick={() => {
                            if (!skillsList.includes(sugg)) setSkillsList((prev) => [...prev, sugg]);
                          }}
                          className="px-2 py-0.5 rounded text-[11px] bg-background border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors cursor-pointer"
                        >
                          + {sugg}
                        </button>
                      ))}
                    </div>

                    {skillsList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/60">
                        {skillsList.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium border border-primary/20"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="hover:text-destructive text-primary/70 ml-0.5 font-bold cursor-pointer"
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

              {/* TAB 3: HEALTH & SUPPORT */}
              {activeTab === "health" && (
                <div className="space-y-4 animate-in fade-in-50 duration-150">
                  {/* Health Condition Status Banner */}
                  <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Health Condition Status
                      </span>
                      
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setHealthStatus("NO_KNOWN_CONDITION")}
                        className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                          healthStatus === "NO_KNOWN_CONDITION"
                            ? "border-emerald-600 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/30"
                            : "border-border bg-background hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        <span className="font-bold text-xs">No Known Condition</span>
                        <span className="text-[11px] opacity-80">Healthy / No chronic illness</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHealthStatus("HAS_CONDITION")}
                        className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                          healthStatus === "HAS_CONDITION"
                            ? "border-amber-600 bg-amber-500/10 text-amber-800 dark:text-amber-300 ring-2 ring-amber-500/30"
                            : "border-border bg-background hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        <span className="font-bold text-xs">Has Condition</span>
                        <span className="text-[11px] opacity-80">Chronic illness, disability, or care</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHealthStatus("NOT_DISCLOSED")}
                        className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                          healthStatus === "NOT_DISCLOSED"
                            ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/30"
                            : "border-border bg-background hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        <span className="font-bold text-xs">Not Disclosed</span>
                        <span className="text-[11px] opacity-80">Prefer not to disclose</span>
                      </button>
                    </div>
                  </div>

                  {healthStatus === "HAS_CONDITION" && (
                    <div className="space-y-4">
                      {/* Subsection A: Person with Disability */}
                      <div className="p-3.5 rounded-xl bg-background border border-border space-y-3">
                        <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                          <Checkbox
                            checked={hasDisability}
                            onChange={(e) => setHasDisability(e.target.checked)}
                          />
                          <span className="flex items-center gap-1.5 text-foreground">
                            <Accessibility className="h-4 w-4 text-rose-500" />
                            <span>Person with Disability (Divyangjan)</span>
                          </span>
                        </label>

                        {hasDisability && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 pl-6">
                            <FormField label="Disability Category">
                              <Select
                                value={disabilityType}
                                onChange={(e) => setDisabilityType(e.target.value)}
                              >
                                <option value="">Select Category</option>
                                {DISABILITY_TYPE_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </Select>
                            </FormField>

                            <FormField label="Disability Percentage (%)" hint="e.g. 40, 75">
                              <Input
                                type="number"
                                min="1"
                                max="100"
                                placeholder="Percentage %"
                                value={disabilityPercentage}
                                onChange={(e) => setDisabilityPercentage(e.target.value)}
                              />
                            </FormField>

                            <div className="sm:col-span-2 space-y-2 pt-1">
                              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer select-none">
                                <Checkbox
                                  checked={disabilityCertificate}
                                  onChange={(e) => setDisabilityCertificate(e.target.checked)}
                                />
                                <span>Disability Certificate Available</span>
                              </label>
                              {disabilityCertificate && (
                                <Input
                                  placeholder="Certificate / UDID Number"
                                  value={disabilityCertificateNo}
                                  onChange={(e) => setDisabilityCertificateNo(e.target.value)}
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Subsection B: Long-term / Chronic Illness */}
                      <div className="p-3.5 rounded-xl bg-background border border-border space-y-3">
                        <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                          <Checkbox
                            checked={hasChronicIllness}
                            onChange={(e) => setHasChronicIllness(e.target.checked)}
                          />
                          <span className="flex items-center gap-1.5 text-foreground">
                            <Activity className="h-4 w-4 text-rose-500" />
                            <span>Long-term / Chronic Illness</span>
                          </span>
                        </label>

                        {hasChronicIllness && (
                          <div className="space-y-3 pt-2 pl-6">
                            <div>
                              <span className="text-xs text-muted-foreground block mb-1.5">Condition Types (Select all that apply):</span>
                              <div className="flex flex-wrap gap-1.5">
                                {CHRONIC_CONDITION_OPTIONS.map((c) => (
                                  <button
                                    key={c}
                                    type="button"
                                    onClick={() => toggleChronicCondition(c)}
                                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                                      chronicConditions.includes(c)
                                        ? "bg-rose-500/10 text-rose-600 border-rose-500/30"
                                        : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
                                    }`}
                                  >
                                    <span>{c}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            <FormField label="Specific Diagnosis / Details" hint="e.g. Type 2 Diabetes on insulin, Stage 2 Dialysis">
                              <Input
                                placeholder="Condition notes or specific diagnosis"
                                value={chronicDetails}
                                onChange={(e) => setChronicDetails(e.target.value)}
                              />
                            </FormField>

                            <div className="flex flex-col sm:flex-row gap-3 pt-1">
                              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer select-none">
                                <Checkbox
                                  checked={treatmentRequired}
                                  onChange={(e) => setTreatmentRequired(e.target.checked)}
                                />
                                <span>Active Treatment Required</span>
                              </label>

                              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer select-none">
                                <Checkbox
                                  checked={regularMedicationRequired}
                                  onChange={(e) => setRegularMedicationRequired(e.target.checked)}
                                />
                                <span className="text-amber-700 dark:text-amber-400 font-semibold">
                                  Regular Medication Needed (Medicine Aid Eligible)
                                </span>
                              </label>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Subsection C: Care, Mobility & Assistance */}
                      <div className="p-3.5 rounded-xl bg-background border border-border space-y-3">
                        <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                          <Checkbox
                            checked={requiresAssistance}
                            onChange={(e) => setRequiresAssistance(e.target.checked)}
                          />
                          <span className="text-foreground font-semibold">
                            Requires Assistance (Bedridden / Elderly / Mobility)
                          </span>
                        </label>

                        {requiresAssistance && (
                          <div className="space-y-3 pt-2 pl-6">
                            <div>
                              <span className="text-xs text-muted-foreground block mb-1.5">Assistance Needed:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {ASSISTANCE_TYPE_OPTIONS.map((t) => (
                                  <button
                                    key={t}
                                    type="button"
                                    onClick={() => toggleAssistanceType(t)}
                                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                                      assistanceTypes.includes(t)
                                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
                                        : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
                                    }`}
                                  >
                                    <span>{t}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <FormField label="Primary Caregiver Name">
                                <Input
                                  placeholder="Name of person assisting"
                                  value={primaryCaregiverName}
                                  onChange={(e) => setPrimaryCaregiverName(e.target.value)}
                                />
                              </FormField>
                              <FormField label="Caregiver Relationship">
                                <Input
                                  placeholder="e.g. Spouse, Son, Daughter, Caretaker"
                                  value={caregiverRelationship}
                                  onChange={(e) => setCaregiverRelationship(e.target.value)}
                                />
                              </FormField>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              <FormField label="Emergency Contact Person">
                                <Input
                                  placeholder="Emergency contact name"
                                  value={emergencyContactName}
                                  onChange={(e) => setEmergencyContactName(e.target.value)}
                                />
                              </FormField>
                              <FormField label="Emergency Phone Number">
                                <Input
                                  placeholder="e.g. +91 98765 43210"
                                  value={emergencyContactPhone}
                                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                                />
                              </FormField>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Subsection D: Mental Health */}
                      <div className="p-3.5 rounded-xl bg-background border border-border space-y-3">
                        <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                          <Checkbox
                            checked={requiresMentalHealthSupport}
                            onChange={(e) => setRequiresMentalHealthSupport(e.target.checked)}
                          />
                          <span className="text-foreground">Mental Health & Counselling Support (Confidential)</span>
                        </label>

                        {requiresMentalHealthSupport && (
                          <div className="pt-2 pl-6">
                            <FormField label="Support Type Required">
                              <Select
                                value={mentalHealthSupportType}
                                onChange={(e) => setMentalHealthSupportType(e.target.value)}
                              >
                                <option value="">Select Support Type</option>
                                <option value="Medical">Medical / Psychiatric Treatment</option>
                                <option value="Counselling">Professional Counselling</option>
                                <option value="Family Support">Family Mediation & Support</option>
                                <option value="Community Support">Mahallu Community Care</option>
                                <option value="Other">Other</option>
                              </Select>
                            </FormField>
                          </div>
                        )}
                      </div>

                      {/* Subsection E: Mahallu Community Welfare Support */}
                      <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-3">
                        <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                          <Checkbox
                            checked={requiresCommunitySupport}
                            onChange={(e) => setRequiresCommunitySupport(e.target.checked)}
                          />
                          <span className="text-rose-600 font-bold">Enroll in Mahallu Community Welfare Support</span>
                        </label>

                        {requiresCommunitySupport && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 pl-6">
                            <FormField label="Support Category">
                              <Select
                                value={supportCategory}
                                onChange={(e) => setSupportCategory(e.target.value)}
                              >
                                <option value="">Select Welfare Category</option>
                                {SUPPORT_CATEGORY_OPTIONS.map((cat) => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </Select>
                            </FormField>

                            <FormField label="Support Status">
                              <Select
                                value={supportStatus}
                                onChange={(e) => setSupportStatus(e.target.value as SupportStatus)}
                              >
                                <option value="ACTIVE">Active (Needs Continuous Care)</option>
                                <option value="MONITORING">Monitoring (Periodic Follow-up)</option>
                                <option value="RESOLVED">Resolved / Completed</option>
                              </Select>
                            </FormField>

                            <div className="sm:col-span-2">
                              <FormField label="Welfare Committee Notes">
                                <Textarea
                                  placeholder="Confidential notes for the Mahallu welfare committee / relief desk..."
                                  value={supportNotes}
                                  onChange={(e) => setSupportNotes(e.target.value)}
                                  rows={2}
                                />
                              </FormField>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: ADDRESS & REGISTERS */}
              {activeTab === "address" && (
                <div className="space-y-4 animate-in fade-in-50 duration-150">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Residential Address
                      </span>

                      <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                        <Checkbox
                          checked={useFamilyAddress}
                          onChange={(e) => handleToggleFamilyAddress(e.target.checked)}
                        />
                        <span>Use Linked Family Address</span>
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
                      <div className="p-3.5 rounded-xl bg-muted/30 border border-border/80 space-y-3">
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

                          <FormField label="Post Office" htmlFor="m-post">
                            <Input
                              id="m-post"
                              placeholder="Post Office"
                              value={post}
                              onChange={(e) => setPost(e.target.value)}
                            />
                          </FormField>

                          <FormField label="State" htmlFor="m-state">
                            <SearchableSelect
                              id="m-state"
                              placeholder="Select State"
                              searchPlaceholder="Search state..."
                              value={state}
                              onChange={(val) => setState(val)}
                              options={STATE_OPTIONS}
                              allowCustom
                            />
                          </FormField>

                          <FormField label="District" htmlFor="m-district">
                            <SearchableSelect
                              id="m-district"
                              placeholder="Select District"
                              searchPlaceholder="Search district..."
                              value={district}
                              onChange={(val) => setDistrict(val)}
                              options={getDistrictOptions(state)}
                              allowCustom
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

                  <div className="pt-2 border-t border-border space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                      Residency & Movement
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
                  </div>

                  <div className="pt-2 border-t border-border space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                      Special Welfare Registers
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              )}
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
                  <span>Delete</span>
                </Button>
              ) : (
                <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
              )}

              <div className="flex items-center gap-2">
                {activeTab !== "identity" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (activeTab === "address") setActiveTab("health");
                      else if (activeTab === "health") setActiveTab("education");
                      else if (activeTab === "education") setActiveTab("identity");
                    }}
                  >
                    Back
                  </Button>
                )}

                {activeTab !== "address" ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (activeTab === "identity") {
                        if (!values.fullName.trim()) {
                          setError("Member full name is required.");
                          return;
                        }
                        setError(null);
                        setActiveTab("education");
                      } else if (activeTab === "education") {
                        setActiveTab("health");
                      } else if (activeTab === "health") {
                        setActiveTab("address");
                      }
                    }}
                  >
                    Next
                  </Button>
                ) : null}

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
