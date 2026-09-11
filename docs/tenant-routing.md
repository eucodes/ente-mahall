# Tenant Resolution & Domain Routing

## How a request gets routed

[`apps/web/src/middleware.ts`](../apps/web/src/middleware.ts) runs on every
request and inspects the `Host` header:

| Host pattern | Rewritten to | App |
| --- | --- | --- |
| `example.com` (== `NEXT_PUBLIC_ROOT_DOMAIN`) | `/sites/marketing/...` | Marketing |
| `admin.example.com` | `/sites/admin/...` | Mahalle admin |
| `control.example.com` | `/sites/control/...` | Platform control plane |
| `<slug>.example.com` | `/sites/tenant/<slug>/...` | Tenant public site + dashboard |
| anything else | `/sites/marketing/...` | Fallback |

This is a `NextResponse.rewrite`, so the URL the visitor sees never changes —
only the route tree Next.js resolves against does.

## What this routing is — and is not

This middleware **only decides which UI to render.** It is not an
authorization boundary — that's `TenantContextGuard` on the API side (Phase
3, see [authorization.md](authorization.md)). The tenant slug parsed from the
hostname (`params.tenant` in a page, or the `:slug` route param on the API)
is used as a lookup key, never trusted as an authorization claim:

- `apps/web/src/lib/tenants.ts` calls the real API (`GET /tenants/:slug`,
  `GET /tenants/:slug/me`) — the tenant name shown, and whether the current
  visitor has access, both come from the database, not from parsing the URL.
- The API **never trusts** a tenant id/slug supplied by the client for
  authorization purposes. `TenantContextGuard` independently resolves:
  authenticated user → does an active `TenantMembership` exist for *this*
  tenant. (Role/permission-level checks on top of that are Phase 4.)
- A request for `abc.example.com` data made by a user who is only a member of
  `xyz` is rejected by the API regardless of what the frontend rendered —
  proven by the isolation test in `apps/api/test/tenants.e2e-spec.ts`.

See [authorization.md](authorization.md) for the enforcement side.

## Local development

Without wildcard DNS, use `/etc/hosts` entries. Plain `*.localhost` doesn't
work here — see [dev-setup.md](dev-setup.md#exercising-the-four-hostnames-locally)
for why — so local dev uses the reserved `.test` TLD instead:

```
127.0.0.1 mahalle.test
127.0.0.1 admin.mahalle.test
127.0.0.1 control.mahalle.test
127.0.0.1 demo.mahalle.test
127.0.0.1 api.mahalle.test
```

`NEXT_PUBLIC_ROOT_DOMAIN=mahalle.test:3000` in `.env` drives the middleware's
host comparisons, so `admin.mahalle.test:3000`, `control.mahalle.test:3000`,
and `demo.mahalle.test:3000` resolve to the admin, control, and `demo` tenant
route groups respectively.

## Production

In production, `NEXT_PUBLIC_ROOT_DOMAIN` becomes the real apex domain (e.g.
`example.com`), and a wildcard DNS record (`*.example.com`) plus wildcard TLS
certificate route all tenant subdomains to the same Next.js deployment.
Custom domains (a tenant's own domain instead of a subdomain) are a future
enhancement — the middleware's fallback branch is where that mapping would be
looked up.
