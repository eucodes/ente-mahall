import { z } from "zod";

export const createPlanSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  priceCents: z.number().int().nonnegative(),
  currency: z.string().length(3).default("INR"),
  billingPeriod: z.enum(["monthly", "yearly"]),
  memberLimit: z.number().int().positive().optional(),
});
export type CreatePlanInput = z.infer<typeof createPlanSchema>;

export const planSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  priceCents: z.number(),
  currency: z.string(),
  billingPeriod: z.string(),
  memberLimit: z.number().nullable(),
  isActive: z.boolean(),
});
export type Plan = z.infer<typeof planSchema>;
