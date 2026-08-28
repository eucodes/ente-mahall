import type { UserRole } from '@prisma/client';

export interface JwtAccessPayload {
  sub: string; // user id
  mahallId: string;
  role: UserRole;
}
