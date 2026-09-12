import "server-only";
import { serverApiGet } from "./server-api";

export interface ActivityEntry {
  id: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  createdAt: string;
  actor: { id: string; fullName: string } | null;
}

/** Null means the API rejected this (not a member of the tenant, or lacks audit.view). */
export async function getActivity(slug: string, page: number, pageSize: number): Promise<{ entries: ActivityEntry[]; total: number } | null> {
  const { status, body } = await serverApiGet<{ entries: ActivityEntry[]; meta: { total: number } }>(
    `/tenants/${encodeURIComponent(slug)}/activity?page=${page}&pageSize=${pageSize}`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return { entries: body.data.entries, total: body.data.meta.total };
}
