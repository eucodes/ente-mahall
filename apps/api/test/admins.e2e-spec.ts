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

describe("Admins (e2e)", () => {
  let app: INestApplication;
  const runId = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  const slug = `e2e-admins-${runId}`;

  let owner: TestSession;
  let plainMember: TestSession;
  let promotedAdmin: TestSession;
  let promotedAdminMembershipId: string;
  let plainMemberMembershipId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.use(cookieParser("test-session-secret"));
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.setGlobalPrefix("api/v1", { exclude: ["health"] });
    await app.init();

    owner = await registerAndGetSession(app, `e2e-admins-owner-${runId}@example.com`);
    plainMember = await registerAndGetSession(app, `e2e-admins-member-${runId}@example.com`);
    promotedAdmin = await registerAndGetSession(app, `e2e-admins-promoted-${runId}@example.com`);

    const create = await withSession(request(app.getHttpServer()).post("/api/v1/tenants"), owner).send({
      slug,
      name: "E2E Admins Tenant"
    });
    expect(create.status).toBe(201);

    const addMember = await withSession(request(app.getHttpServer()).post(`/api/v1/tenants/${slug}/admins`), owner).send({
      email: `e2e-admins-member-${runId}@example.com`,
      roleKey: "MEMBER"
    });
    expect(addMember.status).toBe(201);
    plainMemberMembershipId = addMember.body.data.admin.id;

    const addAdmin = await withSession(request(app.getHttpServer()).post(`/api/v1/tenants/${slug}/admins`), owner).send({
      email: `e2e-admins-promoted-${runId}@example.com`,
      roleKey: "ADMIN"
    });
    expect(addAdmin.status).toBe(201);
    promotedAdminMembershipId = addAdmin.body.data.admin.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it("lets the owner list admins", async () => {
    const res = await request(app.getHttpServer()).get(`/api/v1/tenants/${slug}/admins`).set("Cookie", owner.cookie);
    expect(res.status).toBe(200);
    expect(res.body.data.admins.length).toBeGreaterThanOrEqual(3);
  });

  it("PERMISSION CHECK: a plain MEMBER (no admins.view) cannot list admins", async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/tenants/${slug}/admins`)
      .set("Cookie", plainMember.cookie);
    expect(res.status).toBe(403);
  });

  it("ESCALATION CHECK: an ADMIN cannot promote someone to ADMIN (same rank as themself)", async () => {
    const res = await withSession(request(app.getHttpServer()).post(`/api/v1/tenants/${slug}/admins`), promotedAdmin).send({
      email: `e2e-admins-member-${runId}@example.com`,
      roleKey: "ADMIN"
    });
    expect(res.status).toBe(403);
  });

  it("an ADMIN CAN promote someone to a role below themself (MODERATOR)", async () => {
    const res = await withSession(request(app.getHttpServer()).patch(`/api/v1/tenants/${slug}/admins/${plainMemberMembershipId}`), promotedAdmin).send({
      roleKey: "MODERATOR"
    });
    expect(res.status).toBe(200);
    expect(res.body.data.admin.role.key).toBe("MODERATOR");
  });

  it("ESCALATION CHECK: an ADMIN cannot remove the OWNER (outranks them)", async () => {
    const listRes = await request(app.getHttpServer()).get(`/api/v1/tenants/${slug}/admins`).set("Cookie", owner.cookie);
    const ownerMembership = listRes.body.data.admins.find((a: { role: { key: string } }) => a.role.key === "OWNER");

    const res = await withSession(request(app.getHttpServer()).delete(`/api/v1/tenants/${slug}/admins/${ownerMembership.id}`), promotedAdmin);
    expect(res.status).toBe(403);
  });

  it("SELF-MODIFICATION CHECK: cannot change your own role", async () => {
    const res = await withSession(request(app.getHttpServer()).patch(`/api/v1/tenants/${slug}/admins/${promotedAdminMembershipId}`), promotedAdmin).send({
      roleKey: "OWNER"
    });
    expect(res.status).toBe(400);
  });

  it("SELF-MODIFICATION CHECK: cannot remove yourself", async () => {
    const res = await withSession(request(app.getHttpServer()).delete(`/api/v1/tenants/${slug}/admins/${promotedAdminMembershipId}`), promotedAdmin);
    expect(res.status).toBe(400);
  });

  it("LAST OWNER CHECK: cannot demote the last owner", async () => {
    const listRes = await request(app.getHttpServer()).get(`/api/v1/tenants/${slug}/admins`).set("Cookie", owner.cookie);
    const ownerMembership = listRes.body.data.admins.find((a: { role: { key: string } }) => a.role.key === "OWNER");

    const res = await withSession(request(app.getHttpServer()).patch(`/api/v1/tenants/${slug}/admins/${ownerMembership.id}`), owner).send({
      roleKey: "ADMIN"
    });
    expect(res.status).toBe(400);
  });

  it("the owner CAN remove a non-owner admin", async () => {
    const res = await withSession(request(app.getHttpServer()).delete(`/api/v1/tenants/${slug}/admins/${promotedAdminMembershipId}`), owner);
    expect(res.status).toBe(200);

    // Removed membership loses even the base "is a member" access.
    const meRes = await request(app.getHttpServer()).get(`/api/v1/tenants/${slug}/me`).set("Cookie", promotedAdmin.cookie);
    expect(meRes.status).toBe(403);
  });
});
