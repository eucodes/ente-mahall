import { randomBytes } from "node:crypto";
import type { CookieOptions, Response } from "express";
import { ConfigService } from "@nestjs/config";
import type { AppScope } from "./app-scope";
import { scopedCookieName } from "./app-scope";
import { ACCESS_TOKEN_COOKIE, CSRF_COOKIE, REFRESH_TOKEN_COOKIE } from "./auth.constants";
import type { IssuedTokens } from "./token.service";

function baseCookieOptions(config: ConfigService, httpOnly: boolean): CookieOptions {
  const isProd = config.get<string>("nodeEnv") === "production";
  return {
    httpOnly,
    secure: isProd,
    sameSite: "lax",
    domain: config.getOrThrow<string>("cookieDomain"),
    path: "/"
  };
}

/** Sets access/refresh/csrf cookies, scoped to the calling app, after login, register, or refresh. */
export function setAuthCookies(res: Response, config: ConfigService, tokens: IssuedTokens, app: AppScope): void {
  res.cookie(scopedCookieName(ACCESS_TOKEN_COOKIE, app), tokens.accessToken, {
    ...baseCookieOptions(config, true),
    maxAge: tokens.accessTokenTtlMs
  });
  res.cookie(scopedCookieName(REFRESH_TOKEN_COOKIE, app), tokens.refreshToken, {
    ...baseCookieOptions(config, true),
    maxAge: tokens.refreshTokenTtlMs
  });
  // Readable by frontend JS on purpose — see CsrfGuard for why this is safe.
  res.cookie(scopedCookieName(CSRF_COOKIE, app), randomBytes(32).toString("hex"), {
    ...baseCookieOptions(config, false),
    maxAge: tokens.refreshTokenTtlMs
  });
}

export function clearAuthCookies(res: Response, config: ConfigService, app: AppScope): void {
  const opts = baseCookieOptions(config, true);
  res.clearCookie(scopedCookieName(ACCESS_TOKEN_COOKIE, app), opts);
  res.clearCookie(scopedCookieName(REFRESH_TOKEN_COOKIE, app), opts);
  res.clearCookie(scopedCookieName(CSRF_COOKIE, app), { ...opts, httpOnly: false });
}
