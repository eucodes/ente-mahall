# Architecture

## Overview

Mahalle is a modular monolith, not a microservices system. There is exactly one
NestJS API and one PostgreSQL database serving every tenant (Mahalle). The
Next.js app is the single frontend, serving four distinct hostnames from one
codebase via host-based routing.

```
                         ┌─────────────────────────┐
   Browser (any host) ─▶ │   Next.js (apps/web)     │
                         │   middleware.ts resolves │
                         │   host → route group     │
                         └───────────┬──────────────┘
                                     │ REST (api.example.com/api/v1)
                                     ▼
                         ┌─────────────────────────┐
                         │   NestJS (apps/api)      │
                         │   auth · tenants ·       │
                         │   roles · permissions ·  │
                         │   business modules       │
                         └───────────┬──────────────┘
                                     ▼
                         ┌─────────────────────────┐
                         │   PostgreSQL (Prisma)    │
                         │   one schema, tenant_id  │
                         │   on every tenant table  │
                         └─────────────────────────┘
```

Redis is used for caching and, from Phase 2 onward, session storage — not for
business data.

## Application boundaries

| Hostname | App surface | Audience |
| --- | --- | --- |
| `example.com` | Marketing site | Public / prospects |
| `admin.example.com` | Mahalle administration | Mahalle owners/administrators |
| `control.example.com` | Platform control plane | Platform Super Admin / staff only |
| `<slug>.example.com` | Tenant public site + `/dashboard` | Public visitors + Mahalle members |

A single Next.js deployment serves all four; see [tenant-routing.md](tenant-routing.md).

**Next.js is responsible for:** UI, pages, layouts, routing, SSR, SEO, hostname
handling, forms, frontend state, loading/error states.

**NestJS is responsible for:** authentication, authorization, tenant isolation,
business logic, database access, audit logging, validation, security. Critical
authorization decisions are never made in the frontend — see
[authorization.md](authorization.md).

## Module structure (`apps/api/src`)

```
auth/          Phase 2 — sessions, login/logout, password hashing (done)
users/         Phase 2 — user identity (done)
tenants/       Phase 3/4 — tenant creation, hostname resolution, TenantContextGuard,
               PermissionGuard, admin management with role-rank escalation checks (done)
memberships/   Phase 3 — active-membership lookup, the tenant-isolation check (done)
permissions/   Phase 3/4 — permission catalogue bootstrap + @RequirePermission enforcement (done)
platform/      Phase 5 — PlatformContextGuard, platform-wide tenant/audit-log views (done)
members/       Phase 7 — the reference-pattern Mahalle business feature (done)
families/      Phase 7 — same tenant-scoping pattern as members (done)
events/        Phase 7 — same tenant-scoping pattern as members (done)
announcements/ Phase 7 — same tenant-scoping pattern as members (done)
programs/      Phase 7 — same tenant-scoping pattern as members (done)
audit/         Ongoing — append-only audit log writer, used by every module (done)
health/        Phase 1 — liveness/readiness (done)
database/      Phase 1 — Prisma service/module (done)
common/        Phase 1 — response envelope, exception filter, CSRF guard, pagination DTO (done)
config/        Phase 1 — env validation, typed config (done)
```

Controllers stay thin; business logic lives in services. Authorization is
expressed declaratively via decorators/guards (`@RequirePermission('members.view')`
+ `PermissionGuard` for tenant routes, `PlatformContextGuard` for the control
plane) rather than scattered `if` checks in controllers. See
[authorization.md](authorization.md) for the full enforcement chain, all of
which is implemented and e2e-tested.

## Implementation phases

1. **Foundation** — workspace, both apps, shared packages, Docker, Prisma schema
   + seed, health endpoint, docs. *(done)*
2. **Authentication** — sessions, password hashing, login/logout, CSRF. *(done)*
3. **Multi-tenancy** — tenant creation, hostname resolution, membership, isolation. *(done)*
4. **Authorization** — roles, permissions, role-permission mapping, guards,
   role-rank escalation prevention. *(done)*
5. **Admin applications** — `admin.example.com` (per-tenant admin picker +
   administrator management) and `control.example.com` (platform-wide tenant
   list, audit log viewer). *(done)*
6. **Tenant application** — `<slug>.example.com` and `/dashboard` using
   dynamic tenant routing. *(done as part of Phase 3)*
7. **Mahalle features** — members, families, events, announcements, programs.
   **All five are done**: each has a Prisma model, a tenant-scoped +
   permission-gated NestJS module, object-level isolation e2e tests, and an
   admin UI page. `members` has the fullest UI (edit dialog included); the
   other four share `SimpleCreateForm`/`SimpleResourceTable` for add/list/
   remove — edit exists on their APIs (`PATCH`) but isn't wired to a UI
   button yet. Website content editing (a Phase 7 mention in the original
   brief) is not built. *(done)*
8. **API stabilization** — broader test coverage, API docs review, error
   handling audit. Ongoing rather than a hard gate — the four remaining
   business modules from Phase 7 are the bigger remaining surface.
9. **Flutter** — `mobile/client`, `mobile/admin`, both against the stable
   API. Not started — a different toolchain (Dart/Flutter SDK), worth
   confirming tooling availability and scope before beginning.

Each phase is built and verified before the next begins.
