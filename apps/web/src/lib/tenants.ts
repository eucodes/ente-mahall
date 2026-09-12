import "server-only";
import { serverApiGet } from "./server-api";

export interface PublicTenant {
  id: string;
  slug: string;
  name: string;
  /** Non-null only for tenants created via the full onboarding wizard. */
  country?: string | null;
  logoUrl?: string | null;
  masjidName?: string | null;
  hasDivisions?: boolean;
}

export interface RoleInfo {
  key: string;
  name: string;
}

export interface TenantMembershipInfo {
  tenant: PublicTenant;
  role: RoleInfo;
}

/** Public tenant lookup — no auth required. Null if the tenant doesn't exist or is inactive. */
export async function getPublicTenant(slug: string): Promise<PublicTenant | null> {
  const { status, body } = await serverApiGet<{ tenant: PublicTenant }>(`/tenants/${encodeURIComponent(slug)}`);
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.tenant;
}

/**
 * The real tenant-isolation check: does the current user have an active
 * membership in this specific tenant? Null covers both "not signed in" and
 * "signed in but not a member" — callers show the same access-denied UI for
 * either, since which one it is isn't the caller's business to guess from.
 */
export async function getMyTenantMembership(slug: string): Promise<TenantMembershipInfo | null> {
  const { status, body } = await serverApiGet<TenantMembershipInfo>(`/tenants/${encodeURIComponent(slug)}/me`);
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data;
}

/** Every Mahalle the current user belongs to. Empty array if signed out or a member of none. */
export async function getMyTenants(): Promise<TenantMembershipInfo[]> {
  const { status, body } = await serverApiGet<{ memberships: TenantMembershipInfo[] }>("/tenants/mine");
  if (status !== 200 || !body.success || !body.data) return [];
  return body.data.memberships;
}
