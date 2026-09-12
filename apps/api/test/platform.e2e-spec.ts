import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Test } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { HttpExceptionFilter } from "../src/common/filters/http-exception.filter";
import { ResponseInterceptor } from "../src/common/interceptors/response.interceptor";
import { PrismaService } from "../src/database/prisma.service";
import { UsersService } from "../src/users/users.service";
import { registerAndGetSession, withSession, type TestSession } from "./helpers";

describe("Platform control plane (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const runId = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

  let platformStaff: TestSession;
  let superAdmin: TestSession;
  let tenantOwner: TestSession;
  const tenantSlug = `e2e-platform-${runId}`;
  let tenantId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.use(cookieParser("test-session-secret"));
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.setGlobalPrefix("api/v1", { exclude: ["health"] });
    await app.init();

    prisma = app.get(PrismaService);
    const usersService = app.get(UsersService);

    platformStaff = await registerAndGetSession(app, `e2e-platform-staff-${runId}@example.com`);
    superAdmin = await registerAndGetSession(app, `e2e-platform-super-${runId}@example.com`);
    tenantOwner = await registerAndGetSession(app, `e2e-platform-tenant-owner-${runId}@example.com`);

    // There is no self-service endpoint to grant platform access — that's
    // deliberate (see docs/authentication.md's impersonation/sensitive-ops
    // section). Simulating an ops-granted membership directly here.
    const staffUser = await usersService.findByEmail(`e2e-platform-staff-${runId}@example.com`);
    await prisma.platformMembership.create({
      data: { userId: staffUser!.id, role: "PLATFORM_STAFF" }
    });
    const superAdminUser = await usersService.findByEmail(`e2e-platform-super-${runId}@example.com`);
    await prisma.platformMembership.create({
      data: { userId: superAdminUser!.id, role: "SUPER_ADMIN" }
    });

    const createTenant = await withSession(request(app.getHttpServer()).post("/api/v1/tenants"), tenantOwner).send({
      slug: tenantSlug,
      name: "E2E Platform Tenant"
    });
    expect(createTenant.status).toBe(201);
    tenantId = createTenant.body.data.tenant.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it("rejects /platform/me with no session", async () => {
    const res = await request(app.getHttpServer()).get("/api/v1/platform/me");
    expect(res.status).toBe(401);
  });

  it("SEPARATION CHECK: a tenant OWNER has no automatic platform access", async () => {
    const res = await request(app.getHttpServer()).get("/api/v1/platform/me").set("Cookie", tenantOwner.cookie).set("x-app", tenantOwner.appScope);
    expect(res.status).toBe(403);
  });

  it("grants access to a real platform member", async () => {
    const res = await request(app.getHttpServer()).get("/api/v1/platform/me").set("Cookie", platformStaff.cookie).set("x-app", platformStaff.appScope);
    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe("PLATFORM_STAFF");
  });

  it("SEPARATION CHECK: a platform member has no automatic access to a tenant they don't belong to", async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/tenants/${tenantSlug}/me`)
      .set("Cookie", platformStaff.cookie).set("x-app", platformStaff.appScope);
    expect(res.status).toBe(403);
  });

  it("lists every tenant platform-wide, including one the caller doesn't personally belong to", async () => {
    const res = await request(app.getHttpServer()).get("/api/v1/platform/tenants").set("Cookie", platformStaff.cookie).set("x-app", platformStaff.appScope);
    expect(res.status).toBe(200);
    const slugs = res.body.data.tenants.map((t: { slug: string }) => t.slug);
    expect(slugs).toContain(tenantSlug);
  });

  it("lists audit logs with pagination", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/v1/platform/audit-logs?page=1&pageSize=5")
      .set("Cookie", platformStaff.cookie).set("x-app", platformStaff.appScope);
    expect(res.status).toBe(200);
    expect(res.body.data.entries.length).toBeLessThanOrEqual(5);
    expect(res.body.data.meta.page).toBe(1);
    expect(typeof res.body.data.meta.total).toBe("number");
  });

  it("ONE-MAHALLE-PER-ACCOUNT: the same owner cannot create a second Mahalle", async () => {
    const res = await withSession(request(app.getHttpServer()).post("/api/v1/tenants"), tenantOwner).send({
      slug: `${tenantSlug}-second`,
      name: "A second Mahalle"
    });
    expect(res.status).toBe(409);
  });

  describe("platform control over Mahalles (SUPER_ADMIN only)", () => {
    it("PLATFORM ROLE CHECK: PLATFORM_STAFF cannot suspend a tenant", async () => {
      const res = await withSession(
        request(app.getHttpServer()).patch(`/api/v1/platform/tenants/${tenantId}/status`),
        platformStaff
      ).send({ isActive: false });
      expect(res.status).toBe(403);
    });

    it("SUPER_ADMIN can suspend ('stop') a Mahalle, which then 404s publicly", async () => {
      const res = await withSession(
        request(app.getHttpServer()).patch(`/api/v1/platform/tenants/${tenantId}/status`),
        superAdmin
      ).send({ isActive: false });
      expect(res.status).toBe(200);
      expect(res.body.data.tenant.isActive).toBe(false);

      const publicLookup = await request(app.getHttpServer()).get(`/api/v1/tenants/${tenantSlug}`);
      expect(publicLookup.status).toBe(404);
    });

    it("SUPER_ADMIN can reactivate a suspended Mahalle", async () => {
      const res = await withSession(
        request(app.getHttpServer()).patch(`/api/v1/platform/tenants/${tenantId}/status`),
        superAdmin
      ).send({ isActive: true });
      expect(res.status).toBe(200);
      expect(res.body.data.tenant.isActive).toBe(true);

      const publicLookup = await request(app.getHttpServer()).get(`/api/v1/tenants/${tenantSlug}`);
      expect(publicLookup.status).toBe(200);
    });
  });

  describe("platform control over what a Mahalle's roles can do (SUPER_ADMIN only)", () => {
    let adminRoleId: string;

    it("any platform member can view a tenant's roles and permissions", async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/platform/tenants/${tenantId}/roles`)
        .set("Cookie", platformStaff.cookie).set("x-app", platformStaff.appScope);
      expect(res.status).toBe(200);
      const adminRole = res.body.data.roles.find((r: { key: string }) => r.key === "ADMIN");
      expect(adminRole).toBeTruthy();
      expect(adminRole.permissions).toContain("members.view");
      adminRoleId = adminRole.id;
    });

    it("PLATFORM ROLE CHECK: PLATFORM_STAFF cannot change a tenant's role permissions", async () => {
      const res = await withSession(
        request(app.getHttpServer()).patch(`/api/v1/platform/tenants/${tenantId}/roles/${adminRoleId}/permissions`),
        platformStaff
      ).send({ permissions: [] });
      expect(res.status).toBe(403);
    });

    it("SUPER_ADMIN can restrict what a tenant's ADMIN role can do, overriding the tenant OWNER's own setup", async () => {
      const res = await withSession(
        request(app.getHttpServer()).patch(`/api/v1/platform/tenants/${tenantId}/roles/${adminRoleId}/permissions`),
        superAdmin
      ).send({ permissions: ["members.view"] });
      expect(res.status).toBe(200);
      expect(res.body.data.role.permissions).toEqual(["members.view"]);

      const verify = await request(app.getHttpServer())
        .get(`/api/v1/platform/tenants/${tenantId}/roles`)
        .set("Cookie", superAdmin.cookie).set("x-app", superAdmin.appScope);
      const adminRole = verify.body.data.roles.find((r: { key: string }) => r.key === "ADMIN");
      expect(adminRole.permissions).toEqual(["members.view"]);
    });
  });

  describe("platform access to a Mahalle's own dashboard data", () => {
    let memberId: string;

    it("any platform member can view a tenant's members, even STAFF", async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/platform/tenants/${tenantId}/members`)
        .set("Cookie", platformStaff.cookie)
        .set("x-app", platformStaff.appScope);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data.members)).toBe(true);
    });

    it("PLATFORM ROLE CHECK: PLATFORM_STAFF cannot create a member through the platform route", async () => {
      const res = await withSession(
        request(app.getHttpServer()).post(`/api/v1/platform/tenants/${tenantId}/members`),
        platformStaff
      ).send({ fullName: "Should Be Rejected" });
      expect(res.status).toBe(403);
    });

    it("SUPER_ADMIN can create, view, and delete a member through the platform route, without a TenantMembership", async () => {
      const create = await withSession(
        request(app.getHttpServer()).post(`/api/v1/platform/tenants/${tenantId}/members`),
        superAdmin
      ).send({ fullName: "Platform-Created Member" });
      expect(create.status).toBe(201);
      memberId = create.body.data.member.id;
      expect(create.body.data.member.fullName).toBe("Platform-Created Member");

      const list = await request(app.getHttpServer())
        .get(`/api/v1/platform/tenants/${tenantId}/members`)
        .set("Cookie", superAdmin.cookie)
        .set("x-app", superAdmin.appScope);
      expect(list.body.data.members.some((m: { id: string }) => m.id === memberId)).toBe(true);

      const remove = await withSession(
        request(app.getHttpServer()).delete(`/api/v1/platform/tenants/${tenantId}/members/${memberId}`),
        superAdmin
      );
      expect(remove.status).toBe(200);
    });

    it("can view a tenant's administrators through the platform route", async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/platform/tenants/${tenantId}/admins`)
        .set("Cookie", superAdmin.cookie)
        .set("x-app", superAdmin.appScope);
      expect(res.status).toBe(200);
      expect(res.body.data.admins.some((a: { role: { key: string } }) => a.role.key === "OWNER")).toBe(true);
    });

    it("SEPARATION CHECK: a tenant OWNER cannot reach the platform's view of their own tenant", async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/platform/tenants/${tenantId}/members`)
        .set("Cookie", tenantOwner.cookie)
        .set("x-app", tenantOwner.appScope);
      expect(res.status).toBe(403);
    });
  });

  describe("bulk-deleting Mahalles", () => {
    it("PLATFORM ROLE CHECK: PLATFORM_STAFF cannot bulk-delete tenants", async () => {
      const res = await withSession(
        request(app.getHttpServer()).post("/api/v1/platform/tenants/bulk-delete"),
        platformStaff
      ).send({ tenantIds: [tenantId] });
      expect(res.status).toBe(403);
    });

    it("SUPER_ADMIN can bulk-delete several tenants at once, skipping ids that don't resolve", async () => {
      const first = await withSession(request(app.getHttpServer()).post("/api/v1/tenants"), platformStaff).send({
        slug: `${tenantSlug}-bulk-1`,
        name: "Bulk Delete Me 1"
      });
      const second = await withSession(request(app.getHttpServer()).post("/api/v1/tenants"), superAdmin).send({
        slug: `${tenantSlug}-bulk-2`,
        name: "Bulk Delete Me 2"
      });
      expect(first.status).toBe(201);
      expect(second.status).toBe(201);

      const res = await withSession(
        request(app.getHttpServer()).post("/api/v1/platform/tenants/bulk-delete"),
        superAdmin
      ).send({ tenantIds: [first.body.data.tenant.id, second.body.data.tenant.id, "not-a-real-id"] });
      expect(res.status).toBe(200);
      expect(res.body.data.deleted.sort()).toEqual([first.body.data.tenant.id, second.body.data.tenant.id].sort());
      expect(res.body.data.skipped).toEqual(["not-a-real-id"]);

      const lookup1 = await request(app.getHttpServer()).get(`/api/v1/tenants/${tenantSlug}-bulk-1`);
      const lookup2 = await request(app.getHttpServer()).get(`/api/v1/tenants/${tenantSlug}-bulk-2`);
      expect(lookup1.status).toBe(404);
      expect(lookup2.status).toBe(404);
    });
  });

  it("SUPER_ADMIN can permanently delete a Mahalle", async () => {
    const toDelete = await withSession(request(app.getHttpServer()).post("/api/v1/tenants"), platformStaff).send({
      slug: `${tenantSlug}-deleteme`,
      name: "Delete Me Mahalle"
    });
    expect(toDelete.status).toBe(201);
    const deleteTenantId = toDelete.body.data.tenant.id;

    const del = await withSession(
      request(app.getHttpServer()).delete(`/api/v1/platform/tenants/${deleteTenantId}`),
      superAdmin
    );
    expect(del.status).toBe(200);

    const lookup = await request(app.getHttpServer()).get(`/api/v1/tenants/${tenantSlug}-deleteme`);
    expect(lookup.status).toBe(404);
  });
});
