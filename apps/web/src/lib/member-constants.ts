// Types and label maps shared between server-only data fetchers (members.ts)
// and client components — kept free of "server-only" so client bundles can
// import them without pulling in the server-only sentinel.

export type Gender = "MALE" | "FEMALE" | "OTHER";
export type MaritalStatus = "SINGLE" | "MARRIED" | "WIDOWED" | "DIVORCED";
export type BloodGroup = "A_POSITIVE" | "A_NEGATIVE" | "B_POSITIVE" | "B_NEGATIVE" | "AB_POSITIVE" | "AB_NEGATIVE" | "O_POSITIVE" | "O_NEGATIVE";
export type RelationToHead = "HEAD" | "SPOUSE" | "SON" | "DAUGHTER" | "PARENT" | "SIBLING" | "OTHER";
export type MovementStatus = "RESIDENT" | "MIGRATED" | "MOVED_OUT" | "DECEASED";

export const BLOOD_GROUP_LABELS: Record<BloodGroup, string> = {
  A_POSITIVE: "A+",
  A_NEGATIVE: "A-",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB-",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O-"
};

export const RELATION_TO_HEAD_LABELS: Record<RelationToHead, string> = {
  HEAD: "Head of family",
  SPOUSE: "Spouse",
  SON: "Son",
  DAUGHTER: "Daughter",
  PARENT: "Parent",
  SIBLING: "Sibling",
  OTHER: "Other"
};

export const MOVEMENT_STATUS_LABELS: Record<MovementStatus, string> = {
  RESIDENT: "Resident",
  MIGRATED: "Migrated",
  MOVED_OUT: "Moved out",
  DECEASED: "Deceased"
};
