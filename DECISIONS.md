# Architecture Decisions — Ente Mahall

Working name; project will be renamed later (see README).

This file records the foundational technical decisions made during initial setup, so future
sessions (human or agent) don't have to re-derive or re-litigate them.

## Tenancy

Shared Postgres database, single schema. Every tenant-scoped table carries a `mahallId` column
(see `apps/backend/prisma/schema.prisma`). Row-Level Security policies should be added via
migration SQL as the schema grows, so isolation is enforced at the database layer and not only in
application code — a query that forgets a `WHERE mahallId = ...` clause should fail closed, not
leak data across Mahalls.

## Repository layout

Single monorepo managed with Turborepo + pnpm workspaces:

```
apps/
  web/                    Next.js 16 (App Router, Turbopack)
  backend/                NestJS 12 (ESM, Vitest)
  mobile-member/          Flutter — Ente Mahall (member-facing)
  mobile-admin/           Flutter — Ente Mahall Admin
  mobile-shared/
    ente_mahall_core/     Shared Dart package (API client, models) used by both Flutter apps
packages/
  shared-types/           Zod schemas + inferred TS types, consumed by apps/web
  api-client/             (reserved) generated/typed HTTP client for web, once the API surface grows
  ui/                     (reserved) shared React components, if/when web needs a second consumer
```

The two Flutter apps are Dart/Flutter-tooled, not JS/TS, so they don't share pnpm/Turborepo
tooling with web/backend — they're just colocated in the same repo for atomic cross-cutting PRs
(e.g. an API contract change touching backend + both clients in one commit).

## Auth

Self-hosted JWT via NestJS + Passport (`apps/backend/src/auth`):

- Short-lived access tokens (15m default, configurable via `JWT_ACCESS_TTL`), signed with
  `JWT_ACCESS_SECRET`, validated by a Passport `jwt-access` strategy.
- Long-lived, rotating refresh tokens (30d default): a random 48-byte token, stored **hashed**
  (SHA-256) in the `refresh_tokens` table, never in plaintext. Every refresh revokes the used
  token and issues a new pair (rotation), so a leaked refresh token has a bounded window and reuse
  is detectable (a revoked token being replayed is a signal of compromise — not yet alerted on,
  worth adding later).
- Login is scoped by `mahallSlug` + `email` (a `User` is unique per `(mahallId, email)`, not
  globally unique by email) — the same email address can belong to different people in different
  Mahalls.
- Role-based authorization via `@Roles()` + `RolesGuard`, roles: `SUPER_ADMIN`, `MAHALL_ADMIN`,
  `STAFF`, `MEMBER`.
- Both Flutter apps and the web app hit the same REST endpoints; the Dart `ApiClient` in
  `mobile-shared/ente_mahall_core` mirrors the web's `apiFetch` (attach bearer token, refresh once
  on 401, retry).

## Finance / ledger

Contribution, donation, and expense tracking are first-class in the Prisma schema from day one
(`LedgerEntry`, `Member`) even though the UI for it will land in a later prompt. Amounts are
stored as integer cents (`amountCents`) to avoid floating-point rounding issues, with a per-entry
`currency` field (defaults to `INR`) rather than assuming a single currency platform-wide.

## Web stack

- **Next.js 16**, App Router, Turbopack (default in v16 — do not add `--webpack`).
- **State**: TanStack Query for server state (caching, refetching), Zustand for client/UI state
  (currently just the auth session, persisted to localStorage via `zustand/middleware persist`).
- **Forms**: React Hook Form + Zod via `@hookform/resolvers`.
- **UI**: shadcn/ui (this generator uses `@base-ui/react` under the hood, not Radix — components
  like `Button` don't support `asChild`; use `buttonVariants()` + a native element instead when you
  need a styled link/anchor).
- Next.js 16 has real breaking changes vs. most training data (async `params`/`searchParams`, no
  `next lint`, Turbopack by default, `middleware` renamed to `proxy`, etc). Read
  `apps/web/node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` before making
  assumptions about App Router conventions.

## Backend stack

- **NestJS 12**, ESM (`"type": "module"` — relative imports need explicit `.js` extensions in
  compiled output), Vitest instead of Jest.
- **Prisma 6** (stable) as the ORM — deliberately *not* Prisma 8, which at scaffold time is a
  release candidate that pulls in Cloudflare Workers/edge-runtime tooling (`workerd`,
  `alchemy.run`) irrelevant to a self-hosted Postgres backend. Re-evaluate once Prisma 7/8 is
  stable and its adapter model is clearer.
- **Validation**: Zod schemas via `nestjs-zod` (`createZodDto`), applied globally through
  `ZodValidationPipe` as `APP_PIPE` — DTOs are defined once and both validate at runtime and
  supply the TS type.
- Config is validated at boot (`src/config/env.validation.ts`) — the app fails fast on a missing
  or malformed `.env` rather than surfacing a confusing runtime error later.

## Shared contracts (web ↔ backend)

`packages/shared-types` holds Zod schemas (currently mirroring `auth` and `member` DTOs) that
`apps/web` imports directly as workspace source (not compiled) — Next's Turbopack bundler resolves
it via `moduleResolution: "bundler"` and extensionless imports. This only works for source-level
consumers; if the NestJS backend ever needs to import from this package, it will need compiled
`dist` output instead, since Nest's ESM/NodeNext resolution expects `.js` extensions on relative
imports. Today the backend's own Zod schemas in `src/**/dto` are kept manually in sync with this
package rather than sharing a single source — worth automating (e.g. generate one from the
backend's OpenAPI spec) once the API surface is bigger than a couple of endpoints.

## Local dev environment

- `docker-compose.yml` at the repo root runs Postgres 16 and Redis 7 for local development.
- `pnpm` is not installed globally on this machine (no write access to the global npm prefix);
  it's available via `corepack`/`npx pnpm` or a user-prefix install
  (`~/.local/pnpm-global`, added to `PATH` for shell sessions that need direct `pnpm` — see
  README).

## Open / deferred

- Redis + BullMQ wiring for background jobs (notifications, scheduled reminders) — package choice
  made, not yet wired into the backend.
- Postgres Row-Level Security policies — schema supports it (every table has `mahallId`), policies
  not yet written.
- Refresh-token reuse detection/alerting.
- go_router navigation structure for both Flutter apps — currently a single placeholder screen.
- CI (lint/typecheck/test on PR) — not set up yet.
