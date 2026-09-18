import "server-only";
import type { User } from "@mahalle/types";
import { serverApiGet } from "./server-api";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Reads the current session in a Server Component. Returns null for
 * "not signed in" rather than throwing — callers redirect as needed.
 */
export async function getSession(): Promise<User | null> {
  const { status, body } = await serverApiGet<{ user: User }>("/auth/me");
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.user;
}

/**
 * Redirects an unauthenticated request to /login, preserving the current path
 * in the returnTo query param so the user returns to where they were upon logging in.
 */
export async function redirectToLogin(): Promise<never> {
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname");
  if (pathname && pathname !== "/" && !pathname.startsWith("/login")) {
    redirect(`/login?returnTo=${encodeURIComponent(pathname)}`);
  }
  redirect("/login");
}
