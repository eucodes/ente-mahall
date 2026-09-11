# Development Setup

## Requirements

- Node.js >= 20
- pnpm — enable via `corepack enable`, which reads the `packageManager` field
  in the root `package.json` and uses the matching pnpm version automatically
- Docker (for local Postgres + Redis)

This project uses pnpm exclusively — no npm, yarn, or bun, in any script or
CI step.

## First-time setup

```bash
pnpm install
cp .env.example .env
docker compose -f docker/docker-compose.yml up -d
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## Environment variables

See `.env.example` for the full list with placeholder values. Key groups:

- **Database / Redis** — `DATABASE_URL`, `REDIS_URL`, pointed at the Docker
  Compose services by default.
- **API** — `PORT`, `JWT_ACCESS_SECRET`/`JWT_REFRESH_SECRET` and their TTLs,
  `SESSION_SECRET`, `COOKIE_DOMAIN`, `CORS_ORIGINS`.
- **Web** — `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_ROOT_DOMAIN`, plus per-app URLs
  used for cross-app links.

If you add a new required variable, add it here, to `.env.example`, and to
`apps/api/src/config/env.validation.ts` (the API refuses to boot if a required
variable is missing — this is intentional).

## Exercising the four hostnames locally

Plain `*.localhost` subdomains don't work for this: Chrome (and other
browsers) refuse to store a cookie whose `Domain` attribute is scoped to bare
`localhost`, since it isn't a registrable domain — and a session cookie
shared across subdomains is exactly what makes one login work on
`admin.`/`control.`/`<tenant>.` alike. Local dev instead uses `mahalle.test`
— `.test` is an IANA-reserved TLD set aside for exactly this purpose, so
browsers treat `mahalle.test` as a normal domain.

Add to `/etc/hosts` (all pointing at `127.0.0.1`):

```
127.0.0.1 mahalle.test
127.0.0.1 admin.mahalle.test
127.0.0.1 control.mahalle.test
127.0.0.1 demo.mahalle.test
127.0.0.1 api.mahalle.test
```

`.env.example`'s `COOKIE_DOMAIN`, `CORS_ORIGINS`, `NEXT_PUBLIC_ROOT_DOMAIN`,
and the per-app URL variables are already set up to match once you copy it to
`.env`. Then, with `pnpm dev` running:

- `http://mahalle.test:3000` — marketing
- `http://admin.mahalle.test:3000` — Mahalle admin
- `http://control.mahalle.test:3000` — platform control plane
- `http://demo.mahalle.test:3000` and `http://demo.mahalle.test:3000/dashboard` —
  the seeded demo tenant
- `http://api.mahalle.test:4000` — the API directly (e.g. `/health`)

`apps/web/next.config.ts` allowlists these hosts via `allowedDevOrigins` —
Next's dev server otherwise silently blocks Fast Refresh/HMR for any
non-default host, which looks like random broken client-side state (form
resets, no error) rather than an obvious error. If you exercise the app from
a host not already listed there, add it.

## `@mahalle/types` is a compiled package, not raw source

Every other internal package (`ui`, `validation`, `api-client`) is consumed
straight from `src/*.ts` — Next.js/Turbopack/Vitest all resolve that
transparently. `@mahalle/types` is the one exception: `apps/api` imports it
at real Node.js runtime (not through a bundler), and Node's native TypeScript
support does not resolve a package's internal relative imports the way
bundlers do. So `@mahalle/types` has a real `build` script (`tsc`) emitting
to `dist/`, and `package.json` points `main`/`exports` at that compiled
output. `turbo.json`'s `dev`/`build`/`typecheck`/`lint`/`test` tasks all
`dependsOn: ["^build"]`, so `pnpm dev`/`pnpm build` rebuild it automatically —
but if you edit `packages/types` while running `apps/api`'s dev server
directly (e.g. `pnpm --filter @mahalle/api dev`, bypassing Turbo), rebuild it
yourself (`pnpm --filter @mahalle/types build`) and restart the API. If a
future package needs the same runtime-import treatment, follow this one's
pattern rather than adding raw-`.ts`-as-`main` again.

## Seeded accounts

After `pnpm db:seed`:

| Email | Password | Access |
| --- | --- | --- |
| `platform-admin@mahalle.local` | `ChangeMe123!` | Platform Super Admin |
| `owner@demo.mahalle.local` | `ChangeMe123!` | Owner of the `demo` tenant |

These exist so the database and RBAC seed data can be inspected without
registering through the UI. You can also register a fresh account at
`http://mahalle.test:3000/register` — one login there works across every
hostname above.

## Useful commands

```bash
pnpm dev            # all apps, watch mode
pnpm build          # all apps/packages
pnpm lint           # all workspaces
pnpm typecheck      # all workspaces
pnpm test           # all workspaces
pnpm db:studio      # browse the database
pnpm --filter @mahalle/api test:e2e   # API e2e tests (needs Postgres running)
```
