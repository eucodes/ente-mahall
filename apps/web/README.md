# @mahalle/web

Next.js frontend for the Mahalle SaaS platform. Serves four hostnames from one app:

| Host | Route group | Purpose |
| --- | --- | --- |
| `example.com` | `sites/marketing` | Public marketing site |
| `admin.example.com` | `sites/admin` | Mahalle administration |
| `control.example.com` | `sites/control` | Platform control plane |
| `<slug>.example.com` | `sites/tenant/[tenant]` | Tenant public site + `/dashboard` |

[`src/middleware.ts`](src/middleware.ts) resolves the host and rewrites into the
matching route group. This is routing only — it never makes an authorization
decision; the API independently re-resolves tenant/role/permission on every
request.

## Development

```bash
pnpm install
pnpm --filter @mahalle/web dev
```

To exercise the different hosts locally, add these to `/etc/hosts` (all pointing
at `127.0.0.1`). Plain `*.localhost` won't work — browsers reject a session
cookie scoped with `Domain=.localhost` — so this uses the reserved `.test`
TLD instead (see [docs/dev-setup.md](../../docs/dev-setup.md)):

```
127.0.0.1 mahalle.test
127.0.0.1 admin.mahalle.test
127.0.0.1 control.mahalle.test
127.0.0.1 demo.mahalle.test
127.0.0.1 api.mahalle.test
```

Then visit `http://mahalle.test:3000`, `http://admin.mahalle.test:3000`,
`http://control.mahalle.test:3000`, and `http://demo.mahalle.test:3000`. One
login on any of these works on all of them.

## Design system

All UI primitives come from [`@mahalle/ui`](../../packages/ui) — no page builds
its own button/dialog/toast. Never use `alert()`/`confirm()`/`prompt()`; use
`useToast()` and `<ConfirmDialog />` instead.
