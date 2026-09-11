import "server-only";
import { serverApiGet } from "./server-api";

export interface SessionMember {
  id: string;
  fullName: string;
  phone: string | null;
  email: string | null;
}

/**
 * Reads the current Mahalle member's session in a Server Component. Members
 * are a separate identity space from admin/platform Users (phone + OTP, not
 * email/password) — see apps/api's member-auth module. Returns null for
 * "not signed in" rather than throwing, same convention as getSession().
 */
export async function getMemberSession(slug: string): Promise<SessionMember | null> {
  const { status, body } = await serverApiGet<{ member: SessionMember }>(
    `/tenants/${encodeURIComponent(slug)}/member-auth/me`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.member;
}
