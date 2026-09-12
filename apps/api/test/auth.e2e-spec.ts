import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Test } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { HttpExceptionFilter } from "../src/common/filters/http-exception.filter";
import { ResponseInterceptor } from "../src/common/interceptors/response.interceptor";
import { cookieHeader, extractCookie } from "./helpers";
import { APP_SCOPE_HEADER } from "../src/auth/app-scope";

// Every session is scoped to the calling app (admin/control/tenant) — see
// apps/api/src/auth/app-scope.ts. These tests exercise the auth mechanics
// themselves, not app-scope isolation, so a single fixed scope is enough;
// every request against a cookie set here must carry the matching x-app
// header, or the API won't find the right scoped cookie name.
const APP = "admin";
const scoped = (base: string) => `${APP}_${base}`;

describe("Auth (e2e)", () => {
  let app: INestApplication;
  const runId = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  const email = `e2e-auth-${runId}@example.com`;
  const password = "SuperSecret123";

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.use(cookieParser("test-session-secret"));
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.setGlobalPrefix("api/v1", { exclude: ["health"] });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("rejects registration with a weak password", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/auth/register")
      .set(APP_SCOPE_HEADER, APP)
      .send({ email, password: "weak", fullName: "Weak Password" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects registration with no x-app header", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/auth/register")
      .send({ email, password, fullName: "No App Header" });
    expect(res.status).toBe(400);
  });

  it("registers a new user and sets session cookies", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/auth/register")
      .set(APP_SCOPE_HEADER, APP)
      .send({ email, password, fullName: "E2E Auth Test" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(email);
    expect(res.body.data.user.passwordHash).toBeUndefined();

    const setCookie = res.headers["set-cookie"] as unknown as string[];
    expect(extractCookie(setCookie, scoped("access_token"))).toBeTruthy();
    expect(extractCookie(setCookie, scoped("refresh_token"))).toBeTruthy();
  });

  it("rejects registering the same email twice", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/auth/register")
      .set(APP_SCOPE_HEADER, APP)
      .send({ email, password, fullName: "Duplicate" });
    expect(res.status).toBe(409);
  });

  it("rejects login with the wrong password", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .set(APP_SCOPE_HEADER, APP)
      .send({ email, password: "TotallyWrongPassword1" });
    expect(res.status).toBe(401);
  });

  it("locks the account out after repeated failed attempts", async () => {
    for (let i = 0; i < 5; i++) {
      await request(app.getHttpServer())
        .post("/api/v1/auth/login")
        .set(APP_SCOPE_HEADER, APP)
        .send({ email, password: "TotallyWrongPassword1" });
    }
    const res = await request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .set(APP_SCOPE_HEADER, APP)
      .send({ email, password }); // even the CORRECT password is now locked out
    expect(res.status).toBe(401);
    expect(res.body.error.message).toMatch(/too many/i);
  });

  describe("after lockout window", () => {
    // Uses a second, freshly-registered user so this suite isn't blocked by
    // the lockout the previous test intentionally triggered.
    const email2 = `e2e-auth-2-${runId}@example.com`;
    let accessCookie: string | undefined;
    let refreshCookie: string | undefined;

    it("logs in successfully with correct credentials", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/auth/register")
        .set(APP_SCOPE_HEADER, APP)
        .send({ email: email2, password, fullName: "E2E Auth Test 2" });

      const res = await request(app.getHttpServer())
        .post("/api/v1/auth/login")
        .set(APP_SCOPE_HEADER, APP)
        .send({ email: email2, password });

      expect(res.status).toBe(200);
      const setCookie = res.headers["set-cookie"] as unknown as string[];
      accessCookie = extractCookie(setCookie, scoped("access_token"));
      refreshCookie = extractCookie(setCookie, scoped("refresh_token"));
      expect(accessCookie).toBeTruthy();
      expect(refreshCookie).toBeTruthy();
    });

    it("rejects /auth/me with no session", async () => {
      const res = await request(app.getHttpServer()).get("/api/v1/auth/me").set(APP_SCOPE_HEADER, APP);
      expect(res.status).toBe(401);
    });

    it("returns the current user from /auth/me with a valid access cookie", async () => {
      const res = await request(app.getHttpServer())
        .get("/api/v1/auth/me")
        .set(APP_SCOPE_HEADER, APP)
        .set("Cookie", cookieHeader({ [scoped("access_token")]: accessCookie }));
      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe(email2);
    });

    it("rotates tokens on /auth/refresh and invalidates the old refresh token", async () => {
      const res = await request(app.getHttpServer())
        .post("/api/v1/auth/refresh")
        .set(APP_SCOPE_HEADER, APP)
        .set("Cookie", cookieHeader({ [scoped("refresh_token")]: refreshCookie }));
      expect(res.status).toBe(200);

      const setCookie = res.headers["set-cookie"] as unknown as string[];
      const newRefresh = extractCookie(setCookie, scoped("refresh_token"));
      expect(newRefresh).toBeTruthy();
      expect(newRefresh).not.toBe(refreshCookie);

      // Reusing the now-rotated-away original refresh token must fail.
      const reuse = await request(app.getHttpServer())
        .post("/api/v1/auth/refresh")
        .set(APP_SCOPE_HEADER, APP)
        .set("Cookie", cookieHeader({ [scoped("refresh_token")]: refreshCookie }));
      expect(reuse.status).toBe(401);
    });

    it("logs out and revokes the refresh token", async () => {
      const login = await request(app.getHttpServer())
        .post("/api/v1/auth/login")
        .set(APP_SCOPE_HEADER, APP)
        .send({ email: email2, password });
      const setCookie = login.headers["set-cookie"] as unknown as string[];
      const access = extractCookie(setCookie, scoped("access_token"));
      const refresh = extractCookie(setCookie, scoped("refresh_token"));

      const logout = await request(app.getHttpServer())
        .post("/api/v1/auth/logout")
        .set(APP_SCOPE_HEADER, APP)
        .set("Cookie", cookieHeader({ [scoped("access_token")]: access, [scoped("refresh_token")]: refresh }));
      expect(logout.status).toBe(200);

      const refreshAfterLogout = await request(app.getHttpServer())
        .post("/api/v1/auth/refresh")
        .set(APP_SCOPE_HEADER, APP)
        .set("Cookie", cookieHeader({ [scoped("refresh_token")]: refresh }));
      expect(refreshAfterLogout.status).toBe(401);
    });
  });
});
