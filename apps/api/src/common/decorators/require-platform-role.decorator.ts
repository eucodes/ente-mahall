import { SetMetadata } from "@nestjs/common";
import type { PlatformRole } from "@mahalle/types";

export const REQUIRE_PLATFORM_ROLE_KEY = "requirePlatformRole";

/**
 * Restricts an endpoint to specific PlatformRole(s), on top of the base
 * PlatformContextGuard membership check. Used for the platform's own
 * sensitive operations — suspending/deleting a tenant, overriding a
 * tenant's role permissions — the same way @RequirePermission restricts
 * tenant-scoped endpoints, but for the completely separate platform
 * authorization system.
 */
export const RequirePlatformRole = (...roles: PlatformRole[]) => SetMetadata(REQUIRE_PLATFORM_ROLE_KEY, roles);
