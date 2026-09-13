import "server-only";
import { serverApiGet } from "./server-api";

export interface RoleSummary {
  id: string;
  key: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  isActive: boolean;
  memberCount: number;
  permissionKeys: string[];
}

export interface PermissionCategory {
  category: string;
  keys: string[];
}

/** Null means the API rejected this (not a member of the tenant, or lacks roles.view). */
export async function getRoles(slug: string): Promise<RoleSummary[] | null> {
  const { status, body } = await serverApiGet<{ roles: RoleSummary[] }>(`/tenants/${encodeURIComponent(slug)}/roles`);
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.roles;
}

export async function getRole(slug: string, roleId: string): Promise<RoleSummary | null> {
  const { status, body } = await serverApiGet<{ role: RoleSummary }>(`/tenants/${encodeURIComponent(slug)}/roles/${roleId}`);
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.role;
}

export async function getPermissionCatalogue(slug: string): Promise<PermissionCategory[] | null> {
  const { status, body } = await serverApiGet<{ categories: PermissionCategory[] }>(`/tenants/${encodeURIComponent(slug)}/permissions`);
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.categories;
}
