import "server-only";
import { serverApiGet } from "./server-api";
import type { BloodGroup, Gender, MaritalStatus, MovementStatus, RelationToHead } from "./member-constants";

export type { Gender, MaritalStatus, BloodGroup, RelationToHead, MovementStatus } from "./member-constants";

export type HealthConditionStatus = "NO_KNOWN_CONDITION" | "HAS_CONDITION" | "NOT_DISCLOSED";
export type DisabilityType = "PHYSICAL" | "VISUAL" | "HEARING" | "SPEECH" | "INTELLECTUAL" | "MULTIPLE" | "OTHER";
export type SupportStatus = "ACTIVE" | "MONITORING" | "RESOLVED";
export type EmploymentStatus = "EMPLOYED" | "SELF_EMPLOYED" | "BUSINESS" | "GOVERNMENT_SERVICE" | "PRIVATE_SECTOR" | "DAILY_WAGE" | "JOB_SEEKER" | "STUDENT" | "HOMEMAKER" | "RETIRED" | "UNABLE_TO_WORK";
export type EducationLevel = "NONE" | "PRIMARY" | "SECONDARY_SSLC" | "HIGHER_SECONDARY" | "DIPLOMA" | "GRADUATE" | "POST_GRADUATE" | "DOCTORATE" | "MADRASSA_ISLAMIC" | "VOCATIONAL" | "OTHER";

export interface MemberHealthProfile {
  id: string;
  memberId: string;
  status: HealthConditionStatus;
  hasDisability: boolean;
  disabilityType: DisabilityType | null;
  disabilityPercentage: number | null;
  disabilityCertificate: boolean;
  disabilityCertificateNo: string | null;
  hasChronicIllness: boolean;
  chronicConditions: string[];
  chronicDetails: string | null;
  treatmentRequired: boolean;
  regularMedicationRequired: boolean;
  requiresMentalHealthSupport: boolean;
  mentalHealthSupportType: string | null;
  requiresAssistance: boolean;
  assistanceTypes: string[];
  primaryCaregiverName: string | null;
  caregiverRelationship: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  requiresCommunitySupport: boolean;
  supportCategory: string | null;
  supportStatus: SupportStatus;
  supportNotes: string | null;
  lastSupportDate: string | null;
}

export interface Member {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  familyId: string | null;
  family: { id: string; name: string } | null;
  gender: Gender | null;
  dateOfBirth: string | null;
  maritalStatus: MaritalStatus | null;
  bloodGroup: BloodGroup | null;
  occupation: string | null;
  idNumber: string | null;
  relationToHead: RelationToHead | null;
  movementStatus: MovementStatus;
  movementDate: string | null;
  movementNotes: string | null;
  isYatheem: boolean;
  guardianName: string | null;
  guardianPhone: string | null;
  isExpatriate: boolean;
  expatriateCountry: string | null;
  expatriateOccupation: string | null;
  expatriateContact: string | null;
  educationLevel?: EducationLevel | null;
  educationDetails?: string | null;
  institution?: string | null;
  employmentStatus?: EmploymentStatus | null;
  jobTitle?: string | null;
  employerOrBusiness?: string | null;
  skills?: string[];
  isJobSeeker?: boolean;
  educationHistory?: EducationHistoryItem[] | null;
  healthProfile?: MemberHealthProfile | null;
}

export interface EducationHistoryItem {
  id: string;
  level?: string;
  degree?: string;
  institution?: string;
  year?: string;
  grade?: string;
}

export interface MemberFilters {
  familyId?: string;
  divisionId?: string;
  isYatheem?: boolean;
  isExpatriate?: boolean;
  bloodGroup?: BloodGroup;
  movementStatus?: MovementStatus;
}

/** Null means the API rejected this (not a member of the tenant, or lacks members.view). */
export async function getMembers(
  slug: string,
  page: number,
  pageSize: number,
  filters: MemberFilters = {}
): Promise<{ members: Member[]; total: number } | null> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (filters.familyId) params.set("familyId", filters.familyId);
  if (filters.divisionId) params.set("divisionId", filters.divisionId);
  if (filters.isYatheem !== undefined) params.set("isYatheem", String(filters.isYatheem));
  if (filters.isExpatriate !== undefined) params.set("isExpatriate", String(filters.isExpatriate));
  if (filters.bloodGroup) params.set("bloodGroup", filters.bloodGroup);
  if (filters.movementStatus) params.set("movementStatus", filters.movementStatus);

  const { status, body } = await serverApiGet<{ members: Member[]; meta: { total: number } }>(
    `/tenants/${encodeURIComponent(slug)}/members?${params.toString()}`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return { members: body.data.members, total: body.data.meta.total };
}

export async function getMember(slug: string, memberId: string): Promise<Member | null> {
  const { status, body } = await serverApiGet<{ member: Member }>(
    `/tenants/${encodeURIComponent(slug)}/members/${encodeURIComponent(memberId)}`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.member;
}
