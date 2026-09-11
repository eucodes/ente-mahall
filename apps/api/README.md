# @mahalle/api

NestJS backend for the Mahalle SaaS platform. Modular monolith — no microservices.

## Development

```bash
pnpm install
pnpm --filter @mahalle/api dev
```

The API listens on `http://localhost:4000` (see `PORT` in `.env`). All routes are
prefixed with `/api/v1` except `/health`.

## Module structure

Phase 1 shipped `config`, `database` (Prisma), `common` (error filter,
response envelope, CSRF guard, pagination DTO), and `health`. Phase 2 added
`users`, `audit` (append-only `AuditLog` writer), and `auth` (JWT access
tokens + rotating refresh tokens, login lockout via Redis, rate limiting).
Phase 3 added `permissions` (catalogue bootstrap), `memberships` (the
active-membership lookup), and `tenants` (creation + `TenantContextGuard`).
Phase 4 added `PermissionGuard` + `@RequirePermission` (in `tenants/guards`)
and administrator management with role-rank escalation prevention
(`tenants/admins.*`) — see [docs/authorization.md](../../docs/authorization.md)
for the full, tested enforcement chain. Phase 5 added `platform`
(`PlatformContextGuard`, platform-wide tenant/audit-log views — a completely
separate authorization path from tenant guards). Phase 7 added the five
Mahalle business modules — `members`, `families`, `events`, `announcements`,
`programs` — each a Prisma model + tenant-scoped, permission-gated NestJS
module following the identical object-level-isolation pattern.

## Testing

```bash
pnpm --filter @mahalle/api test       # unit tests (vitest)
pnpm --filter @mahalle/api test:e2e   # e2e tests (requires Postgres running)
```
