import type { INestApplication } from "@nestjs/common";
import request from "supertest";

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
  /** Value for a `Cookie` request header — includes access_token and csrf_token. */
  cookie: string;
  /** Value for an `x-csrf-token` request header, required on any mutating request. */
  csrfToken: string;
}

/** Registers a fresh user and returns cookie/CSRF values ready to attach to subsequent requests. */
export async function registerAndGetSession(
  app: INestApplication,
  email: string,
  password = "SuperSecret123",
  fullName = "Test User"
): Promise<TestSession> {
  const res = await request(app.getHttpServer()).post("/api/v1/auth/register").send({ email, password, fullName });
  const setCookie = res.headers["set-cookie"] as unknown as string[];
  const accessToken = extractCookie(setCookie, "access_token");
  const csrfToken = extractCookie(setCookie, "csrf_token");
  if (!accessToken || !csrfToken) {
    throw new Error(`Registration did not return session cookies (status ${res.status}: ${JSON.stringify(res.body)})`);
  }
  return { cookie: cookieHeader({ access_token: accessToken, csrf_token: csrfToken }), csrfToken };
}

/** A supertest request pre-populated with a session's Cookie + x-csrf-token headers. */
export function withSession(req: request.Test, session: TestSession): request.Test {
  return req.set("Cookie", session.cookie).set("x-csrf-token", session.csrfToken);
}
