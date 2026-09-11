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
