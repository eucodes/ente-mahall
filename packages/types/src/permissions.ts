/**
 * Canonical list of granular, tenant-scoped permission strings.
 * This is the single source of truth shared by the API (authorization guards
 * and seed data) and the web app (conditional UI rendering). The API is the
 * only place that ever *enforces* these — the frontend only reads them to
 * decide what to show.
 */
export const PERMISSIONS = [
  "members.view",
  "members.create",
  "members.update",
  "members.delete",

  "families.view",
  "families.create",
  "families.update",
  "families.delete",

  "events.view",
  "events.create",
  "events.update",
  "events.delete",

  "announcements.view",
  "announcements.create",
  "announcements.update",
  "announcements.delete",

  "programs.view",
  "programs.create",
  "programs.update",
  "programs.delete",

  "structure.view",
  "structure.update",

  "houses.view",
  "houses.create",
  "houses.update",
  "houses.delete",

  "committee.view",
  "committee.create",
  "committee.update",
  "committee.delete",

  "registers.death.view",
  "registers.death.create",
  "registers.death.update",
  "registers.death.delete",

  "registers.marriage.view",
  "registers.marriage.create",
  "registers.marriage.update",
  "registers.marriage.delete",

  "registers.divorce.view",
  "registers.divorce.create",
  "registers.divorce.update",
  "registers.divorce.delete",

  "registers.release.view",
  "registers.release.create",
  "registers.release.update",
  "registers.release.delete",

  "registers.grave.view",
  "registers.grave.create",
  "registers.grave.update",
  "registers.grave.delete",

  "registers.madrassa.view",
  "registers.madrassa.create",
  "registers.madrassa.update",
  "registers.madrassa.delete",

  "registers.property.view",
  "registers.property.create",
  "registers.property.update",
  "registers.property.delete",

  "finance.view",
  "finance.create",
  "finance.update",
  "finance.delete",

  "services.view",
  "services.create",
  "services.update",
  "services.delete",

  "audit.view",

  "website.view",
  "website.update",

  "settings.view",
  "settings.update",

  "admins.view",
  "admins.create",
  "admins.update",
  "admins.delete",

  "reports.view"
] as const;

export type Permission = (typeof PERMISSIONS)[number];
