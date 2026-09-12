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

/**
 * families/events/announcements/programs all follow the exact same
 * tenant-scoping pattern as members (see members.e2e-spec.ts for the most
 * thoroughly-commented version of these checks). This file proves the same
 * three guarantees — permission gating, CRUD, and object-level isolation —
 * hold for each, without re-deriving the reasoning each time.
 */
describe("Business modules (families/events/announcements/programs) (e2e)", () => {
  let app: INestApplication;
  const runId = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

  let ownerA: TestSession;
  let ownerB: TestSession;
  let plainMemberA: TestSession;
  const slugA = `e2e-biz-a-${runId}`;
  const slugB = `e2e-biz-b-${runId}`;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.use(cookieParser("test-session-secret"));
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.setGlobalPrefix("api/v1", { exclude: ["health"] });
    await app.init();

    ownerA = await registerAndGetSession(app, `e2e-biz-owner-a-${runId}@example.com`);
    ownerB = await registerAndGetSession(app, `e2e-biz-owner-b-${runId}@example.com`);
    plainMemberA = await registerAndGetSession(app, `e2e-biz-plain-a-${runId}@example.com`);

    const createA = await withSession(request(app.getHttpServer()).post("/api/v1/tenants"), ownerA).send({
      slug: slugA,
      name: "E2E Biz Tenant A"
    });
    expect(createA.status).toBe(201);

    const createB = await withSession(request(app.getHttpServer()).post("/api/v1/tenants"), ownerB).send({
      slug: slugB,
      name: "E2E Biz Tenant B"
    });
    expect(createB.status).toBe(201);

    const addPlainMember = await withSession(
      request(app.getHttpServer()).post(`/api/v1/tenants/${slugA}/admins`),
      ownerA
    ).send({ email: `e2e-biz-plain-a-${runId}@example.com`, roleKey: "MEMBER" });
    expect(addPlainMember.status).toBe(201);
  });

  afterAll(async () => {
    await app.close();
  });

  describe.each([
    {
      resource: "families",
      permission: "families.view",
      createPayload: { name: "The Test Family", address: "1 Test St" },
      idField: "id",
      listField: "families",
      singularField: "family"
    },
    {
      resource: "events",
      permission: "events.view",
      createPayload: { title: "Test Event", startsAt: new Date(Date.now() + 86400000).toISOString() },
      idField: "id",
      listField: "events",
      singularField: "event"
    },
    {
      resource: "announcements",
      permission: "announcements.view",
      createPayload: { title: "Test Announcement", body: "Something important." },
      idField: "id",
      listField: "announcements",
      singularField: "announcement"
    },
    {
      resource: "programs",
      permission: "programs.view",
      createPayload: { name: "Test Program", description: "A community program." },
      idField: "id",
      listField: "programs",
      singularField: "program"
    }
  ])("$resource", ({ resource, createPayload, listField, singularField }) => {
    let createdId: string;

    it("PERMISSION CHECK: a plain MEMBER cannot list", async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/tenants/${slugA}/${resource}`)
        .set("Cookie", plainMemberA.cookie).set("x-app", plainMemberA.appScope);
      expect(res.status).toBe(403);
    });

    it("owner can create", async () => {
      const res = await withSession(
        request(app.getHttpServer()).post(`/api/v1/tenants/${slugA}/${resource}`),
        ownerA
      ).send(createPayload);
      expect(res.status).toBe(201);
      createdId = res.body.data[singularField].id;
      expect(createdId).toBeTruthy();
    });

    it("owner can list and find the created record", async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/tenants/${slugA}/${resource}`)
        .set("Cookie", ownerA.cookie).set("x-app", ownerA.appScope);
      expect(res.status).toBe(200);
      expect(res.body.data[listField].some((r: { id: string }) => r.id === createdId)).toBe(true);
    });

    it("OBJECT-LEVEL ISOLATION: the record 404s under tenant B's scope, even for B's own owner", async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/tenants/${slugB}/${resource}/${createdId}`)
        .set("Cookie", ownerB.cookie).set("x-app", ownerB.appScope);
      expect(res.status).toBe(404);
    });

    it("owner can delete (soft) — subsequent lookup 404s", async () => {
      const del = await withSession(
        request(app.getHttpServer()).delete(`/api/v1/tenants/${slugA}/${resource}/${createdId}`),
        ownerA
      );
      expect(del.status).toBe(200);

      const getRes = await request(app.getHttpServer())
        .get(`/api/v1/tenants/${slugA}/${resource}/${createdId}`)
        .set("Cookie", ownerA.cookie).set("x-app", ownerA.appScope);
      expect(getRes.status).toBe(404);
    });
  });
});
