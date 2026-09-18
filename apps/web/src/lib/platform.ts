import "server-only";
import { serverApiGet } from "./server-api";

export interface PlatformSession {
  role: string;
}

export interface PlatformTenant {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  // Branding
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  // Contact
  contactPhone?: string | null;
  contactEmail?: string | null;
  website?: string | null;
  // Masjid
  masjidName?: string | null;
  masjidPhone?: string | null;
  masjidAddress?: string | null;
  imamName?: string | null;
  khatheebName?: string | null;
  // Location
  country?: string | null;
  state?: string | null;
  district?: string | null;
  localBodyType?: string | null;
  localBody?: string | null;
  place?: string | null;
  pinCode?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  // Structure
  hasDivisions?: boolean;
  divisionTerm?: string | null;
  // Management
  presidentName?: string | null;
  presidentPhone?: string | null;
  secretaryName?: string | null;
  secretaryPhone?: string | null;
  treasurerName?: string | null;
  treasurerPhone?: string | null;
  // Counts
  memberCount: number;
  familyCount: number;
  adminCount: number;
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
  pageSize: number,
  filters?: { search?: string; action?: string; tenantId?: string }
): Promise<{ entries: AuditLogEntry[]; total: number }> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString()
  });
  if (filters?.search) params.set("search", filters.search);
  if (filters?.action && filters.action !== "all") params.set("action", filters.action);
  if (filters?.tenantId && filters.tenantId !== "all") params.set("tenantId", filters.tenantId);

  const { status, body } = await serverApiGet<{ entries: AuditLogEntry[]; meta: { total: number } }>(
    `/platform/audit-logs?${params.toString()}`
  );
  if (status !== 200 || !body.success || !body.data) return { entries: [], total: 0 };
  return { entries: body.data.entries, total: body.data.meta.total };
}

export interface PlatformUser {
  id: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  user: { id: string; email: string; fullName: string; isActive: boolean };
}

export async function getPlatformUsers(): Promise<PlatformUser[]> {
  const { status, body } = await serverApiGet<{ users: PlatformUser[] }>("/platform/users");
  if (status !== 200 || !body.success || !body.data) return [];
  return body.data.users;
}

export interface StatewideUser {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  platformRole: string | null;
  platformMembershipId?: string | null;
  tenants: Array<{
    id: string;
    name: string;
    slug: string;
    roleId?: string;
    roleKey?: string;
    roleName?: string;
    role?: string;
  }>;
  activeSessionsCount: number;
}

export async function getAllUsers(query?: {
  search?: string;
  roleFilter?: string;
  tenantId?: string;
  status?: string;
}): Promise<StatewideUser[]> {
  const params = new URLSearchParams();
  if (query?.search) params.set("search", query.search);
  if (query?.roleFilter && query.roleFilter !== "all") params.set("roleFilter", query.roleFilter);
  if (query?.tenantId && query.tenantId !== "all") params.set("tenantId", query.tenantId);
  if (query?.status && query.status !== "all") params.set("status", query.status);

  const qs = params.toString();
  const path = qs ? `/platform/all-users?${qs}` : "/platform/all-users";
  const { status, body } = await serverApiGet<{ users: StatewideUser[] }>(path);
  if (status !== 200 || !body.success || !body.data) return [];
  return body.data.users;
}

export interface SystemStatus {
  status: string;
  database: {
    connected: boolean;
    provider: string;
  };
  counts: {
    tenants: number;
    activeTenants: number;
    users: number;
    members: number;
    families: number;
    auditLogs: number;
    activeSessions: number;
  };
  environment: {
    nodeEnv: string;
    platformVersion: string;
    uptimeSeconds: number;
  };
}

export async function getSystemStatus(): Promise<SystemStatus | null> {
  const { status, body } = await serverApiGet<SystemStatus>("/platform/system/status");
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data;
}

export interface PlatformUserSession {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  expiresAt: string;
  revokedAt: string | null;
}

export async function getUserSessions(userId: string): Promise<PlatformUserSession[]> {
  const { status, body } = await serverApiGet<{ sessions: PlatformUserSession[] }>(
    `/platform/users/${encodeURIComponent(userId)}/sessions`
  );
  if (status !== 200 || !body.success || !body.data) return [];
  return body.data.sessions;
}

export interface PlatformSettings {
  platformName: string;
  rootDomain: string;
  supportEmail: string;
  defaultCurrency: string;
  timezone: string;
  locale: string;
  sessionTimeoutMinutes: number;
  require2FAForSuperadmins: boolean;
  maxConcurrentSessions: number;
  autoApproveTenants: boolean;
  defaultTrialDays: number;
  allowPublicRegistration: boolean;
  auditRetentionDays: number;
  logIpAddresses: boolean;
  logUserAgents: boolean;
}

export async function getPlatformSettings(): Promise<PlatformSettings | null> {
  const { status, body } = await serverApiGet<{ settings: PlatformSettings }>("/platform/settings");
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.settings;
}

export interface PlatformRoleMember {
  membershipId: string;
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  isActive: boolean;
}

export interface PlatformRoleInfo {
  key: string;
  name: string;
  description: string;
  badge: string;
  membersCount: number;
  members: PlatformRoleMember[];
}

export interface PlatformPermissionItem {
  key: string;
  name: string;
  description: string;
}

export interface PlatformPermissionCategory {
  category: string;
  permissions: PlatformPermissionItem[];
}

export interface PlatformRolesMatrixResponse {
  roles: PlatformRoleInfo[];
  categories: PlatformPermissionCategory[];
  rolePermissions: Record<string, string[] | "*">;
}

export async function getPlatformRolesMatrix(): Promise<PlatformRolesMatrixResponse | null> {
  const { status, body } = await serverApiGet<PlatformRolesMatrixResponse>("/platform/roles-matrix");
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data;
}

