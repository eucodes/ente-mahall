# Architecture Decisions — Ente Mahall

Working name; project will be renamed later (see README).

This file records the foundational technical decisions made during setup, so future sessions
(human or agent) don't have to re-derive or re-litigate them.

## Multi-tenant SaaS shape

This is a single deployment serving many tenants (Mahalls) by subdomain, not a separate app or
database per tenant:

- `example.com` / `www.example.com` — public marketing site
- `admin.example.com` — Super Admin panel (manages all Mahalls, plans, subscriptions)
- `{slug}.example.com` — a Mahall's member-facing app
- `{slug}.example.com/admin` — that same Mahall's own admin panel (committee/staff)
- `api.example.com` — the one NestJS API, used by web and both Flutter apps

One Next.js app serves all of the web surfaces above; one NestJS app serves the API. See
"Tenant routing" and "Tenancy" below for how isolation is actually enforced.

## Tenancy

Shared Postgres database, single schema. Every tenant-scoped table carries a `mahallId` column
(see `apps/api/prisma/schema.prisma`). Row-Level Security policies should be added via migration
SQL as the schema grows, so isolation is enforced at the database layer and not only in
application code — a query that forgets a `WHERE mahallId = ...` clause should fail closed, not
leak data across Mahalls.

**The subdomain is never the authorization boundary.** `apps/web/src/proxy.ts` (Next's request
middleware, renamed from `middleware.ts` in Next 16) reads the `Host` header purely to decide
*which UI to render* — it rewrites `{slug}.example.com/*` to `/tenant/{slug}/*` internally. Actual
tenant scoping is enforced entirely by the API: every access token carries a signed `mahallId`
claim (`apps/api/src/auth/jwt-payload.ts`), and every tenant-scoped controller resolves the
Mahall from that claim (`requireMahallId()`, `apps/api/src/auth/require-mahall-id.ts`), never from
a client-supplied header or the subdomain a request happened to arrive on. A forged `Host` header
changes what page renders, not what data comes back.

`User.mahallId` is nullable — `SUPER_ADMIN` users aren't scoped to any Mahall, so a JWT's
`mahallId` claim is `string | null`. Any tenant-scoped code path must narrow it with
`requireMahallId()` before use.

## Tenant routing (`apps/web/src/proxy.ts`)

- `resolveHost()` (`apps/web/src/lib/tenant/hostname.ts`) classifies the `Host` header into
  `marketing | super-admin | tenant | unknown`, stripping the port and comparing against
  `ROOT_DOMAIN`.
- `marketing` passes through untouched — `(marketing)/page.tsx` and friends live at the real `/`
  path, nothing to rewrite.
- `super-admin` rewrites to `/admin/*`.
- `tenant` rewrites to `/tenant/{slug}/*`, which is why the tenant slug is a real dynamic route
  segment (`app/tenant/[slug]/`) rather than a route group — route groups can't carry a param, and
  a header-based approach (vs. URL rewrite) plays worse with caching/RSC. This follows the same
  pattern as Vercel's own multi-tenant platforms starter.
- `unknown` (a reserved word used as a subdomain, or a hostname outside `ROOT_DOMAIN`) 404s at the
  proxy, before any page even tries to render.
- Reserved slugs (`www`, `admin`, `api`, `app`, `dashboard`, `docs`, `status`, `mail`, `blog`) live
  once in `packages/contracts/src/reserved-slugs.ts` and are consumed by both the proxy (routing)
  and the Mahall-creation Zod schema (`packages/contracts/src/mahall.ts`) — the two can't disagree
  about what's claimable as a tenant slug.
- **Gotcha**: after a rewrite, client-side code (`usePathname()`, `<Link>`, `router.push()`) still
  sees the *original*, unrewritten browser path — `/login`, not `/admin/login` or
  `/tenant/{slug}/login`. Only server components see the rewritten path via their route params.
  Getting this backwards silently breaks client-side redirects; see `apps/web/src/app/admin/layout.tsx`
  for the comment where this bit us once already.
- `app/tenant/[slug]/layout.tsx` calls the public `GET /mahalls/:slug` endpoint and 404s if the
  Mahall doesn't exist — this is a real DB-backed lookup, not just a shape check, so a syntactically
  valid but nonexistent tenant slug still 404s.

## Auth

Self-hosted JWT via NestJS + Passport (`apps/api/src/auth`), with two separate login flows:

