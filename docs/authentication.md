# Authentication

> Status: implemented in **Phase 2** — `apps/api/src/auth`. Control-plane MFA/
> SSO/step-up auth and impersonation are still design-only (see their sections
> below); everything else on this page reflects what's actually running.

## Single identity, multiple applications

One `User` row identifies a person across the entire platform — the marketing
site, every tenant site, `admin.example.com`, `control.example.com`, and
future Flutter apps. **Authentication and authorization are separate:**
successfully logging in proves *who* you are; it grants no access by itself.
What you can do in a given app is decided per-request by the authorization
layer (see [authorization.md](authorization.md)).

## Session strategy

- **Access token** — a short-lived JWT (`JWT_ACCESS_TTL`, default 15m),
  signed with `JWT_ACCESS_SECRET`, carrying just `{ sub, email }`. Set as an
  **HttpOnly, SameSite=Lax** cookie (`access_token`) for web — never
  `localStorage` or a client-readable cookie. The same strategy also accepts
  it as an `Authorization: Bearer` header, so future Flutter apps use the
  identical login endpoint and validation path.
- **Refresh token** — a high-entropy random string (`JWT_REFRESH_TTL`,
  default 30d), stored only as a SHA-256 hash in the `RefreshToken` table
  (`apps/api/src/auth/token.service.ts`). `POST /auth/refresh` rotates it on
  every use: the old token is marked revoked and a new one issued. Presenting
  an already-rotated-away token revokes the *entire* chain for that user —
  a strong signal of a stolen token, so the legitimate holder is forced to
  re-authenticate rather than the API silently trusting a copy that
  shouldn't still exist.
- Passwords are hashed with bcrypt (cost factor 12) before storage —
  `User.passwordHash`, never plaintext, never reversible.
- Failed logins are throttled per-email via Redis (`LoginLockoutService`,
  5 attempts / 15 minutes) independently of the per-IP rate limiter
  (`@nestjs/throttler`), so rotating IPs doesn't bypass the lockout.
- CSRF is handled by a double-submit cookie: a non-HttpOnly `csrf_token`
  cookie is set alongside the session, and `CsrfGuard` requires every
  mutating request to echo it in an `x-csrf-token` header — readable by our
  own frontend's JS, not by a cross-origin attacker page. `login`/`register`/
  `refresh`/`logout` are exempt (`@SkipCsrf()`) since they either establish
  that cookie or only ever affect the caller's own session.
- Every login attempt (success, failure, lockout) and logout is written to
  `AuditLog` via `AuditService`.

## Control-plane sessions

`control.example.com` sessions are treated as higher-risk by design:

- Shorter session lifetime than tenant/admin sessions.
- Reserved hooks for MFA and step-up re-authentication before sensitive
  actions (delete tenant, grant Super Admin, change billing, export data,
  impersonate — see below).
- Foundations for SSO are kept in mind in the session/user model so it can be
  added without a data-model migration later.

## Impersonation ("login as user")

Designed now, implemented later, and never silent:

- Explicit: an impersonation session is a distinct, clearly-flagged session
  type, not a quiet swap of `userId`.
- Short-lived and revocable independently of the impersonator's own session.
- Every impersonation session is audit-logged with `impersonated_by`,
  `target_user`, `target_tenant`, `reason`, `created_at`, `expires_at`, and a
  `session_id` linking back to the audit trail.
- Always visible in the UI while active (a persistent banner), never a
  behind-the-scenes context switch.

## What Next.js does and doesn't do

Next.js reads the session cookie to decide what to render (e.g. redirect to
login, show a logged-in header) but never makes the final authorization call.
Every sensitive read/write goes through the API, which re-validates the
session and re-checks permissions itself.
