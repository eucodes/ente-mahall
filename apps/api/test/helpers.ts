import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { APP_SCOPE_HEADER, type AppScope } from "../src/auth/app-scope";

/** Pulls a single cookie's value out of a Set-Cookie response header array. */
export function extractCookie(setCookieHeaders: string[] | undefined, name: string): string | undefined {
  const line = setCookieHeaders?.find((c) => c.startsWith(`${name}=`));
  return line?.split(";")[0]?.split("=")[1];
}

export function cookieHeader(cookies: Record<string, string | undefined>): string {
  return Object.entries(cookies)
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

export interface TestSession {
  /** Value for a `Cookie` request header — includes the app-scoped access_token and csrf_token. */
  cookie: string;
  /** Value for an `x-csrf-token` request header, required on any mutating request. */
  csrfToken: string;
  /** The app scope this session was established under — every request replaying it must send the matching x-app header (see apps/api/src/auth/app-scope.ts). */
  appScope: AppScope;
}

/**
 * Registers a fresh user and returns cookie/CSRF values ready to attach to
 * subsequent requests. Defaults to the "admin" app scope, since most of
 * these e2e suites exercise tenant-admin flows — pass a different scope
 * (e.g. "control" for platform tests) where it matters.
 */
export async function registerAndGetSession(
  app: INestApplication,
  email: string,
  password = "SuperSecret123",
  fullName = "Test User",
  appScope: AppScope = "admin"
): Promise<TestSession> {
  const res = await request(app.getHttpServer())
    .post("/api/v1/auth/register")
    .set(APP_SCOPE_HEADER, appScope)
    .send({ email, password, fullName });
  const setCookie = res.headers["set-cookie"] as unknown as string[];
  const accessToken = extractCookie(setCookie, `${appScope}_access_token`);
  const csrfToken = extractCookie(setCookie, `${appScope}_csrf_token`);
  if (!accessToken || !csrfToken) {
    throw new Error(`Registration did not return session cookies (status ${res.status}: ${JSON.stringify(res.body)})`);
  }
  return {
    cookie: cookieHeader({ [`${appScope}_access_token`]: accessToken, [`${appScope}_csrf_token`]: csrfToken }),
    csrfToken,
    appScope
  };
}

/** A supertest request pre-populated with a session's Cookie, x-csrf-token, and x-app headers. */
export function withSession(req: request.Test, session: TestSession): request.Test {
  return req.set("Cookie", session.cookie).set("x-csrf-token", session.csrfToken).set(APP_SCOPE_HEADER, session.appScope);
}
