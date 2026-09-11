# Authorization & Tenant Isolation

> Status: **fully implemented and tested** (Phases 3–4). Every claim on this
> page is backed by an e2e test — see the file references throughout.

## The resolution chain

Every authorized request resolves through this chain, server-side, on every
single request — never cached client-side as a trust decision:

```
authenticated user
  → tenant membership (is there an active TenantMembership for THIS tenant?)   [TenantContextGuard]
    → role (what Role does that membership carry?)                             [attached by TenantContextGuard]
      → permissions (what Permissions does that Role's RolePermission set grant?) [PermissionGuard]
        → requested resource (does the specific record belong to this tenant?)  [each service's own tenantId-scoped query]
```

Deny by default: if any link in that chain is missing, unclear, or doesn't
match, the request is rejected — it is never granted "just in case."

## Never trust the client for these

`tenant_id`, `user_id`, `role`, and `permissions` supplied by the frontend
(query params, body fields, headers set by JS) are **never** used as the basis
for an authorization decision. The API derives all of them from the
authenticated session:

- `user_id` comes from the verified session (`JwtAuthGuard`), not a request field.
- The active tenant comes from `TenantContextGuard`'s database lookup, not a
  client header claiming "I am tenant X" (the tenant *hint* from hostname
  routing is only ever used to pick which membership to check — see
  [tenant-routing.md](tenant-routing.md)).
- Role/permissions are looked up fresh from `TenantMembership → Role →
  RolePermission` on every request (`PermissionGuard` →
  `PermissionsService.roleHasPermission`), never trusted from a JWT claim.

## Membership check (Phase 3)

`TenantContextGuard` (`apps/api/src/tenants/guards/tenant-context.guard.ts`)
resolves `:slug` on any route to a real `Tenant` and requires an active
membership, attaching `req.tenant`/`req.membership` for the rest of the
request. Proven by the isolation test in `apps/api/test/tenants.e2e-spec.ts`.

## Permission check (Phase 4)

`PermissionGuard` (`apps/api/src/tenants/guards/permission.guard.ts`) runs
after `TenantContextGuard` and enforces `@RequirePermission('members.view')`-
style decorators against the resolved role. A member with no `admins.view`
permission gets a 403 from `/tenants/:slug/admins` even though they're a
legitimate member — see `apps/api/test/admins.e2e-spec.ts`.

## Object-level authorization

Beyond "does this user have `members.update`", every tenant-owned record read
or write additionally checks that the record's own `tenantId` matches the
caller's active tenant — services scope every query by `tenantId`, never just
by record id (see `MembersService` for the pattern). This is what stops a
valid, authenticated Tenant A admin from reading or mutating Tenant B's data
by changing an id in the request. Proven in `apps/api/test/members.e2e-spec.ts`:
a member id from tenant A 404s when looked up under tenant B's scope, even
for B's own legitimate owner.

## Declarative guards, not scattered `if`s

Permission checks are expressed as decorators/guards on controller methods —
`@RequirePermission('members.view')`, resolved by `PermissionGuard`. Platform
routes use the parallel `PlatformContextGuard` instead. Controllers stay
thin; no controller hand-rolls its own authorization logic.

## Platform authorization is a separate system

`PlatformMembership` (control plane) shares no table, guard, or decision path
with `TenantMembership`/`Role`/`Permission` (tenant admin) — `PlatformContextGuard`
(`apps/api/src/platform/guards/platform-context.guard.ts`) is a completely
independent code path from `TenantContextGuard`. A platform Super Admin has
no automatic tenant access, and a tenant OWNER has no automatic platform
access — proven by the two "SEPARATION CHECK" tests in
`apps/api/test/platform.e2e-spec.ts`. This separation is deliberate so a bug
or compromise in one system cannot cross into the other.

There is currently no self-service way to grant platform access — a
`PlatformMembership` row can only be created directly (by seed, or by a
future ops process), never through an API endpoint. That's intentional:
granting Super Admin is exactly the kind of sensitive operation
[security.md](security.md) reserves for step-up-authenticated flows once
those exist, not a same-session self-service action.

## Ownership boundaries

- A tenant `OWNER` manages administrators **only within their own Mahalle** —
  and has no visibility into or control over any other tenant (enforced by
  `TenantContextGuard`; a request for another tenant's `:slug` 403s outright).
- **Role-rank escalation prevention** (`apps/api/src/tenants/admins.service.ts`,
  `TENANT_ROLE_RANK` in `packages/types`): an actor may only assign/modify a
  role strictly below their own rank — except `OWNER`, who may also grant
  `OWNER`. An `ADMIN` cannot create or promote another `ADMIN`, cannot touch
  an `OWNER`'s membership, and cannot modify or remove their own membership
  (must ask another owner). The last `OWNER` of a tenant can't be demoted or
  removed. All of this is proven, case by case, in
  `apps/api/test/admins.e2e-spec.ts`.
- Since there's no self-service way to grant a role higher than what the
  above allows, self-permission-escalation isn't just discouraged — it's
  structurally unreachable through the API.

## What the test suite proves (all passing, `apps/api/test/*.e2e-spec.ts`)

- Tenant A cannot read/write Tenant B's data by changing request parameters
  (`members.e2e-spec.ts`, "OBJECT-LEVEL ISOLATION").
- A normal member without `admins.view`/`members.view` cannot reach those
  endpoints (`admins.e2e-spec.ts`, `members.e2e-spec.ts`, "PERMISSION CHECK").
- A Mahalle admin cannot reach the platform control plane, and vice versa
  (`platform.e2e-spec.ts`, "SEPARATION CHECK").
- A user cannot elevate their own role, another's role to their own rank or
  above, or touch an `OWNER` without being one (`admins.e2e-spec.ts`,
  "ESCALATION CHECK" / "SELF-MODIFICATION CHECK" / "LAST OWNER CHECK").
