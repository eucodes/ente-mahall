import { isReservedSlug } from "@ente-mahall/contracts";

/**
 * The root domain this deployment serves, without protocol or port
 * (e.g. "example.com" in prod, "localhost" for the *.localhost dev pattern).
 * Set via ROOT_DOMAIN; falls back to "localhost" so local dev works with no .env.
 */
export const ROOT_DOMAIN = process.env.ROOT_DOMAIN ?? "localhost";

export type HostContext =
  | { kind: "marketing" }
  | { kind: "super-admin" }
  | { kind: "tenant"; slug: string }
  | { kind: "unknown" };

/** Classifies an incoming `Host` header into what part of the app should render. */
export function resolveHost(hostHeader: string): HostContext {
  const host = hostHeader.split(":")[0].toLowerCase(); // strip port for local dev

  if (host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}`) {
    return { kind: "marketing" };
  }

  if (host === `admin.${ROOT_DOMAIN}`) {
    return { kind: "super-admin" };
  }

  if (host.endsWith(`.${ROOT_DOMAIN}`)) {
    const slug = host.slice(0, -(ROOT_DOMAIN.length + 1));
    // A subdomain with dots left over (e.g. foo.bar.example.com) isn't a valid tenant slug.
    if (slug.includes(".") || slug.length === 0 || isReservedSlug(slug)) {
      return { kind: "unknown" };
    }
    return { kind: "tenant", slug };
  }

  return { kind: "unknown" };
}
