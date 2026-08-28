import { z } from "zod";

// Mirrors apps/backend/src/auth/dto/auth.dto.ts. Kept in sync manually today;
// see DECISIONS.md for the plan to generate this from the backend's OpenAPI spec.

export const loginSchema = z.object({
  mahallSlug: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const authTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});
export type AuthTokens = z.infer<typeof authTokensSchema>;

export const userRoleSchema = z.enum(["SUPER_ADMIN", "MAHALL_ADMIN", "STAFF", "MEMBER"]);
export type UserRole = z.infer<typeof userRoleSchema>;
