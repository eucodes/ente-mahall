import type { CookieOptions, Response } from "express";
import { ConfigService } from "@nestjs/config";
import type { AppScope } from "../auth/app-scope";
import { scopedCookieName } from "../auth/app-scope";
import { ACCESS_TOKEN_COOKIE } from "../auth/auth.constants";

function cookieOptions(config: ConfigService, maxAge?: number): CookieOptions {
  const isProd = config.get<string>("nodeEnv") === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    domain: config.getOrThrow<string>("cookieDomain"),
    path: "/",
    maxAge
  };
}

/** Members have no refresh token or CSRF cookie yet — see MemberTokenService. */
export function setMemberAuthCookie(res: Response, config: ConfigService, accessToken: string, app: AppScope, maxAgeMs: number): void {
  res.cookie(scopedCookieName(ACCESS_TOKEN_COOKIE, app), accessToken, cookieOptions(config, maxAgeMs));
}

export function clearMemberAuthCookie(res: Response, config: ConfigService, app: AppScope): void {
  res.clearCookie(scopedCookieName(ACCESS_TOKEN_COOKIE, app), cookieOptions(config));
}
