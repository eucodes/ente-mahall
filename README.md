# Ente Mahall

Digital management platform for Mahalls (Mosques and Mahall Committees). Working name — the
project will be renamed.

See [DECISIONS.md](./DECISIONS.md) for why the stack and architecture look the way they do.

## Structure

- `apps/web` — Next.js 16 web app
- `apps/backend` — NestJS 12 API
- `apps/mobile-member` — Flutter app for Mahall members and the public
- `apps/mobile-admin` — Flutter app for administrators, committee members, and staff
- `apps/mobile-shared/ente_mahall_core` — Dart package shared by both Flutter apps
- `packages/shared-types` — Zod schemas/types shared between the backend and web

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
docker compose up -d               # Postgres + Redis
cp apps/backend/.env.example apps/backend/.env
pnpm install
pnpm --filter backend exec prisma migrate dev --name init
pnpm dev                           # runs web + backend via Turborepo
```

Flutter apps are run independently:

```bash
cd apps/mobile-member && flutter run
cd apps/mobile-admin && flutter run
```
