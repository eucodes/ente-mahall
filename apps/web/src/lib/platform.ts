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
