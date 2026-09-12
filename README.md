# Mahalle SaaS

A production-oriented, multi-tenant SaaS platform for Mahalle management, built as a
modular monolith: one Next.js frontend, one NestJS API, one PostgreSQL database,
serving every Mahalle as an isolated tenant.

See [docs/](docs/) for the full architecture, database model, authentication and
authorization design, tenant-resolution strategy, UI system, and security model.

## Stack

- **Web:** Next.js (App Router) + React + TypeScript + Tailwind CSS
- **API:** NestJS + TypeScript, modular monolith (no microservices)
- **Database:** PostgreSQL + Prisma
- **Cache:** Redis
- **Monorepo:** pnpm workspaces + Turborepo
- **Mobile (future):** Flutter, consuming the same NestJS API

## Requirements

- Node.js >= 20
- pnpm (`corepack enable` will pick up the pinned version automatically)
- Docker (for local Postgres + Redis)

This project uses **pnpm exclusively**. Do not use npm, yarn, or bun.

## Getting started

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment variables and adjust as needed
cp .env.example .env

# 3. Start Postgres + Redis
docker compose -f docker/docker-compose.yml up -d

# 4. Apply the database schema and seed demo data
pnpm db:migrate
pnpm db:seed

# 5. Run everything (web + api) in dev mode
pnpm dev
```

Web runs at `http://localhost:3000`, API at `http://localhost:4000`. To log
in and have that session work across the admin/control/tenant hostnames too,
you'll need a few `/etc/hosts` entries first — see
[apps/web/README.md](apps/web/README.md) (plain `*.localhost` doesn't work
for this; browsers reject cross-subdomain session cookies scoped to it).

## Monorepo layout

```
apps/
  web/            Next.js — all frontend surfaces (marketing, tenant, admin, control)
  api/             NestJS — the single backend API
packages/
  ui/              Shared design system (Button, Dialog, Toast, DataTable, ...)
  types/           Shared TypeScript types/enums (roles, permissions, entities)
  validation/      Shared Zod schemas
  api-client/      Typed fetch wrapper consumed by web (and future Flutter/other clients)
  config/          Shared tsconfig, eslint, and Tailwind presets
database/
  prisma/          Prisma schema, migrations, seed script
docker/
  docker-compose.yml   Local Postgres + Redis
mobile/            Reserved for Flutter apps (Phase 9)
docs/              Architecture and process documentation
```

## Common commands

```bash
pnpm dev          # run all apps in dev mode
pnpm build        # build all apps/packages
pnpm lint         # lint all workspaces
pnpm typecheck    # typecheck all workspaces
pnpm test         # run all test suites
pnpm db:migrate   # apply Prisma migrations (dev)
pnpm db:seed      # seed demo data
pnpm db:studio    # open Prisma Studio
```

## Implementation phases

This project is built in phases; see [docs/architecture.md](docs/architecture.md#implementation-phases)
for the full list. **Phases 1–7 are complete** — members, families, events,
announcements, and programs all exist as tenant-scoped, permission-gated
modules with object-level isolation tests and admin UI. See
[docs/authorization.md](docs/authorization.md) for the full, tested
enforcement chain (membership, permissions, role-rank escalation prevention,
object-level isolation, platform/tenant separation). Phase 9 (Flutter)
hasn't started — a deliberate, discussed decision to keep improving the
web/API first.
# ente-mahall
