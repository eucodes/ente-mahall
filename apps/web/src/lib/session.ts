import "server-only";
import type { User } from "@mahalle/types";
import { serverApiGet } from "./server-api";

/**
 * Reads the current session in a Server Component. Returns null for
 * "not signed in" rather than throwing — callers redirect as needed.
 */
export async function getSession(): Promise<User | null> {
  const { status, body } = await serverApiGet<{ user: User }>("/auth/me");
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.user;
}
