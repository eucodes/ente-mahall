# Mobile

Reserved for the future Flutter applications (**Phase 9**, after the API is
stable):

- `client/` — member-facing app, consuming the same NestJS API as `apps/web`.
- `admin/` — Mahalle administrator app.

Both will authenticate against the same `apps/api` auth endpoints used by the
web app (see [../docs/authentication.md](../docs/authentication.md)) — no
separate mobile-only backend.

Not implemented yet — do not add Flutter code here until Phase 9.
