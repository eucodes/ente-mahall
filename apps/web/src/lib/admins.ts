import "server-only";
import { serverApiGet } from "./server-api";

export interface AdminMember {
  id: string;
  user: { id: string; email: string; fullName: string };
  role: { key: string; name: string };
}

/**
 * Null means "the API rejected this" — either not a member at all, or a
 * member without the `admins.view` permission. The page renders the same
 * access-denied UI either way; which one it is isn't worth distinguishing
 * to the caller since the API already made the real decision.
 */
export async function getAdmins(slug: string): Promise<AdminMember[] | null> {
  const { status, body } = await serverApiGet<{ admins: AdminMember[] }>(`/tenants/${encodeURIComponent(slug)}/admins`);
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.admins;
}
