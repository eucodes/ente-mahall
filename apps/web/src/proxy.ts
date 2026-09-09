import { NextResponse, type NextRequest } from "next/server";
import { resolveHost } from "@/lib/tenant/hostname";

/**
 * Hostname-based routing only. This decides which UI renders — it must never
 * be treated as authorization. Every authenticated request's tenant scope
 * comes from the JWT's `mahallId` claim, validated by the NestJS API; the
 * subdomain here just picks which pages to serve.
 */
export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const context = resolveHost(host);
  const { pathname, search } = request.nextUrl;

  switch (context.kind) {
    case "marketing":
      return NextResponse.next();

    case "super-admin":
      return NextResponse.rewrite(new URL(`/admin${pathname}${search}`, request.url));

    case "tenant":
      return NextResponse.rewrite(new URL(`/tenant/${context.slug}${pathname}${search}`, request.url));

    case "unknown":
      return new NextResponse("Not found", { status: 404 });
  }
}

export const config = {
  matcher: [
    // Skip static assets, images, and Next internals.
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
