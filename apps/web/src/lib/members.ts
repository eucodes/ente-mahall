import "server-only";
import { serverApiGet } from "./server-api";

export interface Member {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  familyId: string | null;
  family: { id: string; name: string } | null;
}

/** Null means the API rejected this (not a member of the tenant, or lacks members.view). */
export async function getMembers(
  slug: string,
  page: number,
  pageSize: number
): Promise<{ members: Member[]; total: number } | null> {
  const { status, body } = await serverApiGet<{ members: Member[]; meta: { total: number } }>(
    `/tenants/${encodeURIComponent(slug)}/members?page=${page}&pageSize=${pageSize}`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return { members: body.data.members, total: body.data.meta.total };
}
