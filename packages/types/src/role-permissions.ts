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
  [TenantRole.ACCOUNTANT]: [
    "members.view",
    "families.view",
    "houses.view",
    "finance.view",
    "finance.create",
    "finance.update",
    "finance.settings.view",
    "collections.view",
    "collections.create",
    "collections.update",
    "collections.cancel",
    "payments.view",
    "payments.create",
    "payments.update",
    "payments.cancel",
    "receipts.view",
    "receipts.create",
    "receipts.print",
    "receipts.cancel",
    "donations.view",
    "donations.create",
    "donations.update",
    "donations.cancel",
    "dues.view",
    "dues.manage",
    "expenses.view",
    "expenses.create",
    "expenses.update",
    "expenses.approve",
    "expenses.cancel",
    "salary.view",
    "salary.create",
    "salary.update",
    "salary.approve",
    "salary.pay",
    "accounting.view",
    "accounting.accounts.manage",
    "accounting.journal.create",
    "accounting.journal.post",
    "accounting.journal.cancel",
    "accounting.ledger.view",
    "accounting.reports.view",
    "banking.view",
    "banking.manage",
    "taxes.view",
    "taxes.manage",
    "reports.view",
    "reports.export"
  ],
  [TenantRole.EDITOR]: ["website.view", "website.update", "announcements.view", "announcements.create", "announcements.update"],
  [TenantRole.STAFF]: ["members.view", "families.view", "houses.view", "events.view", "programs.view", "services.view", "services.create"],
  [TenantRole.MEMBER]: []
};
