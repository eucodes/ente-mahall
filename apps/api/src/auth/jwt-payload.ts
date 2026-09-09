import type { UserRole } from '@prisma/client';

export interface JwtAccessPayload {
  sub: string; // user id
  // Absent for SUPER_ADMIN — every other role is scoped to exactly one Mahall.
  mahallId: string | null;
  role: UserRole;
}
