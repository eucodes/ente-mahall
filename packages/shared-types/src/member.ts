import { z } from "zod";

export const membershipStatusSchema = z.enum(["ACTIVE", "INACTIVE", "PENDING", "SUSPENDED"]);
export type MembershipStatus = z.infer<typeof membershipStatusSchema>;

export const createMemberSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().optional(),
  houseNumber: z.string().optional(),
});
export type CreateMemberInput = z.infer<typeof createMemberSchema>;

export const memberSchema = createMemberSchema.extend({
  id: z.string(),
  mahallId: z.string(),
  status: membershipStatusSchema,
  joinedAt: z.string(),
});
export type Member = z.infer<typeof memberSchema>;
