# Database Model

PostgreSQL via Prisma. Schema lives at [`database/prisma/schema.prisma`](../database/prisma/schema.prisma).

## Phase 1 entities

```
User ──< TenantMembership >── Role ──< RolePermission >── Permission
  │             │
  │             └── Tenant
  │
  └── PlatformMembership (separate from TenantMembership — control plane only)

AuditLog (append-only, references User + Tenant, both optional/nullable)
```

- **User** — one identity across the whole platform (marketing login, tenant
  sites, admin, control plane, future Flutter apps).
- **Tenant** — one Mahalle. `slug` is the subdomain and is unique.
- **TenantMembership** — the join between a User and a Tenant, carrying a
  `roleId`. `@@unique([tenantId, userId])` — a user has at most one role per
  tenant. Every tenant-authorization check resolves through this table.
- **Role** — scoped to a tenant (`@@unique([tenantId, key])`) so each Mahalle
  can, in the future, define custom roles. Seed data creates the standard
  OWNER/ADMIN/MODERATOR/EDITOR/STAFF/MEMBER set for every tenant.
- **Permission** — a platform-wide, tenant-independent catalogue of granular
  permission strings (`members.view`, `events.create`, ...), kept in sync with
  `packages/types/src/permissions.ts`.
- **RolePermission** — join table granting permissions to a role.
- **PlatformMembership** — grants a User access to `control.example.com`.
  Deliberately **not** derived from any TenantMembership/Role — platform
  authorization is a fully separate code path (see [authorization.md](authorization.md)).
- **AuditLog** — append-only. No module ever updates or deletes a row here.
  `actorUserId` and `tenantId` are nullable so system-initiated or
  pre-authentication events (e.g. failed logins) can still be recorded.
- **RefreshToken** — Phase 2. Only a SHA-256 hash of the token is stored;
  rotated on every use, with reuse-of-a-rotated-token revoking the whole
  chain. See [authentication.md](authentication.md).

## Business entities (Phase 7 — all follow the same pattern)

Every table below is tenant-owned (`tenantId` FK, `@@index([tenantId, isActive])`),
soft-deleted via `isActive`, and every query scoped by `tenantId` — see
`apps/api/src/members/members.service.ts` for the canonical object-level
isolation pattern the other four copy exactly.

- **Member** — a Mahalle's own member-directory record. Deliberately
  separate from `User`: most members never have a platform login at all.
- **Family** — a household unit: `name`, `address`, `phone`.
- **Event** — a scheduled Mahalle event: `title`, `description`, `location`,
  `startsAt`/`endsAt`.
- **Announcement** — a public notice: `title`, `body`, `publishedAt`
  (nullable — null means draft).
- **Program** — an ongoing initiative: `name`, `description`.

Website content editing and billing/plans/subscriptions are not modeled yet.

## Conventions

- IDs are `cuid()` strings, not sequential integers — they don't leak record
  counts and are safe to expose in URLs.
- Every table has `createdAt`; mutable tables also have `updatedAt` (`@updatedAt`).
- Tenant-owned tables carry a `tenantId` foreign key with an index that leads
  with `tenantId` for efficient per-tenant queries and to make tenant-scoped
  queries the natural/obvious way to write them.
- Foreign keys use `onDelete: Cascade` for ownership relationships
  (Tenant → TenantMembership) and `onDelete: Restrict`/`SetNull` where deleting
  the parent should not silently cascade-delete meaningful history (Role,
  AuditLog).

## What's deliberately not here yet

Website content editing and billing/plans/subscriptions aren't modeled. If a
future business table is needed, follow the same recipe every Phase 7 table
above used: a Prisma model with a `tenantId` FK, a tenant-scoped +
permission-gated NestJS module, object-level isolation e2e tests, and an
admin UI page. See [architecture.md](architecture.md#implementation-phases).

## Local setup

```bash
docker compose -f docker/docker-compose.yml up -d   # Postgres + Redis
pnpm db:migrate                                       # apply schema
pnpm db:seed                                          # demo tenant + users
pnpm db:studio                                        # browse data
```
