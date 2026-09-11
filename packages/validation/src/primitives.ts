import { z } from "zod";

/** Reused across auth and tenant-management forms in later phases. */
export const emailSchema = z.string().trim().toLowerCase().email();

export const tenantSlugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3)
  .max(63)
  .regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, "Only lowercase letters, numbers, and hyphens");

export const passwordSchema = z
  .string()
  .min(10, "Must be at least 10 characters")
  .regex(/[a-z]/, "Must include a lowercase letter")
  .regex(/[A-Z]/, "Must include an uppercase letter")
  .regex(/[0-9]/, "Must include a number");
