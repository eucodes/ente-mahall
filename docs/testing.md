# Testing

## API (`apps/api`)

- **Unit tests** (`pnpm --filter @mahalle/api test`, Vitest, `src/**/*.spec.ts`)
  — pure logic with no external dependencies, e.g. `env.validation.spec.ts`.
- **E2E tests** (`pnpm --filter @mahalle/api test:e2e`, Vitest, `test/**/*.e2e-spec.ts`)
  — boot the real Nest application module and hit it with `supertest`.
  Requires Postgres + Redis running (`docker compose -f docker/docker-compose.yml up -d`).
  `test/helpers.ts` holds shared cookie/CSRF plumbing (`registerAndGetSession`,
  `withSession`) every spec file below uses.

| File | Covers |
| --- | --- |
| `auth.e2e-spec.ts` | Weak-password/duplicate-email/wrong-password rejection, lockout after repeated failures, `/auth/me` requiring a valid session, refresh-token rotation, reuse of an already-rotated refresh token being rejected. |
| `tenants.e2e-spec.ts` | Reserved/duplicate slug rejection, public tenant lookup requiring no auth, `/tenants/mine` scoping per user, and the membership isolation test — an authenticated non-member gets 403 from `/tenants/:slug/me`. |
| `admins.e2e-spec.ts` | Permission check (no `admins.view` → 403), role-rank escalation prevention (an ADMIN can't create/promote another ADMIN or touch an OWNER), self-modification prevention, last-owner protection. |
| `platform.e2e-spec.ts` | Separation checks in both directions — a tenant OWNER has no platform access, a platform member has no automatic tenant access — plus platform-wide tenant listing and paginated audit logs. |
| `members.e2e-spec.ts` | Permission check, full CRUD, and **object-level isolation**: a member id from tenant A 404s when looked up under tenant B's scope, even for B's own legitimate owner — the strongest proof that tenant scoping is real, not just "is a member." |
| `business-modules.e2e-spec.ts` | The same three checks (permission gating, CRUD, object-level isolation) applied via `describe.each` to `families`, `events`, `announcements`, and `programs` — proves the pattern holds uniformly across all four without re-deriving the reasoning per module. |

## Critical authorization guarantees (all proven, not aspirational)

Each maps to a rule in [authorization.md](authorization.md), and each has a
passing e2e test — see the table above for which file:

- Tenant A cannot read or write Tenant B's data by changing a request
  parameter (object-level authorization).
- A normal member cannot call admin-only or `members.*`-gated endpoints.
- A Mahalle admin cannot reach the platform control plane, and a platform
  member has no automatic tenant access, in either direction.
- A user cannot grant themselves a permission or role they don't already
  outrank — enforced structurally (no self-service platform-grant endpoint
  exists at all; role-rank checks block self-modification and escalation).

These are written as e2e tests against real guards, not mocked — the point is
to prove the enforcement layer itself, not just the intent.

## Web (`apps/web`)

No component/integration test suite yet — verification so far has been
`pnpm typecheck`/`lint`/`build` plus live browser checks (page rendering,
redirects, real DB-backed data) and cross-checking the same request flows the
UI makes against the e2e-tested API. Worth adding a component test setup
(Vitest + Testing Library) once the UI surface grows past what manual/e2e
coverage can keep up with.

## What "done" means for a phase

A phase isn't complete when the code compiles — `pnpm typecheck`, `pnpm lint`,
and `pnpm test` all pass, and for anything touching the database or API, the
relevant e2e test exists and passes against a real running Postgres instance.
