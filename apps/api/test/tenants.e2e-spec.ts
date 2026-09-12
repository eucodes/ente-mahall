import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Test } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { HttpExceptionFilter } from "../src/common/filters/http-exception.filter";
import { ResponseInterceptor } from "../src/common/interceptors/response.interceptor";
import { registerAndGetSession, withSession, type TestSession } from "./helpers";

describe("Tenants (e2e)", () => {
  let app: INestApplication;
  const runId = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  const slug = `e2e-tenant-${runId}`;

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

  it("returns 404 for a tenant that doesn't exist, with no auth required", async () => {
    const res = await request(app.getHttpServer()).get(`/api/v1/tenants/definitely-not-a-real-tenant-${runId}`);
    expect(res.status).toBe(404);
  });

  it("rejects tenant creation without authentication", async () => {
    // CsrfGuard runs before JwtAuthGuard and rejects first (403) since a
    // fully anonymous request has no CSRF token either — still correctly
    // rejected, just by the outer layer.
    const res = await request(app.getHttpServer()).post("/api/v1/tenants").send({ slug, name: "E2E Tenant" });
    expect(res.status).toBe(403);
  });

  it("rejects a reserved slug", async () => {
    const owner = await registerAndGetSession(app, `e2e-owner-reserved-${runId}@example.com`);
    const res = await withSession(request(app.getHttpServer()).post("/api/v1/tenants"), owner).send({
      slug: "admin",
      name: "Should Fail"
    });
    expect(res.status).toBe(409);
  });

  describe("with a created tenant", () => {
    let owner: TestSession;
    let outsider: TestSession;

    beforeAll(async () => {
      owner = await registerAndGetSession(app, `e2e-owner-${runId}@example.com`);
      outsider = await registerAndGetSession(app, `e2e-outsider-${runId}@example.com`);

      const create = await withSession(request(app.getHttpServer()).post("/api/v1/tenants"), owner).send({
        slug,
        name: "E2E Tenant"
      });
      expect(create.status).toBe(201);
      expect(create.body.data.tenant.slug).toBe(slug);
      expect(create.body.data.role.key).toBe("OWNER");
    });

    it("rejects creating a second tenant with the same slug", async () => {
      const res = await withSession(request(app.getHttpServer()).post("/api/v1/tenants"), outsider).send({
        slug,
        name: "Duplicate"
      });
      expect(res.status).toBe(409);
    });

    it("exposes the tenant publicly with no auth required", async () => {
      const res = await request(app.getHttpServer()).get(`/api/v1/tenants/${slug}`);
      expect(res.status).toBe(200);
      expect(res.body.data.tenant.name).toBe("E2E Tenant");
    });

    it("lists the tenant under the owner's /tenants/mine", async () => {
      const res = await request(app.getHttpServer()).get("/api/v1/tenants/mine").set("Cookie", owner.cookie).set("x-app", owner.appScope);
      expect(res.status).toBe(200);
      const slugs = res.body.data.memberships.map((m: { tenant: { slug: string } }) => m.tenant.slug);
      expect(slugs).toContain(slug);
    });

    it("does NOT list the tenant under an unrelated user's /tenants/mine", async () => {
      const res = await request(app.getHttpServer()).get("/api/v1/tenants/mine").set("Cookie", outsider.cookie).set("x-app", outsider.appScope);
      expect(res.status).toBe(200);
      const slugs = res.body.data.memberships.map((m: { tenant: { slug: string } }) => m.tenant.slug);
      expect(slugs).not.toContain(slug);
    });

    it("rejects /tenants/:slug/me with no session", async () => {
      const res = await request(app.getHttpServer()).get(`/api/v1/tenants/${slug}/me`);
      expect(res.status).toBe(401);
    });

    it("returns the owner's role from /tenants/:slug/me", async () => {
      const res = await request(app.getHttpServer()).get(`/api/v1/tenants/${slug}/me`).set("Cookie", owner.cookie).set("x-app", owner.appScope);
      expect(res.status).toBe(200);
      expect(res.body.data.role.key).toBe("OWNER");
    });

    it("THE ISOLATION TEST: rejects /tenants/:slug/me for an authenticated user who is not a member of this tenant", async () => {
      const res = await request(app.getHttpServer()).get(`/api/v1/tenants/${slug}/me`).set("Cookie", outsider.cookie).set("x-app", outsider.appScope);
      expect(res.status).toBe(403);
    });
  });
});
