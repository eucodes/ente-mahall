export type OnboardingStep =
  | "account"
  | "mahalle"
  | "location"
  | "profile"
  | "structure"
  | "management"
  | "review"
  | "complete";

/** The steps that make up the progress indicator — "complete" is a separate success screen, not a numbered step. */
export const PROGRESS_STEPS: { key: Exclude<OnboardingStep, "complete">; label: string }[] = [
  { key: "account", label: "Account" },
  { key: "mahalle", label: "Mahallu" },
  { key: "location", label: "Location" },
  { key: "profile", label: "Profile" },
  { key: "structure", label: "Structure" },
  { key: "management", label: "Management" },
  { key: "review", label: "Review" }
];

export interface AccountData {
  fullName: string;
  email: string;
  phone: string;
}

export interface MahalleData {
  name: string;
  slug: string;
  description: string;
}

export interface LocationData {
  country: string;
  state: string;
  district: string;
  localBodyType: string;
  localBody: string;
  place: string;
  pinCode: string;
  addressLine1: string;
  addressLine2: string;
  latitude: string;
  longitude: string;
}

export interface ProfileData {
  logoUrl: string;
  coverImageUrl: string;
  contactPhone: string;
  contactEmail: string;
  website: string;
  masjidName: string;
  masjidPhone: string;
  masjidAddress: string;
  imamName: string;
  khatheebName: string;
}

export interface DivisionEntry {
  name: string;
  code: string;
  description: string;
}

export type HouseNumberingMethod = "NUMERIC" | "ALPHANUMERIC" | "CUSTOM";

export interface StructureData {
  hasDivisions: boolean;
  divisionTerm: string;
  divisions: DivisionEntry[];
  usesHouseNumbers: boolean;
  houseNumberingMethod: HouseNumberingMethod;
}

export interface ManagementData {
  presidentName: string;
  presidentPhone: string;
  secretaryName: string;
  secretaryPhone: string;
  treasurerName: string;
  treasurerPhone: string;
}

/** The full shape of the wizard's draft — persisted server-side (OnboardingDraft.data) so a refresh can resume it. */
export interface OnboardingDraftData {
  mahalle?: Partial<MahalleData>;
  location?: Partial<LocationData>;
  profile?: Partial<ProfileData>;
  structure?: Partial<StructureData>;
  management?: Partial<ManagementData>;
}

export const EMPTY_LOCATION: LocationData = {
  country: "India",
  state: "",
  district: "",
  localBodyType: "",
  localBody: "",
  place: "",
  pinCode: "",
  addressLine1: "",
  addressLine2: "",
  latitude: "",
  longitude: ""
};

export const EMPTY_PROFILE: ProfileData = {
  logoUrl: "",
  coverImageUrl: "",
  contactPhone: "",
  contactEmail: "",
  website: "",
  masjidName: "",
  masjidPhone: "",
  masjidAddress: "",
  imamName: "",
  khatheebName: ""
};

export const EMPTY_STRUCTURE: StructureData = {
  hasDivisions: false,
  divisionTerm: "",
  divisions: [],
  usesHouseNumbers: false,
  houseNumberingMethod: "NUMERIC"
};

export const EMPTY_MANAGEMENT: ManagementData = {
  presidentName: "",
  presidentPhone: "",
  secretaryName: "",
  secretaryPhone: "",
  treasurerName: "",
  treasurerPhone: ""
};

export { INDIAN_STATES, KERALA_DISTRICTS, type IndianState } from "@/lib/location-data";

export const LOCAL_BODY_TYPES = ["Grama Panchayat", "Municipality", "Corporation", "Other"] as const;

export const DIVISION_TERMS = ["Ward", "Division", "Area", "Zone", "Other"] as const;
