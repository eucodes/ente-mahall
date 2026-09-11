import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "mahalle.test:3000";

/**
 * Resolves which application a request belongs to purely from the Host
 * header, then rewrites into the matching route group under `sites`.
 *
 * This ONLY drives routing/presentation. The tenant slug parsed here is
 * passed to the API as a hint — the API independently re-resolves the tenant
 * and re-checks membership/role/permission on every request. Nothing here is
 * ever treated as an authorization decision.
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const host = (request.headers.get("host") ?? ROOT_DOMAIN).toLowerCase();

  let target: string;

  if (host === ROOT_DOMAIN) {
    target = `/sites/marketing${url.pathname}`;
  } else if (host === `admin.${ROOT_DOMAIN}`) {
    target = `/sites/admin${url.pathname}`;
  } else if (host === `control.${ROOT_DOMAIN}`) {
    target = `/sites/control${url.pathname}`;
  } else if (host.endsWith(`.${ROOT_DOMAIN}`)) {
    const tenantSlug = host.slice(0, -1 * (`.${ROOT_DOMAIN}`.length));
    target = `/sites/tenant/${tenantSlug}${url.pathname}`;
  } else {
    // Unknown host (e.g. a custom domain not yet mapped) — fall back to marketing.
    target = `/sites/marketing${url.pathname}`;
  }

  const rewritten = url.clone();
  rewritten.pathname = target;
  return NextResponse.rewrite(rewritten);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|ico)$).*)"]
};
