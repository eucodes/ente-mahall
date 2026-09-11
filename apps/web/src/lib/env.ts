export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://api.mahalle.test:4000/api/v1";
export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "mahalle.test:3000";

/** host[:port] for a tenant's own subdomain, e.g. "demo.mahalle.test:3000". */
export function tenantHost(slug: string): string {
  return `${slug}.${ROOT_DOMAIN}`;
}

/** host[:port] for the admin site, e.g. "admin.mahalle.test:3000". */
export function adminHost(): string {
  return `admin.${ROOT_DOMAIN}`;
}

/**
 * Which app a request's session cookies belong to — the API scopes cookies
 * per app (see apps/api's app-scope.ts) so logging into admin.mahalle.test
 * doesn't also sign you into control.mahalle.test or any tenant subdomain.
 * Mirrors the host matching in middleware.ts, plus the bare root domain
 * (marketing site), which is folded into "admin" since its only
 * auth-touching feature — the "Get started" onboarding flow — creates an
 * admin/owner account and hands off straight to admin.mahalle.test.
 */
export type AppScope = "admin" | "control" | "tenant";

export function appScopeFromHost(host: string): AppScope {
  const normalized = host.toLowerCase();
  const root = ROOT_DOMAIN.toLowerCase();
  if (normalized === root || normalized === `admin.${root}`) return "admin";
  if (normalized === `control.${root}`) return "control";
  return "tenant";
}
