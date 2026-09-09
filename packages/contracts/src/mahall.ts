import { z } from "zod";
import { RESERVED_SLUGS } from "./reserved-slugs.js";

const slugSchema = z
  .string()
  .min(2)
  .max(63)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Lowercase letters, numbers, and hyphens only")
  .refine((slug) => !(RESERVED_SLUGS as readonly string[]).includes(slug), {
    message: "This subdomain is reserved",
  });

export const mahallStatusSchema = z.enum(["ACTIVE", "TRIAL", "SUSPENDED", "ARCHIVED"]);
export type MahallStatus = z.infer<typeof mahallStatusSchema>;

export const createMahallSchema = z.object({
  name: z.string().min(1),
  slug: slugSchema,
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  planId: z.string().min(1),
});
export type CreateMahallInput = z.infer<typeof createMahallSchema>;

export const mahallSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  status: mahallStatusSchema,
  address: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
});
export type Mahall = z.infer<typeof mahallSchema>;
