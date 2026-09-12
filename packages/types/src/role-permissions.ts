import { TenantRole } from "./roles.js";

/**
 * The standard permission grant for each tenant role, applied to every new
 * tenant at creation time (see apps/api's TenantsService) and by the
 * database seed script. Single source of truth so a new tenant created
 * through the API and the seeded demo tenant never drift apart.
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<TenantRole, readonly string[] | "*"> = {
  [TenantRole.OWNER]: "*",
  // ADMIN gets every permission, including admins.* — an ADMIN can manage
  // lower-ranked staff. What actually distinguishes ADMIN from OWNER is
  // TENANT_ROLE_RANK-based escalation prevention (see apps/api's
  // AdminsService): an ADMIN can never create/promote/remove an OWNER or
  // another ADMIN, only OWNER can.
  [TenantRole.ADMIN]: "*",
  [TenantRole.MODERATOR]: [
    "members.view",
    "families.view",
    "houses.view",
    "events.view",
    "events.update",
    "announcements.view",
    "announcements.create",
    "announcements.update",
    "programs.view",
    "committee.view",
    "services.view",
    "services.create",
    "services.update"
  ],
  [TenantRole.EDITOR]: ["website.view", "website.update", "announcements.view", "announcements.create", "announcements.update"],
  [TenantRole.STAFF]: ["members.view", "families.view", "houses.view", "events.view", "programs.view", "services.view", "services.create"],
  [TenantRole.MEMBER]: []
};
