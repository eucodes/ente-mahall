# Ente Mahall

Multi-tenant SaaS platform for Mahalls (Mosques and Mahall Committees) — one deployment, many
tenants, each on its own subdomain. Working name — the project will be renamed.

See [DECISIONS.md](./DECISIONS.md) for why the stack and architecture look the way they do,
especially the "Tenant routing" and "Shared contracts" sections before touching `apps/web/src/proxy.ts`
or `packages/contracts`.

## Domains

| Host | Serves |
| --- | --- |
| `example.com` / `www.example.com` | Public marketing site |
| `admin.example.com` | Super Admin panel — manages all Mahalls, plans, subscriptions |
| `{slug}.example.com` | One Mahall's member-facing app |
| `{slug}.example.com/admin` | That Mahall's own admin panel |
| `api.example.com` | The one NestJS API, used by web and both Flutter apps |

One Next.js app serves every web surface above via hostname-based routing (`apps/web/src/proxy.ts`).
One NestJS app serves the API; tenant isolation is enforced there via the JWT's `mahallId` claim,
not by the subdomain a request arrived on.

## Structure

- `apps/web` — Next.js 16, all of the web surfaces above
- `apps/api` — NestJS 12 API (Prisma schema lives at `apps/api/prisma`)
- `mobile/client` — Flutter app for Mahall members and the public
- `mobile/admin` — Flutter app for administrators, committee members, and staff
- `mobile/core` — Dart package shared by both Flutter apps
- `packages/contracts` — Zod schemas (types + validation), shared by `apps/web` and `apps/api`

## Getting started

### Prerequisites

- Node.js 20+
- Flutter SDK
- Docker (for local Postgres/Redis)
- `pnpm` — not required globally; use `npx pnpm <command>`, or install once to a user prefix:
  ```bash
  npm install -g pnpm --prefix ~/.local/pnpm-global
  export PATH="$HOME/.local/pnpm-global/bin:$PATH"   # add to your shell profile
  ```

### Setup

```bash
docker compose -f docker/docker-compose.yml up -d   # Postgres + Redis
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
pnpm install
pnpm --filter api exec prisma migrate dev --name init
pnpm dev                                             # web + api, via Turborepo
```

`pnpm dev` builds `packages/contracts` first (both apps import its compiled output, not source —
see DECISIONS.md) and then runs web + api together.

### Local subdomains

Both `.env` files default `ROOT_DOMAIN` to `localhost`, so subdomain routing works immediately at:

- `http://localhost:3000` — marketing site
- `http://admin.localhost:3000` — Super Admin login
- `http://{any-slug}.localhost:3000` — a tenant app (404s until that Mahall exists in the DB)

Every modern browser and Node resolve `*.localhost` to `127.0.0.1` automatically — no `/etc/hosts`
edits needed.

Flutter apps are run independently:

```bash
cd mobile/client && flutter run
cd mobile/admin && flutter run
```
