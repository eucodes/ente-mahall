/**
 * An origin is allowed if it's explicitly listed in CORS_ORIGINS, or if its
 * hostname falls under the cookie domain's root (any subdomain of the same
 * apex the session cookie is scoped to — admin., control., any tenant slug).
 * This mirrors the web app's own hostname-based routing so a new tenant
 * subdomain never needs a CORS allowlist update.
 */
export function createCorsOriginValidator(cookieDomain: string, explicitOrigins: string[]) {
  const rootApex = cookieDomain.replace(/^\./, "");

  return (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) {
      // Non-browser clients (curl, server-to-server, future mobile apps using Bearer auth) send no Origin header.
      callback(null, true);
      return;
    }

    if (explicitOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    try {
      const hostname = new URL(origin).hostname;
      const isUnderRootDomain = rootApex.length > 0 && (hostname === rootApex || hostname.endsWith(`.${rootApex}`));
      callback(null, isUnderRootDomain);
    } catch {
      callback(null, false);
    }
  };
}
