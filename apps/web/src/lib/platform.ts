import "server-only";
import { serverApiGet } from "./server-api";

export interface PlatformSession {
  role: string;
}

export interface PlatformTenant {
  id: string;
  slug: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  memberCount: number;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  metadata: unknown;
  ipAddress: string | null;
  createdAt: string;
  actor: { id: string; email: string; fullName: string } | null;
  tenant: { id: string; slug: string; name: string } | null;
}

/**
 * Null means "no control-plane access" — either not signed in, or signed in
 * without a PlatformMembership. A tenant OWNER/ADMIN gets null here just
 * like anyone else — tenant roles carry zero weight on this check.
 */
export async function getPlatformSession(): Promise<PlatformSession | null> {
  const { status, body } = await serverApiGet<PlatformSession>("/platform/me");
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data;
}

export async function getAllTenants(): Promise<PlatformTenant[]> {
  const { status, body } = await serverApiGet<{ tenants: PlatformTenant[] }>("/platform/tenants");
  if (status !== 200 || !body.success || !body.data) return [];
  return body.data.tenants;
}

/** Null if the tenant doesn't exist — including just after it was deleted. */
export async function getPlatformTenant(tenantId: string): Promise<PlatformTenant | null> {
  const { status, body } = await serverApiGet<{ tenant: PlatformTenant }>(
    `/platform/tenants/${encodeURIComponent(tenantId)}`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.tenant;
}

export interface TenantRoleWithPermissions {
  id: string;
  key: string;
  name: string;
  permissions: string[];
}

/** Null means the tenant doesn't exist (or the caller lost platform access mid-session). */
export async function getTenantRoles(tenantId: string): Promise<TenantRoleWithPermissions[] | null> {
  const { status, body } = await serverApiGet<{ roles: TenantRoleWithPermissions[] }>(
    `/platform/tenants/${encodeURIComponent(tenantId)}/roles`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.roles;
}

export interface PlatformMember {
  id: string;
  fullName: string;
  phone: string | null;
  family: { id: string; name: string } | null;
}

export interface PlatformFamily {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
}

export interface PlatformEvent {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startsAt: string;
  endsAt: string | null;
}

export interface PlatformAnnouncement {
  id: string;
  title: string;
  body: string;
  publishedAt: string | null;
}

export interface PlatformProgram {
  id: string;
  name: string;
  description: string | null;
}

export interface PlatformAdmin {
  id: string;
  user: { id: string; email: string; fullName: string };
  role: { key: string; name: string };
}

/** Null means the tenant doesn't exist, or this session lost platform access mid-request. */
async function fetchTenantResource<T>(
  tenantId: string,
  resource: string,
  listField: string,
  page: number,
  pageSize: number
): Promise<{ items: T[]; total: number } | null> {
  const { status, body } = await serverApiGet<Record<string, unknown>>(
    `/platform/tenants/${encodeURIComponent(tenantId)}/${resource}?page=${page}&pageSize=${pageSize}`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  const data = body.data as Record<string, unknown>;
  return { items: data[listField] as T[], total: (data.meta as { total: number }).total };
}

export const getTenantMembers = (tenantId: string, page: number, pageSize: number) =>
  fetchTenantResource<PlatformMember>(tenantId, "members", "members", page, pageSize);

export const getTenantFamilies = (tenantId: string, page: number, pageSize: number) =>
  fetchTenantResource<PlatformFamily>(tenantId, "families", "families", page, pageSize);

export const getTenantEvents = (tenantId: string, page: number, pageSize: number) =>
  fetchTenantResource<PlatformEvent>(tenantId, "events", "events", page, pageSize);

export const getTenantAnnouncements = (tenantId: string, page: number, pageSize: number) =>
  fetchTenantResource<PlatformAnnouncement>(tenantId, "announcements", "announcements", page, pageSize);

export const getTenantPrograms = (tenantId: string, page: number, pageSize: number) =>
  fetchTenantResource<PlatformProgram>(tenantId, "programs", "programs", page, pageSize);

/** Null only if the tenant itself doesn't resolve — unlike the others, this endpoint has no page/pageSize. */
export async function getTenantAdmins(tenantId: string): Promise<PlatformAdmin[] | null> {
  const { status, body } = await serverApiGet<{ admins: PlatformAdmin[] }>(
    `/platform/tenants/${encodeURIComponent(tenantId)}/admins`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.admins;
}

export async function getAuditLogs(
  page: number,
  pageSize: number
): Promise<{ entries: AuditLogEntry[]; total: number }> {
  const { status, body } = await serverApiGet<{ entries: AuditLogEntry[]; meta: { total: number } }>(
    `/platform/audit-logs?page=${page}&pageSize=${pageSize}`
  );
  if (status !== 200 || !body.success || !body.data) return { entries: [], total: 0 };
  return { entries: body.data.entries, total: body.data.meta.total };
}
