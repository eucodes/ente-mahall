import { ForbiddenException } from '@nestjs/common';
import type { JwtAccessPayload } from './jwt-payload.js';

/** Narrows a possibly-platform-level user to one scoped to a Mahall, for tenant-only routes. */
export function requireMahallId(user: JwtAccessPayload): string {
  if (!user.mahallId) {
    throw new ForbiddenException('This action requires a Mahall-scoped user');
  }
  return user.mahallId;
}
