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
  Textarea,
  Plus,
  Trash,
  Home,
  User,
  Users,
  School,
  Building,
  Phone,
  Mail,
  MapPin,
  IdCard,
  Heart,
  HeartPulse,
  Briefcase,
  GraduationCap,
  Accessibility,
  Activity,
  ShieldAlert,
  Checkbox,
  X,
  SearchableSelect,
  useToast
} from "@mahalle/ui";
import { STATE_OPTIONS, getDistrictOptions } from "@/lib/location-data";
import { apiClient, ApiError } from "@/lib/api-client";
import type { House } from "@/lib/houses";
import type { EducationHistoryItem } from "@/lib/members";
import type { Division, FamilyStatus } from "@/lib/structure";
import {
  RELATION_TO_HEAD_LABELS,
  BLOOD_GROUP_LABELS
} from "@/lib/member-constants";
import {
  EDUCATION_LEVEL_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  DISABILITY_TYPE_OPTIONS,
  CHRONIC_CONDITION_OPTIONS,
  ASSISTANCE_TYPE_OPTIONS,
  SUPPORT_CATEGORY_OPTIONS
} from "./member-form-dialog";

interface MemberListItem {
  id: string;
  fullName: string;
  relationToHead: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  idType: string;
  idNumber: string;

  // Profile classification
  profileType: "WORKER" | "STUDENT";

  // Education & Work
  educationLevel: string;
  educationDetails: string;
  institution: string;
  employmentStatus: string;
  jobTitle: string;
  employerOrBusiness: string;
  isJobSeeker: boolean;
  skills: string[];

  // Multiple Education History
  educationHistory: EducationHistoryItem[];
  newEduLevel?: string;
  newEduDegree?: string;
  newEduInstitution?: string;
  newEduYear?: string;
  newSkillInput?: string;

  // Health
  healthStatus: "NO_KNOWN_CONDITION" | "HAS_CONDITION" | "NOT_DISCLOSED";
  hasDisability: boolean;
  disabilityType: string;
  hasChronicIllness: boolean;
  chronicConditions: string[];
  regularMedicationRequired: boolean;
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

  // Family Status Division
  const [familyStatuses, setFamilyStatuses] = useState<FamilyStatus[]>([]);
  const [hasFamilyStatuses, setHasFamilyStatuses] = useState(false);
  const [familyStatusTerm, setFamilyStatusTerm] = useState("Category");
  const [familyStatusId, setFamilyStatusId] = useState("");

  // Form Section 1: Location & Housing
  const [wardId, setWardId] = useState(defaultDivisionId ?? "");
  const [municipalHouseNumber, setMunicipalHouseNumber] = useState("");
  const [mahallHouseNumber, setMahallHouseNumber] = useState("");
  const [houseName, setHouseName] = useState("");
  const [place, setPlace] = useState("");
  const [post, setPost] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("Kerala");
  const [pin, setPin] = useState("");
  const [localBodyType, setLocalBodyType] = useState("Grama Panchayath");
  const [localBodyName, setLocalBodyName] = useState("");

  // Household Emergency & Welfare
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [requiresCommunitySupport, setRequiresCommunitySupport] = useState(false);
  const [supportCategory, setSupportCategory] = useState("");
  const [supportStatus, setSupportStatus] = useState<"ACTIVE" | "MONITORING" | "RESOLVED">("ACTIVE");
  const [supportNotes, setSupportNotes] = useState("");

