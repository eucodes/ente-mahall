/** Field types available in the platform Form Builder (Section N). */
export enum FormFieldType {
  TEXT = "TEXT",
  LONG_TEXT = "LONG_TEXT",
  NUMBER = "NUMBER",
  PHONE = "PHONE",
  EMAIL = "EMAIL",
  DATE = "DATE",
  TIME = "TIME",
  SELECT = "SELECT",
  MULTI_SELECT = "MULTI_SELECT",
  RADIO = "RADIO",
  CHECKBOX = "CHECKBOX",
  FILE_UPLOAD = "FILE_UPLOAD",
  ADDRESS = "ADDRESS",
  MEMBER_LOOKUP = "MEMBER_LOOKUP",
  FAMILY_LOOKUP = "FAMILY_LOOKUP",
  HOUSE_LOOKUP = "HOUSE_LOOKUP"
}

/** Field types that read their `options` array — every other type ignores it. */
export const FORM_FIELD_TYPES_WITH_OPTIONS = new Set<FormFieldType>([
  FormFieldType.SELECT,
  FormFieldType.MULTI_SELECT,
  FormFieldType.RADIO
]);

/**
 * A form version's lifecycle. DRAFT is freely editable; PUBLISHED is
 * immutable forever (Section N) — the only way forward is a new draft
 * version on the same template.
 */
export enum FormVersionStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED"
}