- **Tenant login** (`POST /auth/login`, used from `{slug}.example.com` and its `/admin`) — takes
  `mahallSlug` + `email` + `password`; a `User` is unique per `(mahallId, email)`, not globally
  unique by email, so the same address can belong to different people in different Mahalls.
- **Super Admin login** (`POST /auth/super-admin/login`, used only from `admin.example.com`) —
  email + password only, matched against `User` rows where `mahallId IS NULL AND role =
  'SUPER_ADMIN'`. Postgres treats `NULL` as distinct in the `(mahallId, email)` unique index, so
  this does *not* by itself guarantee one email per Super Admin — enforce that in `AuthService` if
  multiple Super Admins are ever created.
- Short-lived access tokens (15m default, `JWT_ACCESS_TTL`), long-lived rotating refresh tokens
  (30d default): a random 48-byte token stored **hashed** (SHA-256), never in plaintext. Every
  refresh revokes the used token and issues a new pair, so a leaked refresh token has a bounded
  window and reuse is at least detectable (not yet alerted on).
- Role-based authorization via `@Roles()` + `RolesGuard`: `SUPER_ADMIN`, `MAHALL_ADMIN`, `STAFF`,
  `MEMBER`.
- The login response includes `user: { id, mahallId, role }` alongside the tokens, so the web
  app's Zustand store (`apps/web/src/stores/auth-store.ts`) can persist a session without decoding
  the JWT client-side.
- On the web app, role gating in the UI (`apps/web/src/lib/auth/require-role.tsx`) is a redirect
  convenience only — it reads the persisted client session, not a verified token. The actual
  enforcement is the API's guard reading the JWT on every request; a page rendering behind
  `RequireRole` still can't get data the API wouldn't otherwise allow.
- Both Flutter apps and the web app hit the same REST endpoints; the Dart `ApiClient` in
  `mobile/core` mirrors the web's `apiFetch` (attach bearer token, refresh once on 401, retry).

## Subscriptions / plans

`Plan` and `Subscription` are first-class Prisma models (`apps/api/prisma/schema.prisma`) even
though the Super Admin UI for managing them is still a placeholder. A `Mahall` has at most one
`Subscription` (1:1); creating a Mahall (`POST /mahalls`, Super Admin only) also creates its
initial `Subscription` in a 14-day `TRIALING` state against the chosen `Plan`, in one write.
`Mahall.status` (`TRIAL | ACTIVE | SUSPENDED | ARCHIVED`) is separate from `Subscription.status`
(`TRIALING | ACTIVE | PAST_DUE | CANCELED`) — the former is what tenant-facing code should check
to decide whether to block non-billing actions; the latter is billing-system bookkeeping. Nothing
currently syncs the two automatically — that's a gap once real billing lands.

## Finance / ledger

Contribution, donation, and expense tracking are first-class in the Prisma schema (`LedgerEntry`,
`Member`) even though the UI for it will land in a later prompt. Amounts are stored as integer
cents (`amountCents`) to avoid floating-point rounding issues, with a per-entry `currency` field
(defaults to `INR`) rather than assuming a single currency platform-wide.

## Repository layout

Single monorepo managed with Turborepo + pnpm workspaces:

```
apps/
  web/                    Next.js 16 — marketing site + all tenant apps + both admin panels
  api/                    NestJS 12 (ESM, Vitest) — the one API for web + both Flutter apps
    prisma/               Schema lives here: nothing outside the API touches Postgres directly
mobile/
  client/                 Flutter — Mahall member/public app
  admin/                  Flutter — Mahall admin app (committee/staff)
  core/                   Shared Dart package: API client, models, used by both Flutter apps
packages/
  contracts/              Zod schemas (types + validation together) shared by apps/web and
                           apps/api — see "Shared contracts" below for how cross-runtime resolution
                           actually works
```

The two Flutter apps are Dart-tooled, not JS/TS, so they don't share pnpm/Turborepo tooling with
web/api — they're colocated for atomic cross-cutting PRs (an API contract change touching backend
+ both clients in one commit), not because the build tooling is shared.

## Shared contracts (`packages/contracts`)

Consumed by two runtimes with genuinely incompatible module resolution, which forced a real build
step rather than importing TS source directly:

- **`apps/web`** (Next/Turbopack, a bundler) resolves extensionless relative imports fine, but
  chokes on `.js`-suffixed specifiers pointing at `.ts` files.
