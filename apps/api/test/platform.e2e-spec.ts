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
  let tenantOwner: TestSession;
  const tenantSlug = `e2e-platform-${runId}`;

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
    tenantOwner = await registerAndGetSession(app, `e2e-platform-tenant-owner-${runId}@example.com`);

    // There is no self-service endpoint to grant platform access — that's
    // deliberate (see docs/authentication.md's impersonation/sensitive-ops
    // section). Simulating an ops-granted membership directly here.
    const staffUser = await usersService.findByEmail(`e2e-platform-staff-${runId}@example.com`);
    await prisma.platformMembership.create({
      data: { userId: staffUser!.id, role: "PLATFORM_STAFF" }
    });

    const createTenant = await withSession(request(app.getHttpServer()).post("/api/v1/tenants"), tenantOwner).send({
      slug: tenantSlug,
      name: "E2E Platform Tenant"
    });
    expect(createTenant.status).toBe(201);
  });

  afterAll(async () => {
    await app.close();
  });

  it("rejects /platform/me with no session", async () => {
    const res = await request(app.getHttpServer()).get("/api/v1/platform/me");
    expect(res.status).toBe(401);
  });

  it("SEPARATION CHECK: a tenant OWNER has no automatic platform access", async () => {
    const res = await request(app.getHttpServer()).get("/api/v1/platform/me").set("Cookie", tenantOwner.cookie);
    expect(res.status).toBe(403);
  });

  it("grants access to a real platform member", async () => {
    const res = await request(app.getHttpServer()).get("/api/v1/platform/me").set("Cookie", platformStaff.cookie);
    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe("PLATFORM_STAFF");
  });

  it("SEPARATION CHECK: a platform member has no automatic access to a tenant they don't belong to", async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/tenants/${tenantSlug}/me`)
      .set("Cookie", platformStaff.cookie);
    expect(res.status).toBe(403);
  });

  it("lists every tenant platform-wide, including one the caller doesn't personally belong to", async () => {
    const res = await request(app.getHttpServer()).get("/api/v1/platform/tenants").set("Cookie", platformStaff.cookie);
    expect(res.status).toBe(200);
    const slugs = res.body.data.tenants.map((t: { slug: string }) => t.slug);
    expect(slugs).toContain(tenantSlug);
  });

  it("lists audit logs with pagination", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/v1/platform/audit-logs?page=1&pageSize=5")
      .set("Cookie", platformStaff.cookie);
    expect(res.status).toBe(200);
    expect(res.body.data.entries.length).toBeLessThanOrEqual(5);
    expect(res.body.data.meta.page).toBe(1);
    expect(typeof res.body.data.meta.total).toBe("number");
  });
});
