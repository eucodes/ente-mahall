import { BadRequestException } from "@nestjs/common";
import type { Request } from "express";

/**
 * Each frontend "site" (admin, control, and every tenant subdomain) gets its
 * own session — logging into admin.mahalle.test must not also sign you into
 * control.mahalle.test, even though they share the same cookie domain and
 * the same underlying User account can hold both a TenantMembership and a
 * PlatformMembership. Cookies are scoped by prefixing their name with the
 * app the frontend identifies itself as (see APP_SCOPE_HEADER), since the
 * cookie's Domain attribute alone can't distinguish which subdomain a
 * request originated from — only the API host matters there, and every site
 * calls the same API host.
 */
export const APP_SCOPES = ["admin", "control", "tenant"] as const;
export type AppScope = (typeof APP_SCOPES)[number];

export const APP_SCOPE_HEADER = "x-app";

function readHeader(req: Request): string | undefined {
  const value = req.headers[APP_SCOPE_HEADER];
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Best-effort app scope from the request header — undefined if missing or
 * invalid, never throws. Use this wherever a session may legitimately be
 * absent (JWT extraction, CSRF check, non-web clients that authenticate with
 * a Bearer token instead of cookies).
 */
export function appScopeFromRequest(req: Request): AppScope | undefined {
  const value = readHeader(req);
  return value && (APP_SCOPES as readonly string[]).includes(value) ? (value as AppScope) : undefined;
}

/**
 * Same, but the caller requires a valid scope to proceed (login, register,
 * refresh, logout) — a missing/invalid header there is a client bug, not a
 * routine "not signed in" outcome.
 */
export function requireAppScope(req: Request): AppScope {
  const scope = appScopeFromRequest(req);
  if (!scope) {
    throw new BadRequestException(`Missing or invalid ${APP_SCOPE_HEADER} header`);
  }
  return scope;
}

export function scopedCookieName(base: string, app: AppScope): string {
  return `${app}_${base}`;
}
