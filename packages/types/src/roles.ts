/** Roles a user can hold within a single tenant (Mahalle). */
export enum TenantRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  EDITOR = "EDITOR",
  STAFF = "STAFF",
  MEMBER = "MEMBER"
}

/** Roles a user can hold on the platform control plane. Entirely separate from TenantRole. */
export enum PlatformRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  PLATFORM_STAFF = "PLATFORM_STAFF",
  PLATFORM_SUPPORT = "PLATFORM_SUPPORT"
}

/**
 * Higher number = more privileged. Used to stop privilege escalation when
 * managing other administrators: an actor may only assign/modify a role
 * strictly below their own rank, unless they are OWNER (who may also grant
 * OWNER, e.g. to transfer or share ownership).
 */
export const TENANT_ROLE_RANK: Record<TenantRole, number> = {
  [TenantRole.OWNER]: 5,
  [TenantRole.ADMIN]: 4,
  [TenantRole.MODERATOR]: 3,
  [TenantRole.EDITOR]: 2,
  [TenantRole.STAFF]: 1,
  [TenantRole.MEMBER]: 0
};
