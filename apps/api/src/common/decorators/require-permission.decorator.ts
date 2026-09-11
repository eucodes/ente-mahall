import { SetMetadata } from "@nestjs/common";
import type { Permission } from "@mahalle/types";

export const REQUIRE_PERMISSION_KEY = "requirePermission";

/**
 * Marks an endpoint as requiring a specific tenant permission. Must be
 * combined with JwtAuthGuard + TenantContextGuard + PermissionGuard (in that
 * order) — PermissionGuard reads this metadata and checks it against the
 * role resolved by TenantContextGuard.
 */
export const RequirePermission = (permission: Permission) => SetMetadata(REQUIRE_PERMISSION_KEY, permission);
