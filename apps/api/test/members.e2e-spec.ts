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

describe("Members (e2e)", () => {
  let app: INestApplication;
  const runId = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

  let ownerA: TestSession;
  let ownerB: TestSession;
  let plainMemberA: TestSession;
  const slugA = `e2e-members-a-${runId}`;
  const slugB = `e2e-members-b-${runId}`;
  let memberIdInA: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.use(cookieParser("test-session-secret"));
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.setGlobalPrefix("api/v1", { exclude: ["health"] });
    await app.init();

    ownerA = await registerAndGetSession(app, `e2e-members-owner-a-${runId}@example.com`);
    ownerB = await registerAndGetSession(app, `e2e-members-owner-b-${runId}@example.com`);
    plainMemberA = await registerAndGetSession(app, `e2e-members-plain-a-${runId}@example.com`);

    const createA = await withSession(request(app.getHttpServer()).post("/api/v1/tenants"), ownerA).send({
      slug: slugA,
      name: "E2E Members Tenant A"
    });
    expect(createA.status).toBe(201);

    const createB = await withSession(request(app.getHttpServer()).post("/api/v1/tenants"), ownerB).send({
      slug: slugB,
      name: "E2E Members Tenant B"
    });
    expect(createB.status).toBe(201);

    const addPlainMember = await withSession(
      request(app.getHttpServer()).post(`/api/v1/tenants/${slugA}/admins`),
      ownerA
    ).send({ email: `e2e-members-plain-a-${runId}@example.com`, roleKey: "MEMBER" });
    expect(addPlainMember.status).toBe(201);
  });

  afterAll(async () => {
    await app.close();
  });

  it("PERMISSION CHECK: a plain MEMBER (no members.view) cannot list members", async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/tenants/${slugA}/members`)
      .set("Cookie", plainMemberA.cookie).set("x-app", plainMemberA.appScope);
    expect(res.status).toBe(403);
  });

  it("owner can create a member", async () => {
    const res = await withSession(request(app.getHttpServer()).post(`/api/v1/tenants/${slugA}/members`), ownerA).send({
      fullName: "Jane Member",
      email: "jane@example.com"
    });
    expect(res.status).toBe(201);
    expect(res.body.data.member.fullName).toBe("Jane Member");
    memberIdInA = res.body.data.member.id;
  });

  it("owner can list and paginate members", async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/tenants/${slugA}/members?page=1&pageSize=10`)
      .set("Cookie", ownerA.cookie).set("x-app", ownerA.appScope);
    expect(res.status).toBe(200);
    expect(res.body.data.members.some((m: { id: string }) => m.id === memberIdInA)).toBe(true);
    expect(res.body.data.meta.total).toBeGreaterThanOrEqual(1);
  });

  it("owner can update a member", async () => {
    const res = await withSession(
      request(app.getHttpServer()).patch(`/api/v1/tenants/${slugA}/members/${memberIdInA}`),
      ownerA
    ).send({ phone: "555-1234" });
    expect(res.status).toBe(200);
    expect(res.body.data.member.phone).toBe("555-1234");
  });

  it("OBJECT-LEVEL ISOLATION: tenant B's owner cannot reach tenant A's member even scoped under A's own slug (no membership in A)", async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/tenants/${slugA}/members/${memberIdInA}`)
      .set("Cookie", ownerB.cookie).set("x-app", ownerB.appScope);
    expect(res.status).toBe(403); // rejected at TenantContextGuard — not even a member of A
  });

  it("OBJECT-LEVEL ISOLATION: a member id from tenant A does not exist under tenant B's scope, even for B's own owner", async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/tenants/${slugB}/members/${memberIdInA}`)
      .set("Cookie", ownerB.cookie).set("x-app", ownerB.appScope);
    // ownerB IS a legitimate member of B, but memberIdInA belongs to A — the
    // query is scoped by tenantId, so this 404s rather than ever returning
    // (or worse, letting them modify) another tenant's record.
    expect(res.status).toBe(404);
  });

  it("owner can delete (soft) a member, after which it disappears from list and lookup 404s", async () => {
    const del = await withSession(
      request(app.getHttpServer()).delete(`/api/v1/tenants/${slugA}/members/${memberIdInA}`),
      ownerA
    );
    expect(del.status).toBe(200);

    const getRes = await request(app.getHttpServer())
      .get(`/api/v1/tenants/${slugA}/members/${memberIdInA}`)
      .set("Cookie", ownerA.cookie).set("x-app", ownerA.appScope);
    expect(getRes.status).toBe(404);

    const listRes = await request(app.getHttpServer())
      .get(`/api/v1/tenants/${slugA}/members`)
      .set("Cookie", ownerA.cookie).set("x-app", ownerA.appScope);
    expect(listRes.body.data.members.some((m: { id: string }) => m.id === memberIdInA)).toBe(false);
  });
});
