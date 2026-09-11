import "server-only";
import { cookies, headers } from "next/headers";
import { API_URL, appScopeFromHost } from "./env";

export interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

/**
 * Calls the API from a Server Component/action, forwarding the incoming
 * request's cookies so the session travels with it. Never throws on a
 * non-2xx response — callers inspect `status`/`body.success` themselves,
 * since "not authenticated" and "not a member of this tenant" are expected,
 * routine outcomes here, not exceptional ones.
 */
export async function serverApiGet<T>(path: string): Promise<{ status: number; body: ApiEnvelope<T> }> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const headerStore = await headers();
  // The API scopes session cookies per app (admin/control/tenant) — it needs
  // to know which one this server-rendered request is for, from the Host
  // Next.js itself received, since a server-to-server fetch carries no
  // Origin header for it to infer that from.
  const appScope = appScopeFromHost(headerStore.get("host") ?? "");

  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
      "x-app": appScope
    },
    cache: "no-store"
  });

  const body = (await res.json()) as ApiEnvelope<T>;
  return { status: res.status, body };
}
