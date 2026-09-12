// Shared, client-safe (no "server-only") config types for the generic
// register form/table pair — every Registers-phase page (Death, Marriage,
// Divorce, Release, Grave, Madrassa, Property) is driven by one of these
// configs instead of a bespoke dialog/table per register.

export interface RegisterFieldOption {
  value: string;
  label: string;
}

export interface RegisterFieldConfig {
  name: string;
  label: string;
  type?: "text" | "textarea" | "date" | "select" | "checkbox";
  required?: boolean;
  options?: RegisterFieldOption[];
  hint?: string;
  fullWidth?: boolean;
}

export interface RegisterColumnConfig {
  header: string;
  key: string;
  format?: "date" | "text";
}

/** A register record is a plain, JSON-serializable bag of fields plus an id — never a class instance or function. */
export type RegisterRecord = Record<string, unknown> & { id: string };
