import { Injectable, NotFoundException } from "@nestjs/common";
import type { PlatformMembership, Tenant } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";

export interface AuditLogQuery {
  page: number;
  pageSize: number;
}

export interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

export interface TenantRoleWithPermissions {
  id: string;
  key: string;
  name: string;
  permissions: string[];
}

export interface AuditLogEntry {
  id: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  metadata: unknown;
  ipAddress: string | null;
  createdAt: Date;
  actor: { id: string; email: string; fullName: string } | null;
  tenant: { id: string; slug: string; name: string } | null;
}

@Injectable()
export class PlatformService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  findActiveMembership(userId: string): Promise<PlatformMembership | null> {
    return this.prisma.platformMembership.findFirst({
      where: { userId, isActive: true }
    });
  }

  private serializeTenant(t: Tenant & { _count: { memberships: number } }) {
    return {
      id: t.id,
      slug: t.slug,
      name: t.name,
      isActive: t.isActive,
      createdAt: t.createdAt,
      memberCount: t._count.memberships
    };
  }

  /** Platform staff see every tenant, unlike apps/api's tenant endpoints which are always scoped to the caller's own memberships. */
  async listAllTenants() {
    const tenants = await this.prisma.tenant.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { memberships: { where: { isActive: true } } } } }
    });
    return tenants.map((t) => this.serializeTenant(t));
  }

  async getTenantDetail(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { _count: { select: { memberships: { where: { isActive: true } } } } }
    });
    if (!tenant) {
      throw new NotFoundException("Mahalle not found");
    }
    return this.serializeTenant(tenant);
  }

  async listAuditLogs({ page, pageSize }: AuditLogQuery): Promise<{ entries: AuditLogEntry[]; total: number }> {
    const [rows, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          actor: { select: { id: true, email: true, fullName: true } },
          tenant: { select: { id: true, slug: true, name: true } }
        }
      }),
      this.prisma.auditLog.count()
    ]);

    const entries: AuditLogEntry[] = rows.map((row) => ({
      id: row.id,
      action: row.action,
      targetType: row.targetType,
      targetId: row.targetId,
      metadata: row.metadata,
      ipAddress: row.ipAddress,
      createdAt: row.createdAt,
      actor: row.actor,
      tenant: row.tenant
    }));

    return { entries, total };
  }

  private async findTenantOrThrow(tenantId: string): Promise<Tenant> {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      throw new NotFoundException("Mahalle not found");
    }
    return tenant;
  }

  /**
   * "Stop" / reactivate a Mahalle. Unlike delete, this is reversible — the
   * tenant and all its data stay in place, but `findActiveBySlugOrThrow`
   * (used by every public/tenant-facing lookup) starts 404ing it, and its
   * members can no longer sign in to it.
   */
  async setTenantStatus(
    tenantId: string,
    isActive: boolean,
    actorUserId: string,
    context: RequestContext
  ): Promise<Tenant> {
    const existing = await this.findTenantOrThrow(tenantId);
    const tenant = await this.prisma.tenant.update({ where: { id: tenantId }, data: { isActive } });

    await this.audit.record({
      actorUserId,
      tenantId: tenant.id,
      action: isActive ? "platform.tenant.activate" : "platform.tenant.suspend",
      targetType: "Tenant",
      targetId: tenant.id,
      metadata: { slug: existing.slug, name: existing.name },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return tenant;
  }

  /**
   * Permanently deletes a tenant and everything under it (memberships,
   * roles, members, families, events, announcements, programs — all
   * `onDelete: Cascade` from Tenant). Irreversible; SUPER_ADMIN only (see
   * PlatformController). The audit entry is written with `tenantId: null`
   * since the row won't exist to reference — the slug/name/id live in
   * `metadata` instead.
   */
  async deleteTenant(tenantId: string, actorUserId: string, context: RequestContext): Promise<void> {
    const tenant = await this.findTenantOrThrow(tenantId);
    await this.prisma.tenant.delete({ where: { id: tenantId } });

    await this.audit.record({
      actorUserId,
      tenantId: null,
      action: "platform.tenant.delete",
      targetType: "Tenant",
      targetId: tenant.id,
      metadata: { slug: tenant.slug, name: tenant.name },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  /**
   * Deletes several tenants in one action — same effect as `deleteTenant`
   * per tenant, just looped so the control plane can offer a bulk-select UI.
   * Ids that don't resolve to a real tenant are skipped (not fatal) so one
   * stale row in a large selection doesn't abort the rest; the caller gets
   * back which ids actually got deleted and which were skipped.
   */
  async bulkDeleteTenants(
    tenantIds: string[],
    actorUserId: string,
    context: RequestContext
  ): Promise<{ deleted: string[]; skipped: string[] }> {
    const deleted: string[] = [];
    const skipped: string[] = [];

    for (const tenantId of tenantIds) {
      const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
      if (!tenant) {
        skipped.push(tenantId);
        continue;
      }

      await this.prisma.tenant.delete({ where: { id: tenantId } });
      await this.audit.record({
        actorUserId,
        tenantId: null,
        action: "platform.tenant.delete",
        targetType: "Tenant",
        targetId: tenant.id,
        metadata: { slug: tenant.slug, name: tenant.name, bulk: true },
        ipAddress: context.ipAddress,
        userAgent: context.userAgent
      });
      deleted.push(tenantId);
    }

    return { deleted, skipped };
  }

  /**
   * What a tenant's own roles currently grant — the read side of "the
   * platform decides what a Mahalle admin can do." Distinct from
   * PermissionsService.roleHasPermission (a single yes/no check used by
   * PermissionGuard at request time): this returns the full grant per role
   * so the control plane can render and edit it.
   */
  async getTenantRoles(tenantId: string): Promise<TenantRoleWithPermissions[]> {
    await this.findTenantOrThrow(tenantId);
    const roles = await this.prisma.role.findMany({
      where: { tenantId },
      include: { permissions: { include: { permission: true } } },
      orderBy: { name: "asc" }
    });
    return roles.map((role) => ({
      id: role.id,
      key: role.key,
      name: role.name,
      permissions: role.permissions.map((rp) => rp.permission.key)
    }));
  }

  /**
   * Replaces a tenant role's entire permission set. This is the platform
   * overriding what a Mahalle's own OWNER configured — the control plane's
   * authority over tenant admins, separate from and superseding whatever
   * the tenant's own admins.* permission holders can do to each other (see
   * AdminsService's role-rank checks, which only apply within a tenant).
   */
  async updateRolePermissions(
    tenantId: string,
    roleId: string,
    permissionKeys: string[],
    actorUserId: string,
    context: RequestContext
  ): Promise<TenantRoleWithPermissions> {
    await this.findTenantOrThrow(tenantId);
    const role = await this.prisma.role.findFirst({ where: { id: roleId, tenantId } });
    if (!role) {
      throw new NotFoundException("Role not found");
    }

    const permissions = await this.prisma.permission.findMany({ where: { key: { in: permissionKeys } } });

    await this.prisma.$transaction([
      this.prisma.rolePermission.deleteMany({ where: { roleId } }),
      this.prisma.rolePermission.createMany({
        data: permissions.map((p) => ({ roleId, permissionId: p.id }))
      })
    ]);

    await this.audit.record({
      actorUserId,
      tenantId,
      action: "platform.role.permissions_update",
      targetType: "Role",
      targetId: roleId,
      metadata: { roleKey: role.key, permissions: permissionKeys },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return { id: role.id, key: role.key, name: role.name, permissions: permissionKeys };
  }
}
