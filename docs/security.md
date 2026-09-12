# Security Model

## Baseline (in place from Phase 1)

- **Helmet** applied globally in `apps/api/src/main.ts` for standard security headers.
- **CORS** allows any origin under `COOKIE_DOMAIN`'s root automatically, plus
  an explicit allowlist (`CORS_ORIGINS` env var) for anything else — with
  `credentials: true`, never a wildcard origin (see `src/config/cors.ts`).
- **class-validator** DTOs + a global `ValidationPipe` (`whitelist: true`,
  `forbidNonWhitelisted: true`) reject any request payload with unexpected
  fields, so extra client-supplied fields (e.g. an unexpected `role` field)
  are stripped before they ever reach a service.
- **Secure error handling**: `HttpExceptionFilter` normalizes every error into
  the shared response envelope and logs full detail server-side, but never
  returns a stack trace or internal error string to the client.
- **Env-var-only secrets**: `apps/api/src/config/env.validation.ts` fails
  application boot if a required secret is missing. `.env` is git-ignored;
  `.env.example` holds placeholders only.

## Added in Phase 2 (authentication)

- Password hashing with bcrypt (cost factor 12) — never plaintext.
- Per-email brute-force lockout via Redis (5 failed attempts / 15 min),
  independent of per-IP rate limiting, so rotating IPs doesn't help an
  attacker (`LoginLockoutService`).
- Global per-IP rate limiting (`@nestjs/throttler`) plus a stricter
  `@Throttle()` override on `/auth/login` and `/auth/register`.
- CSRF protection via double-submit cookie for cookie-authenticated mutating
  requests (`CsrfGuard`) — see [authentication.md](authentication.md).
- Refresh-token rotation with theft detection: reusing an already-rotated
  token revokes the entire session chain.
- Every login attempt, lockout, and logout is audit-logged.

## Added in Phase 3/4 (multi-tenancy & authorization)

- `TenantContextGuard`: every tenant-scoped route requires an active
  membership, re-checked from the database on every request.
- `PermissionGuard` + `@RequirePermission`: granular permission enforcement
  on top of membership.
- Object-level authorization: every tenant-owned record query is scoped by
  `tenantId`, not just record id — a valid id from another tenant 404s.
- Role-rank escalation prevention on administrator management (an ADMIN
  can't create/promote a peer or superior, can't touch their own membership).
- `PlatformContextGuard`: control-plane authorization is a fully separate
  code path from tenant authorization, sharing no table or guard.
- **One Mahalle per account**: an account can create/own exactly one tenant
  (`TenantsService.createTenant`) — being added as ADMIN/STAFF/etc. of
  someone else's Mahalle doesn't count against this.
- **Platform control over tenants** (`@RequirePlatformRole(SUPER_ADMIN)` on
  top of `PlatformContextGuard` — see `RequirePlatformRole` decorator):
  suspend/reactivate a Mahalle (`PATCH /platform/tenants/:id/status`,
  reversible, immediately 404s the tenant publicly), permanently delete one
  (`DELETE /platform/tenants/:id`, cascades to everything under it), and
  override what a tenant's own roles are permitted to do
  (`PATCH /platform/tenants/:id/roles/:roleId/permissions`) — the platform
  deciding what a Mahalle admin can and can't do, independent of and taking
  precedence over what the tenant's own OWNER configured; and bulk-delete
  several tenants at once (`POST /platform/tenants/bulk-delete`). `PLATFORM_STAFF`
  can view all of the above but not change any of it.
- **Cross-tenant dashboard access** (`PlatformTenantAccessController`): the
  control plane can view and, for `SUPER_ADMIN`, manage a single Mahalle's
  members/families/events/announcements/programs/administrators — the same
  data its own admins see — through a route tree that only ever goes through
  `PlatformContextGuard`, never `TenantContextGuard`, so the two
  authorization systems still share no guard or decision path.

All of the above is e2e-tested — see [authorization.md](authorization.md) and
[testing.md](testing.md).

## Still to add in later phases

- Control-plane-specific hardening: MFA, SSO readiness, shorter sessions,
  step-up authentication for sensitive actions, IP/security policies — Phase
  5+ (see [authentication.md](authentication.md)). `control.example.com`
  today enforces real `PlatformMembership` authorization, but none of this
  additional hardening yet.

## Sensitive operations requiring step-up confirmation

Once step-up auth exists, these actions require it in addition to normal
permission checks: deleting a tenant, granting Super Admin, changing billing,
exporting sensitive data, and starting an impersonation session.

Tenant deletion is implemented today (`SUPER_ADMIN`-only, audit-logged, and
the control-plane UI requires typing the tenant's slug before the delete
button activates) — but that's a client-side UX safety net, not step-up
auth. The real gate is still just "is this session a SUPER_ADMIN," same as
any other request. Step-up (re-authenticating immediately before the action)
is still not implemented for this or any other sensitive operation.

## Audit logging

`AuditLog` is append-only — no module updates or deletes rows in it. Logged
events include: login, logout, failed login, role/permission changes,
administrator creation/removal, tenant changes, deletions, data exports,
impersonation, subscription changes, and platform administration actions.
Normal users have no code path that can write to or modify this table.

## Never commit real secrets

`.env.example` contains placeholders only. If you add a new required
environment variable, add it to `.env.example` with a placeholder value and to
`apps/api/src/config/env.validation.ts` so boot fails loudly if it's missing,
rather than the app silently running with an undefined secret.