- **`apps/api`** (NestJS, `"type": "module"`, NodeNext resolution) requires the opposite —
  relative imports *must* carry an explicit `.js` extension, even though the source files are
  `.ts`.

Trying to serve both consumers from the same `src/*.ts` files with extensionless imports (matching
`web`) broke `api`'s typecheck; switching to `.js`-suffixed imports (matching `api`) broke Next's
Turbopack build with "module has no exports". There's no import style that satisfies both directly
from source.

The fix: `packages/contracts` compiles to `dist/` (`pnpm --filter @ente-mahall/contracts build`,
plain `tsc`, NodeNext, `.js`-suffixed internal imports — correct for its own compilation), and
`package.json`'s `main`/`types` point at the compiled output, not `src/`. Both `web` and `api`
import the same compiled `dist/*.js` + `.d.ts`, so there's exactly one resolution story to reason
about. `turbo.json`'s `build` **and** `dev` tasks declare `"dependsOn": ["^build"]`, so Turborepo
builds `contracts` before starting `web`/`api` in dev — running `pnpm dev` from the root handles
this automatically; running `next dev`/`nest start` directly in an app dir does not, and needs
`contracts` already built.

## Web stack

- **Next.js 16**, App Router, Turbopack (default in v16 — do not add `--webpack`).
- **Request routing**: `apps/web/src/proxy.ts` — see "Tenant routing" above. Note the filename:
  Next 16 deprecated `middleware.ts` in favor of `proxy.ts` (and the exported function is named
  `proxy`, not `middleware`) — `next build` warns loudly if you use the old name.
- **State**: TanStack Query for server state (caching, refetching), Zustand for client/UI state
  (currently the auth session, persisted to localStorage via `zustand/middleware persist`).
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
  source, since there's no separate build-time rewrite step), Vitest instead of Jest.
- **Prisma 6** (stable) as the ORM — deliberately *not* Prisma 8, which at scaffold time is a
  release candidate that pulls in Cloudflare Workers/edge-runtime tooling (`workerd`,
  `alchemy.run`) irrelevant to a self-hosted Postgres backend. Re-evaluate once Prisma 7/8 is
  stable and its adapter model is clearer.
- **Validation**: Zod schemas via `nestjs-zod` (`createZodDto`), applied globally through
  `ZodValidationPipe` as `APP_PIPE` — DTOs are defined once and both validate at runtime and
  supply the TS type. Tenant-facing DTOs (`CreateMahallDto`, `CreatePlanDto`) wrap schemas from
  `packages/contracts` rather than redefining them, so the create-tenant validation the web app's
  form runs client-side is the same schema the API enforces server-side.
- **CORS** (`apps/api/src/main.ts`): origin is validated dynamically against `ROOT_DOMAIN` (must
  match the web app's `ROOT_DOMAIN`) rather than a fixed allowlist, since the API needs to accept
  requests from every tenant subdomain plus `admin.<root>` and the marketing root — a set that
  grows every time a Mahall signs up.
- Config is validated at boot (`src/config/env.validation.ts`) — the app fails fast on a missing
  or malformed `.env` rather than surfacing a confusing runtime error later.

## Local dev environment

- `docker/docker-compose.yml` runs Postgres 16 and Redis 7 for local development.
- Subdomain routing needs actual subdomains to test against locally. Using the `*.localhost`
  pattern (`abc.localhost:3000`, `admin.localhost:3000`) — every modern browser and Node resolve
  any `*.localhost` subdomain to `127.0.0.1` automatically, no `/etc/hosts` edits needed. Set via
  `ROOT_DOMAIN=localhost` (web and api `.env`, must match) and `NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000`
  (web only, includes the port since it's used client-side to build outbound links).
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
- `Mahall.status` and `Subscription.status` aren't synced automatically — no billing webhook /
  cron yet to suspend a Mahall on a lapsed subscription.
- go_router navigation structure for both Flutter apps — currently a single placeholder screen
  each; neither yet calls the API.
- Custom domains for tenants (vs. `{slug}.example.com`) — not supported; `resolveHost()` returns
  `unknown` (404) for any hostname outside `ROOT_DOMAIN`.
- CI (lint/typecheck/test on PR) — not set up yet.
- The full tenant-creation → tenant-login flow is implemented but not yet verified end-to-end
  against a real database in this environment (Docker Desktop wasn't running here) — verify with
  `docker compose -f docker/docker-compose.yml up -d && pnpm --filter api exec prisma migrate dev`
  before relying on it.
