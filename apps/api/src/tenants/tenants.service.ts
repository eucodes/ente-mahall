import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { DEFAULT_ROLE_PERMISSIONS, TenantRole } from "@mahalle/types";
import type { Tenant } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import { isReservedSlug, type CreateTenantDto } from "./dto/create-tenant.dto";
import type { MembershipWithRole } from "../memberships/memberships.service";

@Injectable()
export class TenantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  findBySlug(slug: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({ where: { slug: slug.toLowerCase() } });
  }

  /** Used for public-facing lookups (tenant site) — 404s an inactive tenant exactly like a missing one. */
  async findActiveBySlugOrThrow(slug: string): Promise<Tenant> {
    const tenant = await this.findBySlug(slug);
    if (!tenant || !tenant.isActive) {
      throw new NotFoundException("Mahalle not found");
    }
    return tenant;
  }

  /**
   * Creates a new tenant, seeds its standard role set from
   * DEFAULT_ROLE_PERMISSIONS, and makes the creating user its OWNER — all in
   * one transaction so a partial tenant (e.g. roles but no owner) can never
   * exist.
   */
  async createTenant(
    ownerUserId: string,
    dto: CreateTenantDto,
    context: { ipAddress?: string; userAgent?: string }
  ): Promise<{ tenant: Tenant; membership: MembershipWithRole }> {
    const slug = dto.slug.toLowerCase();

    if (isReservedSlug(slug)) {
      throw new ConflictException("This Mahalle URL is reserved. Please choose another.");
    }
    if (await this.findBySlug(slug)) {
      throw new ConflictException("This Mahalle URL is already taken.");
    }

    const allPermissions = await this.prisma.permission.findMany();
    if (allPermissions.length === 0) {
      // Should be impossible outside a brand-new DB where the API hasn't
      // finished its first boot yet — PermissionsService seeds this on
      // startup. Fail loudly rather than silently creating powerless roles.
      throw new ConflictException("Permission catalogue is not yet initialized. Please try again shortly.");
    }

    const { tenant, ownerMembership } = await this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: { slug, name: dto.name, description: dto.description }
      });

      const roleByKey = new Map<TenantRole, string>();
      for (const [key, permissionKeys] of Object.entries(DEFAULT_ROLE_PERMISSIONS) as [
        TenantRole,
        readonly string[] | "*"
      ][]) {
        const role = await tx.role.create({
          data: { tenantId: tenant.id, key, name: key.charAt(0) + key.slice(1).toLowerCase() }
        });
        roleByKey.set(key, role.id);

        const grantedKeys = permissionKeys === "*" ? allPermissions.map((p) => p.key) : permissionKeys;
        const grantedPermissions = allPermissions.filter((p) => grantedKeys.includes(p.key));
        if (grantedPermissions.length > 0) {
          await tx.rolePermission.createMany({
            data: grantedPermissions.map((p) => ({ roleId: role.id, permissionId: p.id }))
          });
        }
      }

      const ownerRoleId = roleByKey.get(TenantRole.OWNER);
      if (!ownerRoleId) {
        throw new Error("OWNER role was not created — this is a bug in DEFAULT_ROLE_PERMISSIONS setup");
      }

      const ownerMembership = await tx.tenantMembership.create({
        data: { tenantId: tenant.id, userId: ownerUserId, roleId: ownerRoleId },
        include: { role: true }
      });

      return { tenant, ownerMembership };
    });

    await this.audit.record({
      actorUserId: ownerUserId,
      tenantId: tenant.id,
      action: "tenant.create",
      targetType: "Tenant",
      targetId: tenant.id,
      metadata: { slug: tenant.slug, name: tenant.name },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return { tenant, membership: ownerMembership };
  }
}
