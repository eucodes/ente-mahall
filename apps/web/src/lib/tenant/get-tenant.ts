import "server-only";
import type { Mahall } from "@ente-mahall/contracts";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/**
 * Server-only tenant lookup by subdomain slug. Used by the tenant layout to
 * 404 unknown subdomains and to supply the Mahall's display name to pages —
 * never used for authorization, which is the API's job via the JWT.
 */
export async function getTenant(slug: string): Promise<Mahall | null> {
  const res = await fetch(`${API_BASE_URL}/mahalls/${slug}`, {
    next: { revalidate: 60 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to resolve tenant "${slug}": ${res.status}`);
  return res.json();
}