  // Form Section 2: Applicant / Househead details
  const [applicantName, setApplicantName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("MALE");
  const [bloodGroup, setBloodGroup] = useState("");
  const [familyCategory, setFamilyCategory] = useState("General");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [idType, setIdType] = useState("Aadhaar Card");
  const [idNumber, setIdNumber] = useState("");

  // Applicant Profile Classification: Student vs Worker/Adult
  const [applicantProfileType, setApplicantProfileType] = useState<"WORKER" | "STUDENT">("WORKER");
  const [applicantEducationLevel, setApplicantEducationLevel] = useState("");
  const [applicantEducationDetails, setApplicantEducationDetails] = useState("");
  const [applicantInstitution, setApplicantInstitution] = useState("");
  const [applicantEmploymentStatus, setApplicantEmploymentStatus] = useState("");
  const [applicantJobTitle, setApplicantJobTitle] = useState("");
  const [applicantEmployerOrBusiness, setApplicantEmployerOrBusiness] = useState("");
  const [applicantSkills, setApplicantSkills] = useState<string[]>([]);
  const [newApplicantSkill, setNewApplicantSkill] = useState("");
  const [applicantIsJobSeeker, setApplicantIsJobSeeker] = useState(false);

  // Applicant Multiple Education History
  const [applicantEducationHistory, setApplicantEducationHistory] = useState<EducationHistoryItem[]>([]);
  const [newAppEduLevel, setNewAppEduLevel] = useState("SECONDARY_SSLC");
  const [newAppEduDegree, setNewAppEduDegree] = useState("");
  const [newAppEduInstitution, setNewAppEduInstitution] = useState("");
  const [newAppEduYear, setNewAppEduYear] = useState("");

  // Applicant Health & Support (Privacy-sensitive)
  const [applicantHealthStatus, setApplicantHealthStatus] = useState<"NO_KNOWN_CONDITION" | "HAS_CONDITION" | "NOT_DISCLOSED">("NO_KNOWN_CONDITION");
  const [applicantHasDisability, setApplicantHasDisability] = useState(false);
  const [applicantDisabilityType, setApplicantDisabilityType] = useState("");
  const [applicantDisabilityPercentage, setApplicantDisabilityPercentage] = useState("");
  const [applicantDisabilityCertificate, setApplicantDisabilityCertificate] = useState(false);
  const [applicantDisabilityCertificateNo, setApplicantDisabilityCertificateNo] = useState("");

  const [applicantHasChronicIllness, setApplicantHasChronicIllness] = useState(false);
  const [applicantChronicConditions, setApplicantChronicConditions] = useState<string[]>([]);
  const [applicantChronicDetails, setApplicantChronicDetails] = useState("");
  const [applicantTreatmentRequired, setApplicantTreatmentRequired] = useState(false);
  const [applicantRegularMedicationRequired, setApplicantRegularMedicationRequired] = useState(false);
  const [applicantRequiresMentalHealthSupport, setApplicantRequiresMentalHealthSupport] = useState(false);
  const [applicantMentalHealthSupportType, setApplicantMentalHealthSupportType] = useState("");
  const [applicantRequiresAssistance, setApplicantRequiresAssistance] = useState(false);
  const [applicantAssistanceTypes, setApplicantAssistanceTypes] = useState<string[]>([]);
  const [applicantPrimaryCaregiverName, setApplicantPrimaryCaregiverName] = useState("");
  const [applicantCaregiverRelationship, setApplicantCaregiverRelationship] = useState("");
  const [applicantEmergencyContactName, setApplicantEmergencyContactName] = useState("");
  const [applicantEmergencyContactPhone, setApplicantEmergencyContactPhone] = useState("");
  const [applicantRequiresCommunitySupport, setApplicantRequiresCommunitySupport] = useState(false);
  const [applicantSupportCategory, setApplicantSupportCategory] = useState("");
  const [applicantSupportStatus, setApplicantSupportStatus] = useState<"ACTIVE" | "MONITORING" | "RESOLVED">("ACTIVE");
  const [applicantSupportNotes, setApplicantSupportNotes] = useState("");

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
      setActiveTab("location");
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
            const active = res.familyStatuses.filter((s) => s.isActive);
            if (active.length > 0) {
              setFamilyStatusId((prev) => prev || active[0].id);
              setFamilyCategory((prev) => (prev === "General" ? active[0].name : prev));
            }
          }
        })
        .catch(() => {
          // ignore if structure endpoint is unavailable
        });
    }
  }, [open, slug, defaultDivisionId]);

  // Applicant Skills
  const addApplicantSkill = (skillToAdd?: string) => {
    const trimmed = (skillToAdd || newApplicantSkill).trim();
    if (trimmed && !applicantSkills.includes(trimmed)) {
      setApplicantSkills((prev) => [...prev, trimmed]);
    }
    if (!skillToAdd) setNewApplicantSkill("");
  };

  const removeApplicantSkill = (skill: string) => {
    setApplicantSkills((prev) => prev.filter((s) => s !== skill));
  };

  // Applicant Education History
  const addApplicantEducationItem = () => {
    const deg = newAppEduDegree.trim();
    const inst = newAppEduInstitution.trim();
    const yr = newAppEduYear.trim();
    if (!deg && !inst && !newAppEduLevel) return;

    const item: EducationHistoryItem = {
      id: String(Date.now()),
      level: newAppEduLevel,
      degree: deg || undefined,
      institution: inst || undefined,
      year: yr || undefined
    };

    setApplicantEducationHistory((prev) => [...prev, item]);
    setNewAppEduDegree("");
    setNewAppEduInstitution("");
    setNewAppEduYear("");
    if (!applicantEducationLevel) {
      setApplicantEducationLevel(newAppEduLevel);
    }
  };

  const removeApplicantEducationItem = (id: string) => {
    setApplicantEducationHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleApplicantChronicCondition = (condition: string) => {
    setApplicantChronicConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition]
    );
  };

  const toggleApplicantAssistanceType = (t: string) => {
    setApplicantAssistanceTypes((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  // Member roster methods
  const addMemberRow = () => {
    setMemberList((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        fullName: "",
        relationToHead: "SPOUSE",
        gender: "FEMALE",
        dateOfBirth: "",
        phone: "",
        idType: "Aadhaar Card",
        idNumber: "",
        profileType: "WORKER",
        educationLevel: "",
        educationDetails: "",
        institution: "",
        employmentStatus: "",
        jobTitle: "",
        employerOrBusiness: "",
        isJobSeeker: false,
        skills: [],
        educationHistory: [],
        newEduLevel: "SECONDARY_SSLC",
        newEduDegree: "",
        newEduInstitution: "",
        newEduYear: "",
        newSkillInput: "",
        healthStatus: "NO_KNOWN_CONDITION",
        hasDisability: false,
        disabilityType: "",
        hasChronicIllness: false,
        chronicConditions: [],
        regularMedicationRequired: false
      }
    ]);
  };

  const updateMemberRow = (id: string, field: keyof MemberListItem, value: any) => {
    setMemberList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const addMemberSkill = (memberId: string, skillName?: string) => {
    setMemberList((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m;
        const toAdd = (skillName || m.newSkillInput || "").trim();
        if (!toAdd || (m.skills || []).includes(toAdd)) return m;
        return {
          ...m,
          skills: [...(m.skills || []), toAdd],
          newSkillInput: skillName ? m.newSkillInput : ""
        };
      })
    );
  };

  const removeMemberSkill = (memberId: string, skillToRemove: string) => {
    setMemberList((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m;
        return {
          ...m,
          skills: (m.skills || []).filter((s) => s !== skillToRemove)
        };
      })
    );
  };

  const addMemberEducationItem = (memberId: string) => {
    setMemberList((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m;
        const deg = (m.newEduDegree || "").trim();
        const inst = (m.newEduInstitution || "").trim();
        const yr = (m.newEduYear || "").trim();
        const lvl = m.newEduLevel || "SECONDARY_SSLC";
        if (!deg && !inst && !lvl) return m;

        const item: EducationHistoryItem = {
          id: String(Date.now()),
          level: lvl,
          degree: deg || undefined,
          institution: inst || undefined,
          year: yr || undefined
        };

        return {
          ...m,
          educationHistory: [...(m.educationHistory || []), item],
          educationLevel: m.educationLevel || lvl,
          newEduDegree: "",
          newEduInstitution: "",
          newEduYear: ""
        };
      })
    );
  };

  const removeMemberEducationItem = (memberId: string, eduId: string) => {
    setMemberList((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m;
        return {
          ...m,
          educationHistory: (m.educationHistory || []).filter((e) => e.id !== eduId)
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
    setMunicipalHouseNumber("");
    setMahallHouseNumber("");
    setHouseName("");
    setPlace("");
    setPost("");
    setDistrict("");
    setState("Kerala");
    setPin("");
    setLocalBodyType("Grama Panchayath");
    setLocalBodyName("");

    setEmergencyContactName("");
    setEmergencyContactPhone("");
    setRequiresCommunitySupport(false);
    setSupportCategory("");
    setSupportStatus("ACTIVE");
    setSupportNotes("");

    setApplicantName("");
    setFatherName("");
    setDateOfBirth("");
    setGender("MALE");
    setBloodGroup("");
    setFamilyCategory("General");
    setPhone("");
    setEmail("");
    setIdType("Aadhaar Card");
    setIdNumber("");

    setApplicantProfileType("WORKER");
    setApplicantEducationLevel("");
    setApplicantEducationDetails("");
    setApplicantInstitution("");
    setApplicantEmploymentStatus("");
    setApplicantJobTitle("");
    setApplicantEmployerOrBusiness("");
    setApplicantSkills([]);
    setNewApplicantSkill("");
    setApplicantIsJobSeeker(false);
    setApplicantEducationHistory([]);
    setNewAppEduLevel("SECONDARY_SSLC");
    setNewAppEduDegree("");
    setNewAppEduInstitution("");
    setNewAppEduYear("");

    setApplicantHealthStatus("NO_KNOWN_CONDITION");
    setApplicantHasDisability(false);
    setApplicantDisabilityType("");
    setApplicantDisabilityPercentage("");
    setApplicantDisabilityCertificate(false);
    setApplicantDisabilityCertificateNo("");

    setApplicantHasChronicIllness(false);
    setApplicantChronicConditions([]);
    setApplicantChronicDetails("");
    setApplicantTreatmentRequired(false);
    setApplicantRegularMedicationRequired(false);
    setApplicantRequiresMentalHealthSupport(false);
    setApplicantMentalHealthSupportType("");
    setApplicantRequiresAssistance(false);
    setApplicantAssistanceTypes([]);
    setApplicantPrimaryCaregiverName("");
    setApplicantCaregiverRelationship("");
    setApplicantEmergencyContactName("");
    setApplicantEmergencyContactPhone("");
    setApplicantRequiresCommunitySupport(false);
    setApplicantSupportCategory("");
    setApplicantSupportStatus("ACTIVE");
    setApplicantSupportNotes("");

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
          familyStatusId: hasFamilyStatuses && familyStatusId ? familyStatusId : null,
          category: hasFamilyStatuses && familyCategory ? familyCategory : null,
          notes: notes || null,
          emergencyContactName: emergencyContactName.trim() || null,
          emergencyContactPhone: emergencyContactPhone.trim() || null,
          requiresCommunitySupport,
          supportCategory: requiresCommunitySupport ? supportCategory.trim() || null : null,
          supportStatus: requiresCommunitySupport ? supportStatus : null,
          supportNotes: requiresCommunitySupport ? supportNotes.trim() || null : null
        }
      );

      const createdFamilyId = familyRes?.family?.id;

      if (!createdFamilyId) {
        throw new Error("Failed to initialize family record.");
      }

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
        idNumber: idNumber.trim() ? `${idType}: ${idNumber.trim()}` : undefined,
        address: fullAddress || undefined,
        occupation: applicantProfileType === "STUDENT"
          ? (applicantInstitution.trim() ? `Student • ${applicantInstitution.trim()}` : "Student")
          : (applicantJobTitle.trim() || (applicantEmploymentStatus ? applicantEmploymentStatus : undefined)),
        movementNotes: applicantProfileType === "STUDENT" ? "[Student]" : undefined,

        // Education & Employment
        educationLevel: applicantEducationLevel || undefined,
        educationDetails: applicantEducationDetails.trim() || undefined,
        institution: applicantInstitution.trim() || undefined,
        employmentStatus: applicantProfileType === "STUDENT" ? "STUDENT" : (applicantEmploymentStatus || undefined),
        jobTitle: applicantProfileType === "STUDENT" ? undefined : (applicantJobTitle.trim() || undefined),
        employerOrBusiness: applicantProfileType === "STUDENT" ? undefined : (applicantEmployerOrBusiness.trim() || undefined),
        skills: applicantSkills.length > 0 ? applicantSkills : undefined,
        isJobSeeker: applicantProfileType === "STUDENT" ? false : applicantIsJobSeeker,
        educationHistory: applicantEducationHistory.length > 0 ? applicantEducationHistory : undefined,

        // Health & Support Profile
        healthProfile: {
          status: applicantHealthStatus,
          hasDisability: applicantHasDisability,
          disabilityType: applicantHasDisability && applicantDisabilityType ? applicantDisabilityType : undefined,
          disabilityPercentage: applicantHasDisability && applicantDisabilityPercentage ? parseInt(applicantDisabilityPercentage, 10) : undefined,
          disabilityCertificate: applicantHasDisability ? applicantDisabilityCertificate : false,
          disabilityCertificateNo: applicantHasDisability && applicantDisabilityCertificateNo.trim() ? applicantDisabilityCertificateNo.trim() : undefined,
          hasChronicIllness: applicantHasChronicIllness,
          chronicConditions: applicantHasChronicIllness ? applicantChronicConditions : [],
          chronicDetails: applicantHasChronicIllness && applicantChronicDetails.trim() ? applicantChronicDetails.trim() : undefined,
          treatmentRequired: applicantHasChronicIllness ? applicantTreatmentRequired : false,
          regularMedicationRequired: applicantHasChronicIllness ? applicantRegularMedicationRequired : false,
          requiresMentalHealthSupport: applicantRequiresMentalHealthSupport,
          mentalHealthSupportType: applicantRequiresMentalHealthSupport && applicantMentalHealthSupportType ? applicantMentalHealthSupportType : undefined,
          requiresAssistance: applicantRequiresAssistance,
          assistanceTypes: applicantRequiresAssistance ? applicantAssistanceTypes : [],
          primaryCaregiverName: applicantRequiresAssistance && applicantPrimaryCaregiverName.trim() ? applicantPrimaryCaregiverName.trim() : undefined,
          caregiverRelationship: applicantRequiresAssistance && applicantCaregiverRelationship.trim() ? applicantCaregiverRelationship.trim() : undefined,
          emergencyContactName: (applicantRequiresAssistance && applicantEmergencyContactName.trim()) || emergencyContactName.trim() || undefined,
          emergencyContactPhone: (applicantRequiresAssistance && applicantEmergencyContactPhone.trim()) || emergencyContactPhone.trim() || undefined,
          requiresCommunitySupport: applicantRequiresCommunitySupport,
          supportCategory: applicantRequiresCommunitySupport && applicantSupportCategory ? applicantSupportCategory : undefined,
          supportStatus: applicantRequiresCommunitySupport && applicantSupportStatus ? applicantSupportStatus : "ACTIVE",
          supportNotes: applicantRequiresCommunitySupport && applicantSupportNotes.trim() ? applicantSupportNotes.trim() : undefined
        }
      });

      // 5. Create each listed family member
      for (const m of memberList) {
        if (!m.fullName.trim()) continue;

        await apiClient.post(`/tenants/${slug}/members`, {
          fullName: m.fullName.trim(),
          familyId: createdFamilyId,
          relationToHead: m.relationToHead || "OTHER",
          gender: m.gender || undefined,
          dateOfBirth: m.dateOfBirth || undefined,
          phone: m.phone.trim() || undefined,
          idNumber: m.idNumber.trim() ? `${m.idType}: ${m.idNumber.trim()}` : undefined,
          address: fullAddress || undefined,
          occupation: m.profileType === "STUDENT"
            ? (m.institution.trim() ? `Student • ${m.institution.trim()}` : "Student")
            : (m.jobTitle.trim() || (m.employmentStatus ? m.employmentStatus : undefined)),
          movementNotes: m.profileType === "STUDENT" ? "[Student]" : undefined,

          // Education & Employment
          educationLevel: m.educationLevel || undefined,
          educationDetails: m.educationDetails.trim() || undefined,
          institution: m.institution.trim() || undefined,
          employmentStatus: m.profileType === "STUDENT" ? "STUDENT" : (m.employmentStatus || undefined),
          jobTitle: m.profileType === "STUDENT" ? undefined : (m.jobTitle.trim() || undefined),
          employerOrBusiness: m.profileType === "STUDENT" ? undefined : (m.employerOrBusiness.trim() || undefined),
          skills: (m.skills || []).length > 0 ? m.skills : undefined,
          isJobSeeker: m.profileType === "STUDENT" ? false : m.isJobSeeker,
          educationHistory: (m.educationHistory || []).length > 0 ? m.educationHistory : undefined,

          // Health Profile
          healthProfile: {
            status: m.healthStatus,
            hasDisability: m.hasDisability,
            disabilityType: m.hasDisability && m.disabilityType ? m.disabilityType : undefined,
            hasChronicIllness: m.hasChronicIllness,
            chronicConditions: m.chronicConditions,
            regularMedicationRequired: m.regularMedicationRequired
          }
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
      <DialogContent className="w-[95vw] max-w-3xl sm:w-[780px] h-[700px] max-h-[92vh] flex flex-col p-0 overflow-hidden rounded-2xl shadow-xl">
        <DialogHeader className="p-5 pb-3 border-b border-border bg-muted/20 shrink-0">
          <DialogTitle className="text-xl font-bold">Register New Family</DialogTitle>

        </DialogHeader>

        {/* Step Tabs Bar */}
        <div className="flex items-center border-b border-border bg-muted/30 px-5 text-xs font-semibold shrink-0 gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("location")}
            className={`py-2.5 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === "location"
                ? "border-primary text-primary font-bold bg-background/60 rounded-t-md"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            <span>1. Location & Housing</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("applicant")}
            className={`py-2.5 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === "applicant"
                ? "border-primary text-primary font-bold bg-background/60 rounded-t-md"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>2. Househead (Applicant)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("members")}
            className={`py-2.5 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === "members"
                ? "border-primary text-primary font-bold bg-background/60 rounded-t-md"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>3. Family Members</span>
            {memberList.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-primary text-primary-foreground rounded-full text-[10px] font-bold">
                {memberList.length}
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

            {/* TAB 1: LOCATION & HOUSING & WELFARE */}
            {activeTab === "location" && (
              <div className="space-y-4 animate-in fade-in-50 duration-150">
                {/* Division / Ward Selector */}
                {hasDivisions && (
                  <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 flex flex-col gap-2">
                    <FormField
                      label={`Select ${divisionTerm}`}
                      htmlFor="ward-select"
                      hint={`Household's ${divisionTerm.toLowerCase()} jurisdiction`}
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

                {/* House Numbers & Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                    <FormField label="House Name" htmlFor="house-name">
                      <Input
                        id="house-name"
                        leadingIcon={<Home className="h-4 w-4 text-muted-foreground" />}
                        placeholder="e.g. Baitul Noor, Al-Falah"
                        value={houseName}
                        onChange={(e) => setHouseName(e.target.value)}
                      />
                    </FormField>
                  </div>
                </div>

                {/* Detailed Address Breakdown */}
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
                      <FormField label="State" htmlFor="state">
                        <SearchableSelect
                          id="state"
                          placeholder="Select State"
                          searchPlaceholder="Search state..."
                          value={state}
                          onChange={(val) => setState(val)}
                          options={STATE_OPTIONS}
                          allowCustom
                        />
                      </FormField>
                    </div>

                    <div className="col-span-2">
                      <FormField label="District" htmlFor="district">
                        <SearchableSelect
                          id="district"
                          placeholder="Select District"
                          searchPlaceholder="Search district..."
                          value={district}
                          onChange={(val) => setDistrict(val)}
                          options={getDistrictOptions(state)}
                          allowCustom
                        />
                      </FormField>
                    </div>

                    <div className="col-span-2">
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

                {/* Emergency Contact */}
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Household Emergency Contact
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField label="Emergency Contact Person" htmlFor="family-emer-name">
                      <Input
                        id="family-emer-name"
                        placeholder="e.g. Relative or Neighbor"
                        value={emergencyContactName}
                        onChange={(e) => setEmergencyContactName(e.target.value)}
                      />
                    </FormField>
                    <FormField label="Emergency Phone" htmlFor="family-emer-phone">
                      <Input
                        id="family-emer-phone"
                        leadingIcon={<Phone className="h-4 w-4 text-muted-foreground" />}
                        placeholder="+91 98765 43210"
                        value={emergencyContactPhone}
                        onChange={(e) => setEmergencyContactPhone(e.target.value)}
                      />
                    </FormField>
                  </div>
                </div>

                {/* Mahallu Community Welfare Support */}
                <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-rose-600" />
                      <div>
                        <span className="text-sm font-semibold text-foreground block">
                          Mahallu Community Welfare Support
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Mark if this household requires regular community welfare aid or monitoring.
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
                          rows={2}
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

            {/* TAB 2: APPLICANT / HOUSEHEAD */}
            {activeTab === "applicant" && (
              <div className="space-y-5 animate-in fade-in-50 duration-150">
                {/* 1. Identity & Demographics */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      1. Applicant Identity & Demographics
                    </span>
                  </div>

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
                        {Object.entries(BLOOD_GROUP_LABELS).map(([bg, label]) => (
                          <option key={bg} value={bg}>
                            {label}
                          </option>
                        ))}
                      </Select>
                    </FormField>

                    {hasFamilyStatuses && (
                      <FormField label={`Family ${familyStatusTerm}`} htmlFor="family-category">
                        <Select
                          id="family-category"
                          value={familyStatusId}
                          onChange={(e) => {
                            const selId = e.target.value;
                            setFamilyStatusId(selId);
                            const found = familyStatuses.find((s) => s.id === selId);
                            if (found) setFamilyCategory(found.name);
                            else setFamilyCategory("");
                          }}
                        >
                          <option value="">-- Select {familyStatusTerm} --</option>
                          {familyStatuses
                            .filter((s) => s.isActive)
                            .map((st) => (
                              <option key={st.id} value={st.id}>
                                {st.name} {st.code ? `(${st.code})` : ""}
                              </option>
                            ))}
                        </Select>
                      </FormField>
                    )}

                    <FormField label="Mobile Phone" htmlFor="applicant-phone" required>
                      <Input
                        id="applicant-phone"
                        required
                        leadingIcon={<Phone className="h-4 w-4 text-muted-foreground" />}
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </FormField>

                    <FormField label="Email Address" htmlFor="applicant-email">
                      <Input
                        id="applicant-email"
                        type="email"
                        leadingIcon={<Mail className="h-4 w-4 text-muted-foreground" />}
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

                    <div className="sm:col-span-2">
                      <FormField label="ID Number" htmlFor="applicant-id-num">
                        <Input
                          id="applicant-id-num"
                          leadingIcon={<IdCard className="h-4 w-4 text-muted-foreground" />}
                          placeholder="Enter ID / card number"
                          value={idNumber}
                          onChange={(e) => setIdNumber(e.target.value)}
                        />
                      </FormField>
                    </div>
                  </div>
                </div>

                {/* 2. Education & Employment */}
                <div className="space-y-4 pt-3 border-t border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-card border border-border shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        {applicantProfileType === "STUDENT" ? <School className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-foreground block">
                          Applicant Activity Classification
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {applicantProfileType === "STUDENT"
                            ? "Applicant is currently pursuing education / studies"
                            : "Applicant is working, self-employed, in business, or job seeker"}
                        </span>
                      </div>
                    </div>

                    <div className="inline-flex rounded-lg border border-border p-1 bg-muted/40 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setApplicantProfileType("STUDENT");
                          setApplicantEmploymentStatus("STUDENT");
                        }}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                          applicantProfileType === "STUDENT"
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
                          setApplicantProfileType("WORKER");
                          if (applicantEmploymentStatus === "STUDENT") setApplicantEmploymentStatus("EMPLOYED");
                        }}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                          applicantProfileType === "WORKER"
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Briefcase className="h-3.5 w-3.5" />
                        <span>Worker / Adult</span>
                      </button>
                    </div>
                  </div>

                  {/* Student vs Worker fields */}
                  {applicantProfileType === "STUDENT" ? (
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
                          htmlFor="applicant-student-course"
                          hint="e.g. Plus Two Science, Class 10, B.Tech CS (3rd Sem), Alimiyya"
                        >
                          <Input
                            id="applicant-student-course"
                            placeholder="e.g. Plus Two Science, Class 10, B.Com"
                            value={applicantEducationDetails}
                            onChange={(e) => setApplicantEducationDetails(e.target.value)}
                          />
                        </FormField>

                        <FormField
                          label="Current Institution / School / College"
                          htmlFor="applicant-student-inst"
                        >
                          <Input
                            id="applicant-student-inst"
                            placeholder="e.g. Farook College, Govt HSS"
                            value={applicantInstitution}
                            onChange={(e) => setApplicantInstitution(e.target.value)}
                          />
                        </FormField>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-muted/30 border border-border/80 space-y-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Employment & Workplace Details
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <FormField label="Employment Status" htmlFor="applicant-emp-status">
                          <Select
                            id="applicant-emp-status"
                            value={applicantEmploymentStatus}
                            onChange={(e) => setApplicantEmploymentStatus(e.target.value)}
                          >
                            <option value="">Select employment status</option>
                            {EMPLOYMENT_STATUS_OPTIONS.filter((o) => o.value !== "STUDENT").map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </Select>
                        </FormField>

                        <FormField label="Job Title / Designation" htmlFor="applicant-job-title">
                          <Input
                            id="applicant-job-title"
                            placeholder="e.g. Accountant, Driver, Electrician, Sales Executive"
                            value={applicantJobTitle}
                            onChange={(e) => setApplicantJobTitle(e.target.value)}
                          />
                        </FormField>

                        <div className="sm:col-span-2">
                          <FormField label="Employer / Company / Business" htmlFor="applicant-employer">
                            <Input
                              id="applicant-employer"
                              placeholder="e.g. Lulu Hypermarket, Self - Freelance"
                              value={applicantEmployerOrBusiness}
                              onChange={(e) => setApplicantEmployerOrBusiness(e.target.value)}
                            />
                          </FormField>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-card shadow-xs cursor-pointer hover:bg-muted/40 transition-colors">
                            <input
                              type="checkbox"
                              checked={applicantIsJobSeeker}
                              onChange={(e) => setApplicantIsJobSeeker(e.target.checked)}
                              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                            />
                            <div>
                              <span className="text-xs font-semibold text-foreground block">
                                Actively Seeking Employment (Enroll in Mahallu Job Desk)
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                Enrolls applicant in the community employment registry for relevant job opportunities.
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Skills & Competencies (For ALL) */}
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
                          placeholder="e.g. Driving, Accounting, Plumbing, Teaching, Coding, Electrical"
                          value={newApplicantSkill}
                          onChange={(e) => setNewApplicantSkill(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addApplicantSkill();
                            }
                          }}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => addApplicantSkill()}
                          className="gap-1 flex-shrink-0"
                        >
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
                          onClick={() => addApplicantSkill(sugg)}
                          className="px-2 py-0.5 rounded text-[11px] bg-background border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors cursor-pointer"
                        >
                          + {sugg}
                        </button>
                      ))}
                    </div>

                    {applicantSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/60">
                        {applicantSkills.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium border border-primary/20"
                          >
                            <span>{s}</span>
                            <button
                              type="button"
                              onClick={() => removeApplicantSkill(s)}
                              className="hover:text-destructive text-primary/70 ml-0.5 font-bold cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Educational Background & Qualifications (Multiple records - Needed for BOTH) */}
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/80 space-y-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                          Educational Background & Qualifications
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <FormField label="Highest Education Level" htmlFor="applicant-edu-level">
                        <Select
                          id="applicant-edu-level"
                          value={applicantEducationLevel}
                          onChange={(e) => setApplicantEducationLevel(e.target.value)}
                        >
                          <option value="">Select highest education</option>
                          {EDUCATION_LEVEL_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </Select>
                      </FormField>

                      {applicantProfileType === "WORKER" && (
                        <FormField label="Primary Qualification / Major" htmlFor="applicant-edu-details">
                          <Input
                            id="applicant-edu-details"
                            placeholder="e.g. B.Com, Plus Two Science, Alimiyya"
                            value={applicantEducationDetails}
                            onChange={(e) => setApplicantEducationDetails(e.target.value)}
                          />
                        </FormField>
                      )}
                    </div>

                    {/* Multiple Education Records */}
                    <div className="pt-3 border-t border-border/60 space-y-3">
                      <span className="text-xs font-bold text-foreground block">
                        Multiple Education Background Entries ({applicantEducationHistory.length})
                      </span>

                      {/* Add new qualification entry */}
                      <div className="p-3 rounded-xl border border-border bg-card space-y-3">
                        <span className="text-[11px] font-semibold text-muted-foreground block uppercase tracking-wider">
                          + Add Education Entry
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                          <FormField label="Level" htmlFor="app-new-edu-level">
                            <Select
                              id="app-new-edu-level"
                              value={newAppEduLevel}
                              onChange={(e) => setNewAppEduLevel(e.target.value)}
                            >
                              {EDUCATION_LEVEL_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </Select>
                          </FormField>

                          <FormField label="Degree / Course" htmlFor="app-new-edu-degree">
                            <Input
                              id="app-new-edu-degree"
                              placeholder="e.g. SSLC, Plus Two, B.Com"
                              value={newAppEduDegree}
                              onChange={(e) => setNewAppEduDegree(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addApplicantEducationItem();
                                }
                              }}
                            />
                          </FormField>

                          <FormField label="Institution / Board" htmlFor="app-new-edu-inst">
                            <Input
                              id="app-new-edu-inst"
                              placeholder="e.g. Govt HSS, Calicut Univ"
                              value={newAppEduInstitution}
                              onChange={(e) => setNewAppEduInstitution(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addApplicantEducationItem();
                                }
                              }}
                            />
                          </FormField>

                          <div className="flex items-end gap-2">
                            <div className="flex-1">
                              <FormField label="Year" htmlFor="app-new-edu-year">
                                <Input
                                  id="app-new-edu-year"
                                  placeholder="e.g. 2021"
                                  value={newAppEduYear}
                                  onChange={(e) => setNewAppEduYear(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      addApplicantEducationItem();
                                    }
                                  }}
                                />
                              </FormField>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              onClick={addApplicantEducationItem}
                              className="gap-1 flex-shrink-0 h-9"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>Add</span>
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Display added qualification cards */}
                      {applicantEducationHistory.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {applicantEducationHistory.map((item) => (
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
                                onClick={() => removeApplicantEducationItem(item.id)}
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
                </div>

                {/* 3. Health & Care Status */}
                <div className="space-y-4 pt-4 border-t border-border">
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
                        onClick={() => setApplicantHealthStatus("NO_KNOWN_CONDITION")}
                        className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                          applicantHealthStatus === "NO_KNOWN_CONDITION"
                            ? "border-emerald-600 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/30"
                            : "border-border bg-background hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        <span className="font-bold text-xs">No Known Condition</span>
                        <span className="text-[11px] opacity-80">Healthy / No chronic illness</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setApplicantHealthStatus("HAS_CONDITION")}
                        className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                          applicantHealthStatus === "HAS_CONDITION"
                            ? "border-amber-600 bg-amber-500/10 text-amber-800 dark:text-amber-300 ring-2 ring-amber-500/30"
                            : "border-border bg-background hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        <span className="font-bold text-xs">Has Condition</span>
                        <span className="text-[11px] opacity-80">Chronic illness, disability, or care</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setApplicantHealthStatus("NOT_DISCLOSED")}
                        className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                          applicantHealthStatus === "NOT_DISCLOSED"
                            ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/30"
                            : "border-border bg-background hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        <span className="font-bold text-xs">Not Disclosed</span>
                        <span className="text-[11px] opacity-80">Prefer not to disclose</span>
                      </button>
                    </div>
                  </div>

                  {/* Progressive Disclosure when HAS_CONDITION */}
                  {applicantHealthStatus === "HAS_CONDITION" && (
                    <div className="space-y-4 animate-in fade-in-50 duration-150">
                      {/* Subsection A: Person with Disability */}
                      <div className="p-3.5 rounded-xl bg-background border border-border space-y-3">
                        <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                          <Checkbox
                            checked={applicantHasDisability}
                            onChange={(e) => setApplicantHasDisability(e.target.checked)}
                          />
                          <span className="flex items-center gap-1.5 text-foreground">
                            <Accessibility className="h-4 w-4 text-rose-500" />
                            <span>Person with Disability (Divyangjan)</span>
                          </span>
                        </label>

                        {applicantHasDisability && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 pl-6">
                            <FormField label="Disability Category">
                              <Select
                                value={applicantDisabilityType}
                                onChange={(e) => setApplicantDisabilityType(e.target.value)}
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
                                value={applicantDisabilityPercentage}
                                onChange={(e) => setApplicantDisabilityPercentage(e.target.value)}
                              />
                            </FormField>

                            <div className="sm:col-span-2 space-y-2 pt-1">
                              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer select-none">
                                <Checkbox
                                  checked={applicantDisabilityCertificate}
                                  onChange={(e) => setApplicantDisabilityCertificate(e.target.checked)}
                                />
                                <span>Disability Certificate Available</span>
                              </label>
                              {applicantDisabilityCertificate && (
                                <Input
                                  placeholder="Certificate / UDID Number"
                                  value={applicantDisabilityCertificateNo}
                                  onChange={(e) => setApplicantDisabilityCertificateNo(e.target.value)}
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
                            checked={applicantHasChronicIllness}
                            onChange={(e) => setApplicantHasChronicIllness(e.target.checked)}
                          />
                          <span className="flex items-center gap-1.5 text-foreground">
                            <Activity className="h-4 w-4 text-rose-500" />
                            <span>Long-term / Chronic Illness</span>
                          </span>
                        </label>

                        {applicantHasChronicIllness && (
                          <div className="space-y-3 pt-2 pl-6">
                            <div>
                              <span className="text-xs text-muted-foreground block mb-1.5">Condition Types (Select all that apply):</span>
                              <div className="flex flex-wrap gap-1.5">
                                {CHRONIC_CONDITION_OPTIONS.map((c) => (
                                  <button
                                    key={c}
                                    type="button"
                                    onClick={() => toggleApplicantChronicCondition(c)}
                                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                                      applicantChronicConditions.includes(c)
                                        ? "bg-rose-500/10 text-rose-600 border-rose-500/30 font-semibold"
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
                                value={applicantChronicDetails}
                                onChange={(e) => setApplicantChronicDetails(e.target.value)}
                              />
                            </FormField>

                            <div className="flex flex-col sm:flex-row gap-3 pt-1">
                              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer select-none">
                                <Checkbox
                                  checked={applicantTreatmentRequired}
                                  onChange={(e) => setApplicantTreatmentRequired(e.target.checked)}
                                />
                                <span>Active Treatment Required</span>
                              </label>

                              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer select-none">
                                <Checkbox
                                  checked={applicantRegularMedicationRequired}
                                  onChange={(e) => setApplicantRegularMedicationRequired(e.target.checked)}
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
                            checked={applicantRequiresAssistance}
                            onChange={(e) => setApplicantRequiresAssistance(e.target.checked)}
                          />
                          <span className="text-foreground font-semibold">
                            Requires Assistance (Bedridden / Elderly / Mobility)
                          </span>
                        </label>

                        {applicantRequiresAssistance && (
                          <div className="space-y-3 pt-2 pl-6">
                            <div>
                              <span className="text-xs text-muted-foreground block mb-1.5">Assistance Needed:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {ASSISTANCE_TYPE_OPTIONS.map((t) => (
                                  <button
                                    key={t}
                                    type="button"
                                    onClick={() => toggleApplicantAssistanceType(t)}
                                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                                      applicantAssistanceTypes.includes(t)
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
                                  value={applicantPrimaryCaregiverName}
                                  onChange={(e) => setApplicantPrimaryCaregiverName(e.target.value)}
                                />
                              </FormField>
                              <FormField label="Caregiver Relationship">
                                <Input
                                  placeholder="e.g. Spouse, Son, Daughter, Caretaker"
                                  value={applicantCaregiverRelationship}
                                  onChange={(e) => setApplicantCaregiverRelationship(e.target.value)}
                                />
                              </FormField>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              <FormField label="Emergency Contact Person">
                                <Input
                                  placeholder="Emergency contact name"
                                  value={applicantEmergencyContactName}
                                  onChange={(e) => setApplicantEmergencyContactName(e.target.value)}
                                />
                              </FormField>
                              <FormField label="Emergency Phone Number">
                                <Input
                                  placeholder="e.g. +91 98765 43210"
                                  value={applicantEmergencyContactPhone}
                                  onChange={(e) => setApplicantEmergencyContactPhone(e.target.value)}
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
                            checked={applicantRequiresMentalHealthSupport}
                            onChange={(e) => setApplicantRequiresMentalHealthSupport(e.target.checked)}
                          />
                          <span className="text-foreground">Mental Health & Counselling Support (Confidential)</span>
                        </label>

                        {applicantRequiresMentalHealthSupport && (
                          <div className="pt-2 pl-6">
                            <FormField label="Support Type Required">
                              <Select
                                value={applicantMentalHealthSupportType}
                                onChange={(e) => setApplicantMentalHealthSupportType(e.target.value)}
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
                            checked={applicantRequiresCommunitySupport}
                            onChange={(e) => setApplicantRequiresCommunitySupport(e.target.checked)}
                          />
                          <span className="text-rose-600 font-bold">Enroll in Mahallu Community Welfare Support</span>
                        </label>

                        {applicantRequiresCommunitySupport && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 pl-6">
                            <FormField label="Support Category">
                              <Select
                                value={applicantSupportCategory}
                                onChange={(e) => setApplicantSupportCategory(e.target.value)}
                              >
                                <option value="">Select Welfare Category</option>
                                {SUPPORT_CATEGORY_OPTIONS.map((cat) => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </Select>
                            </FormField>

                            <FormField label="Support Status">
                              <Select
                                value={applicantSupportStatus}
                                onChange={(e) => setApplicantSupportStatus(e.target.value as any)}
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
                                  value={applicantSupportNotes}
                                  onChange={(e) => setApplicantSupportNotes(e.target.value)}
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
              </div>
            )}

            {/* TAB 3: MEMBER LIST */}
            {activeTab === "members" && (
              <div className="space-y-4 animate-in fade-in-50 duration-150">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 border border-border/80">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">Family Member Roster</span>
                    <span className="text-[11px] text-muted-foreground">
                      Add spouse, children, and parents. Full profile details can be edited anytime later.
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
                  <div className="space-y-4">
                    {memberList.map((m, index) => (
                      <div
                        key={m.id}
                        className="p-4 rounded-xl border border-border bg-card shadow-xs flex flex-col gap-3.5"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-border/60">
                          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                              {index + 1}
                            </span>
                            {m.fullName || `Member #${index + 1}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeMemberRow(m.id)}
                            className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 cursor-pointer"
                          >
                            <Trash className="h-3 w-3" />
                            <span>Remove</span>
                          </button>
                        </div>

                        {/* Basic Identity */}
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

                          <FormField label="Gender" htmlFor={`m-gen-${m.id}`}>
                            <Select
                              id={`m-gen-${m.id}`}
                              value={m.gender}
                              onChange={(e) => updateMemberRow(m.id, "gender", e.target.value)}
                            >
                              <option value="MALE">Male</option>
                              <option value="FEMALE">Female</option>
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

                          <div className="sm:col-span-2">
                            <FormField label="ID Number" htmlFor={`m-id-num-${m.id}`}>
                              <Input
                                id={`m-id-num-${m.id}`}
                                placeholder="Enter ID number"
                                value={m.idNumber}
                                onChange={(e) => updateMemberRow(m.id, "idNumber", e.target.value)}
                              />
                            </FormField>
                          </div>
                        </div>

                        {/* Member Activity Classification Toggle: Student vs Worker */}
                        <div className="p-3 rounded-lg bg-muted/30 border border-border/70 flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                              Activity: {m.profileType === "STUDENT" ? "Student" : "Worker / Adult"}
                            </span>
                            <div className="inline-flex rounded-md border border-border p-0.5 bg-background">
                              <button
                                type="button"
                                onClick={() => {
                                  updateMemberRow(m.id, "profileType", "STUDENT");
                                  updateMemberRow(m.id, "employmentStatus", "STUDENT");
                                }}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                                  m.profileType === "STUDENT"
                                    ? "bg-primary text-primary-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                <School className="h-3 w-3" />
                                <span>Student</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  updateMemberRow(m.id, "profileType", "WORKER");
                                  if (m.employmentStatus === "STUDENT") updateMemberRow(m.id, "employmentStatus", "EMPLOYED");
                                }}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                                  m.profileType !== "STUDENT"
                                    ? "bg-primary text-primary-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                <Briefcase className="h-3 w-3" />
                                <span>Worker / Adult</span>
                              </button>
                            </div>
                          </div>

                          {/* Conditional Student / Worker details */}
                          {m.profileType === "STUDENT" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <FormField label="Current Course / Class / Standard" htmlFor={`m-stu-course-${m.id}`}>
                                <Input
                                  id={`m-stu-course-${m.id}`}
                                  placeholder="e.g. Plus Two Science, Class 10, B.Com"
                                  value={m.educationDetails}
                                  onChange={(e) => updateMemberRow(m.id, "educationDetails", e.target.value)}
                                />
                              </FormField>

                              <FormField label="Current Institution / School / College" htmlFor={`m-stu-inst-${m.id}`}>
                                <Input
                                  id={`m-stu-inst-${m.id}`}
                                  placeholder="e.g. Farook College, Govt HSS"
                                  value={m.institution}
                                  onChange={(e) => updateMemberRow(m.id, "institution", e.target.value)}
                                />
                              </FormField>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                              <FormField label="Employment Status" htmlFor={`m-emp-${m.id}`}>
                                <Select
                                  id={`m-emp-${m.id}`}
                                  value={m.employmentStatus}
                                  onChange={(e) => updateMemberRow(m.id, "employmentStatus", e.target.value)}
                                >
                                  <option value="">Select status</option>
                                  {EMPLOYMENT_STATUS_OPTIONS.filter((o) => o.value !== "STUDENT").map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </Select>
                              </FormField>

                              <FormField label="Job Title / Role" htmlFor={`m-job-${m.id}`}>
                                <Input
                                  id={`m-job-${m.id}`}
                                  placeholder="e.g. Accountant, Driver, Electrician"
                                  value={m.jobTitle}
                                  onChange={(e) => updateMemberRow(m.id, "jobTitle", e.target.value)}
                                />
                              </FormField>

                              <FormField label="Employer / Business" htmlFor={`m-biz-${m.id}`}>
                                <Input
                                  id={`m-biz-${m.id}`}
                                  placeholder="e.g. Lulu Hypermarket, Freelance"
                                  value={m.employerOrBusiness}
                                  onChange={(e) => updateMemberRow(m.id, "employerOrBusiness", e.target.value)}
                                />
                              </FormField>
                            </div>
                          )}

                          {/* Member Skills (For ALL) */}
                          <div className="space-y-1.5 pt-1 border-t border-border/60">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                              Skills & Competencies
                            </span>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Type skill (e.g. Electrician, Driving, Plumbing) & click Add"
                                value={m.newSkillInput || ""}
                                onChange={(e) => updateMemberRow(m.id, "newSkillInput", e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    addMemberSkill(m.id);
                                  }
                                }}
                                className="flex-1 text-xs"
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => addMemberSkill(m.id)}
                                className="gap-1 flex-shrink-0 text-xs"
                              >
                                <Plus className="h-3 w-3" />
                                <span>Add</span>
                              </Button>
                            </div>

                            {/* Suggestions */}
                            <div className="flex flex-wrap items-center gap-1 pt-0.5">
                              {["Driving", "Electrician", "Plumbing", "Accounting", "Teaching", "Coding"].map((sugg) => (
                                <button
                                  key={sugg}
                                  type="button"
                                  onClick={() => addMemberSkill(m.id, sugg)}
                                  className="px-1.5 py-0.5 rounded text-[10px] bg-background border border-border text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                  + {sugg}
                                </button>
                              ))}
                            </div>

                            {(m.skills || []).length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {m.skills.map((s) => (
                                  <span
                                    key={s}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium border border-primary/20"
                                  >
                                    <span>{s}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeMemberSkill(m.id, s)}
                                      className="hover:text-destructive text-primary/70 ml-0.5 font-bold cursor-pointer"
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Member Multiple Education Background (For BOTH) */}
                          <div className="space-y-2 pt-1 border-t border-border/60">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                              Educational Background & History ({ (m.educationHistory || []).length })
                            </span>

                            {/* Highest level selector */}
                            <FormField label="Highest Education Level" htmlFor={`m-edu-${m.id}`}>
                              <Select
                                id={`m-edu-${m.id}`}
                                value={m.educationLevel}
                                onChange={(e) => updateMemberRow(m.id, "educationLevel", e.target.value)}
                              >
                                <option value="">Select education level</option>
                                {EDUCATION_LEVEL_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </Select>
                            </FormField>

                            {/* Add qualification entry for member */}
                            <div className="p-2.5 rounded-lg border border-border bg-background space-y-2">
                              <span className="text-[10px] font-semibold text-muted-foreground block uppercase">
                                + Add Past Qualification
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                                <Select
                                  value={m.newEduLevel || "SECONDARY_SSLC"}
                                  onChange={(e) => updateMemberRow(m.id, "newEduLevel", e.target.value)}
                                  className="text-xs"
                                >
                                  {EDUCATION_LEVEL_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </Select>

                                <Input
                                  placeholder="Degree / Course"
                                  value={m.newEduDegree || ""}
                                  onChange={(e) => updateMemberRow(m.id, "newEduDegree", e.target.value)}
                                  className="text-xs"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      addMemberEducationItem(m.id);
                                    }
                                  }}
                                />

                                <Input
                                  placeholder="Institution / Board"
                                  value={m.newEduInstitution || ""}
                                  onChange={(e) => updateMemberRow(m.id, "newEduInstitution", e.target.value)}
                                  className="text-xs"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      addMemberEducationItem(m.id);
                                    }
                                  }}
                                />

                                <div className="flex items-center gap-1.5">
                                  <Input
                                    placeholder="Year"
                                    value={m.newEduYear || ""}
                                    onChange={(e) => updateMemberRow(m.id, "newEduYear", e.target.value)}
                                    className="text-xs flex-1"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        addMemberEducationItem(m.id);
                                      }
                                    }}
                                  />
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => addMemberEducationItem(m.id)}
                                    className="gap-1 flex-shrink-0 text-xs h-8"
                                  >
                                    <Plus className="h-3 w-3" />
                                    <span>Add</span>
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {/* Added list for member */}
                            {(m.educationHistory || []).length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {m.educationHistory.map((edu) => (
                                  <span
                                    key={edu.id}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-foreground text-xs font-medium border border-border"
                                  >
                                    <School className="h-3 w-3 text-primary" />
                                    <span>{edu.degree || edu.level?.replace("_", " ")}</span>
                                    {edu.institution && <span className="text-muted-foreground">• {edu.institution}</span>}
                                    {edu.year && <span className="text-[10px] font-mono bg-background px-1 py-0.2 rounded border">({edu.year})</span>}
                                    <button
                                      type="button"
                                      onClick={() => removeMemberEducationItem(m.id, edu.id)}
                                      className="hover:text-destructive text-muted-foreground ml-1 font-bold cursor-pointer"
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Health Toggles */}
                        <div className="p-2.5 rounded-lg bg-muted/20 border border-border/60 flex flex-wrap items-center gap-4">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            Health & Support:
                          </span>

                          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-foreground">
                            <input
                              type="checkbox"
                              checked={m.hasDisability}
                              onChange={(e) => updateMemberRow(m.id, "hasDisability", e.target.checked)}
                              className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                            />
                            <span>Person with Disability</span>
                          </label>

                          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-foreground">
                            <input
                              type="checkbox"
                              checked={m.hasChronicIllness}
                              onChange={(e) => updateMemberRow(m.id, "hasChronicIllness", e.target.checked)}
                              className="rounded border-border text-rose-500 focus:ring-rose-500 h-3.5 w-3.5"
                            />
                            <span>Long-term Illness</span>
                          </label>

                          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-foreground">
                            <input
                              type="checkbox"
                              checked={m.regularMedicationRequired}
                              onChange={(e) => updateMemberRow(m.id, "regularMedicationRequired", e.target.checked)}
                              className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                            />
                            <span>Medicine Aid Needed</span>
                          </label>

                          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-foreground ml-auto">
                            <input
                              type="checkbox"
                              checked={m.isJobSeeker}
                              onChange={(e) => updateMemberRow(m.id, "isJobSeeker", e.target.checked)}
                              className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                            />
                            <span>Job Seeker</span>
                          </label>
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
