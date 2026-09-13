import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import type { PlatformMembership, Tenant } from "@mahalle/database";
import { DEFAULT_ROLE_PERMISSIONS, PlatformRole, TenantRole } from "@mahalle/types";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import type { ProvisionTenantDto } from "./dto/provision-tenant.dto";
import type { UpdateTenantProfileDto } from "./dto/update-tenant-profile.dto";

export interface PlatformUserSummary {
  id: string;
  role: PlatformRole;
  isActive: boolean;
  createdAt: Date;
  user: { id: string; email: string; fullName: string; isActive: boolean };
}

export interface PlatformUserSession {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
}

export interface AuditLogQuery {
  page: number;
  pageSize: number;
  search?: string;
  action?: string;
  tenantId?: string;
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

  private countActiveSuperAdmins(excludingMembershipId?: string): Promise<number> {
    return this.prisma.platformMembership.count({
      where: {
        role: PlatformRole.SUPER_ADMIN,
        isActive: true,
        ...(excludingMembershipId ? { id: { not: excludingMembershipId } } : {})
      }
    });
  }

  /** Every account with control-plane access — Section K's "Platform Administrators" list. */
  async listPlatformUsers(): Promise<PlatformUserSummary[]> {
    const memberships = await this.prisma.platformMembership.findMany({
      include: { user: { select: { id: true, email: true, fullName: true, isActive: true } } },
      orderBy: { createdAt: "asc" }
    });
    return memberships as PlatformUserSummary[];
  }

  /**
   * Grants platform access to an existing User account by email — this
   * never creates a brand-new user, since that would mean handling a
   * password/invite flow here. If they already hold a (possibly inactive)
   * membership, this reactivates it and applies the new role rather than
   * erroring, since a user can only ever hold one PlatformMembership.
   */
  async grantPlatformAccess(
    email: string,
    role: PlatformRole,
    actorUserId: string,
    context: RequestContext
  ): Promise<PlatformUserSummary> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException("No user with that email — they need an account on the platform first");
    }

    const existing = await this.prisma.platformMembership.findUnique({ where: { userId: user.id } });
    if (existing?.isActive) {
      throw new ConflictException("This user already has platform access");
    }

    const membership = await this.prisma.platformMembership.upsert({
      where: { userId: user.id },
      create: { userId: user.id, role },
      update: { role, isActive: true },
      include: { user: { select: { id: true, email: true, fullName: true, isActive: true } } }
    });

    await this.audit.record({
      actorUserId,
      tenantId: null,
      action: "platform.user.grant",
      targetType: "PlatformMembership",
      targetId: membership.id,
      metadata: { email: user.email, role },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return membership as PlatformUserSummary;
  }

  private async findMembershipOrThrow(membershipId: string) {
    const membership = await this.prisma.platformMembership.findUnique({
      where: { id: membershipId },
      include: { user: { select: { id: true, email: true, fullName: true, isActive: true } } }
    });
    if (!membership) {
      throw new NotFoundException("Platform membership not found");
    }
    return membership;
  }

  /** Changes what an existing platform user is permitted to do. Blocked if it would leave zero active SUPER_ADMINs. */
  async updatePlatformMembershipRole(
    membershipId: string,
    role: PlatformRole,
    actorUserId: string,
    context: RequestContext
  ): Promise<PlatformUserSummary> {
    const existing = await this.findMembershipOrThrow(membershipId);

    if (existing.role === PlatformRole.SUPER_ADMIN && role !== PlatformRole.SUPER_ADMIN) {
      const remaining = await this.countActiveSuperAdmins(membershipId);
      if (remaining === 0) {
        throw new BadRequestException("Can't remove the platform's last SUPER_ADMIN");
      }
    }

    const membership = await this.prisma.platformMembership.update({
      where: { id: membershipId },
      data: { role },
      include: { user: { select: { id: true, email: true, fullName: true, isActive: true } } }
    });

    await this.audit.record({
      actorUserId,
      tenantId: null,
      action: "platform.user.role_change",
      targetType: "PlatformMembership",
      targetId: membership.id,
      metadata: { email: existing.user.email, from: existing.role, to: role },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return membership as PlatformUserSummary;
  }

  /** Revokes platform access without deleting the underlying User account. Blocked if it would leave zero active SUPER_ADMINs. */
  async revokePlatformAccess(membershipId: string, actorUserId: string, context: RequestContext): Promise<void> {
    const existing = await this.findMembershipOrThrow(membershipId);

    if (existing.role === PlatformRole.SUPER_ADMIN) {
      const remaining = await this.countActiveSuperAdmins(membershipId);
      if (remaining === 0) {
        throw new BadRequestException("Can't revoke the platform's last SUPER_ADMIN");
      }
    }

    await this.prisma.platformMembership.update({ where: { id: membershipId }, data: { isActive: false } });

    await this.audit.record({
      actorUserId,
      tenantId: null,
      action: "platform.user.revoke",
      targetType: "PlatformMembership",
      targetId: membershipId,
      metadata: { email: existing.user.email, role: existing.role },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  /** A platform user's active/past sign-in sessions — Section K's "Access / Security". Never exposes the token hash itself. */
  async listUserSessions(userId: string): Promise<PlatformUserSession[]> {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, ipAddress: true, userAgent: true, createdAt: true, expiresAt: true, revokedAt: true }
    });
    return tokens;
  }

  /** Force-signs-out one session. Doesn't affect the user's other active sessions. */
  async revokeSession(sessionId: string, actorUserId: string, context: RequestContext): Promise<void> {
    const token = await this.prisma.refreshToken.findUnique({ where: { id: sessionId } });
    if (!token) {
      throw new NotFoundException("Session not found");
    }
    if (!token.revokedAt) {
      await this.prisma.refreshToken.update({ where: { id: sessionId }, data: { revokedAt: new Date() } });
    }

    await this.audit.record({
      actorUserId,
      tenantId: null,
      action: "platform.session.revoke",
      targetType: "RefreshToken",
      targetId: sessionId,
      metadata: { userId: token.userId },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  private static readonly TENANT_COUNTS = {
    select: {
      members: { where: { isActive: true } },
      families: true,
      memberships: { where: { isActive: true } }
    }
  } as const;

  private serializeTenant(
    t: Tenant & { _count: { members: number; families: number; memberships: number } }
  ) {
    return {
      id: t.id,
      slug: t.slug,
      name: t.name,
      description: t.description,
      isActive: t.isActive,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      // Branding
      logoUrl: t.logoUrl,
      coverImageUrl: t.coverImageUrl,
      // Contact
      contactPhone: t.contactPhone,
      contactEmail: t.contactEmail,
      website: t.website,
      // Masjid
      masjidName: t.masjidName,
      masjidPhone: t.masjidPhone,
      masjidAddress: t.masjidAddress,
      imamName: t.imamName,
      khatheebName: t.khatheebName,
      // Location
      country: t.country,
      state: t.state,
      district: t.district,
      localBodyType: t.localBodyType,
      localBody: t.localBody,
      place: t.place,
      pinCode: t.pinCode,
      addressLine1: t.addressLine1,
      addressLine2: t.addressLine2,
      latitude: t.latitude,
      longitude: t.longitude,
      // Structure
      hasDivisions: t.hasDivisions,
      divisionTerm: t.divisionTerm,
      // Management
      presidentName: t.presidentName,
      presidentPhone: t.presidentPhone,
      secretaryName: t.secretaryName,
      secretaryPhone: t.secretaryPhone,
      treasurerName: t.treasurerName,
      treasurerPhone: t.treasurerPhone,
      // Counts
      memberCount: t._count.members,
      familyCount: t._count.families,
      adminCount: t._count.memberships
    };
  }

  /** Platform staff see every tenant, unlike apps/api's tenant endpoints which are always scoped to the caller's own memberships. */
  async listAllTenants() {
    const tenants = await this.prisma.tenant.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: PlatformService.TENANT_COUNTS }
    });
    return tenants.map((t) => this.serializeTenant(t));
  }

  async getTenantDetail(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { _count: PlatformService.TENANT_COUNTS }
    });
    if (!tenant) {
      throw new NotFoundException("Mahalle not found");
    }
    return this.serializeTenant(tenant);
  }

  async listAuditLogs({ page, pageSize, search, action, tenantId }: AuditLogQuery): Promise<{ entries: AuditLogEntry[]; total: number }> {
    const where: any = {};
    if (tenantId) {
      where.tenantId = tenantId;
    }
    if (action && action !== "all") {
      where.action = { startsWith: action };
    }
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { action: { contains: q, mode: "insensitive" } },
        { ipAddress: { contains: q, mode: "insensitive" } },
        { actor: { email: { contains: q, mode: "insensitive" } } },
        { actor: { fullName: { contains: q, mode: "insensitive" } } },
        { tenant: { name: { contains: q, mode: "insensitive" } } },
        { tenant: { slug: { contains: q, mode: "insensitive" } } }
      ];
    }

    const [rows, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          actor: { select: { id: true, email: true, fullName: true } },
          tenant: { select: { id: true, slug: true, name: true } }
        }
      }),
      this.prisma.auditLog.count({ where })
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
   * Marks the start of an explicit, audited Support Mode session against a
   * Mahalle — the platform's alternative to silently impersonating a tenant
   * admin (Section AO rule #2). This does not itself grant any access:
   * platform staff already have read access to tenant operational data via
   * the /platform/tenants/:id/* endpoints, gated by their own role. This
   * call exists purely so the access is visibly declared and logged, with
   * an optional reason, before the control panel renders that data.
   */
  async startSupportSession(
    tenantId: string,
    reason: string | undefined,
    actorUserId: string,
    context: RequestContext
  ): Promise<void> {
    const tenant = await this.findTenantOrThrow(tenantId);
    await this.audit.record({
      actorUserId,
      tenantId: tenant.id,
      action: "platform.support.start",
      targetType: "Tenant",
      targetId: tenant.id,
      metadata: { slug: tenant.slug, name: tenant.name, reason: reason ?? null },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  /** Marks the end of a Support Mode session started with `startSupportSession`. */
  async endSupportSession(tenantId: string, actorUserId: string, context: RequestContext): Promise<void> {
    const tenant = await this.findTenantOrThrow(tenantId);
    await this.audit.record({
      actorUserId,
      tenantId: tenant.id,
      action: "platform.support.end",
      targetType: "Tenant",
      targetId: tenant.id,
      metadata: { slug: tenant.slug, name: tenant.name },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
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

  /**
   * Updates basic metadata and profile for a Mahalle (name, contact, masjid, location, committee).
   */
  async updateTenantProfile(
    tenantId: string,
    dto: UpdateTenantProfileDto,
    actorUserId: string,
    context: RequestContext
  ) {
    const existing = await this.findTenantOrThrow(tenantId);
    const updated = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: dto,
      include: { _count: PlatformService.TENANT_COUNTS }
    });

    await this.audit.record({
      actorUserId,
      tenantId: updated.id,
      action: "platform.tenant.update_profile",
      targetType: "Tenant",
      targetId: updated.id,
      metadata: { slug: existing.slug, changes: Object.keys(dto) },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return this.serializeTenant(updated);
  }

  /**
   * Directly provisions a new Mahalle from the Superadmin Control Plane.
   * Creates standard default roles and assigns the creator or specified user as OWNER.
   */
  async provisionTenant(
    dto: ProvisionTenantDto,
    actorUserId: string,
    context: RequestContext
  ) {
    const slug = dto.slug.toLowerCase();
    const existing = await this.prisma.tenant.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException("A Mahalle with this slug already exists");
    }

    let ownerUser = null;
    if (dto.ownerEmail) {
      ownerUser = await this.prisma.user.findUnique({ where: { email: dto.ownerEmail } });
    }
    const effectiveOwnerUserId = ownerUser?.id ?? actorUserId;

    const allPermissions = await this.prisma.permission.findMany();

    const tenant = await this.prisma.$transaction(async (tx) => {
      const created = await tx.tenant.create({
        data: {
          name: dto.name,
          slug,
          description: dto.description,
          contactEmail: dto.contactEmail,
          contactPhone: dto.contactPhone,
          state: dto.state,
          district: dto.district,
          place: dto.place,
          masjidName: dto.masjidName,
          isActive: true
        }
      });

      const roleByKey = new Map<TenantRole, string>();
      for (const [key, permissionKeys] of Object.entries(DEFAULT_ROLE_PERMISSIONS) as [
        TenantRole,
        readonly string[] | "*"
      ][]) {
        const role = await tx.role.create({
          data: { tenantId: created.id, key, name: key.charAt(0) + key.slice(1).toLowerCase() }
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
      if (ownerRoleId && effectiveOwnerUserId) {
        await tx.tenantMembership.create({
          data: { tenantId: created.id, userId: effectiveOwnerUserId, roleId: ownerRoleId }
        });
      }

      return created;
    });

    await this.audit.record({
      actorUserId,
      tenantId: tenant.id,
      action: "platform.tenant.provision",
      targetType: "Tenant",
      targetId: tenant.id,
      metadata: { slug: tenant.slug, name: tenant.name, ownerUserId: effectiveOwnerUserId },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    const fullTenant = await this.prisma.tenant.findUniqueOrThrow({
      where: { id: tenant.id },
      include: { _count: PlatformService.TENANT_COUNTS }
    });

    return this.serializeTenant(fullTenant);
  }

  /**
   * Lists registered users across the entire platform with their Mahalle memberships.
   */
  async listAllUsers(search?: string) {
    const where: any = {};
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { email: { contains: q, mode: "insensitive" } },
        { fullName: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } }
      ];
    }

    const users = await this.prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        isActive: true,
        createdAt: true,
        platformMembership: { select: { id: true, role: true, isActive: true } },
        tenantMemberships: {
          where: { isActive: true },
          select: {
            id: true,
            tenant: { select: { id: true, slug: true, name: true } },
            role: { select: { key: true, name: true } }
          }
        },
        _count: {
          select: { refreshTokens: { where: { revokedAt: null } } }
        }
      }
    });

    return users.map((u) => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      phone: u.phone,
      isActive: u.isActive,
      createdAt: u.createdAt,
      platformRole: u.platformMembership?.isActive ? u.platformMembership.role : null,
      tenants: u.tenantMemberships.map((tm) => ({
        id: tm.tenant.id,
        name: tm.tenant.name,
        slug: tm.tenant.slug,
        role: tm.role.name
      })),
      activeSessionsCount: u._count.refreshTokens
    }));
  }

  /**
   * Real-time system telemetry and platform diagnostics.
   */
  async getSystemStatus() {
    const [
      tenantCount,
      activeTenantCount,
      userCount,
      memberCount,
      familyCount,
      auditLogCount,
      activeSessionsCount
    ] = await Promise.all([
      this.prisma.tenant.count(),
      this.prisma.tenant.count({ where: { isActive: true } }),
      this.prisma.user.count(),
      this.prisma.member.count({ where: { isActive: true } }),
      this.prisma.family.count(),
      this.prisma.auditLog.count(),
      this.prisma.refreshToken.count({ where: { revokedAt: null, expiresAt: { gt: new Date() } } })
    ]);

    return {
      status: "healthy",
      database: {
        connected: true,
        provider: "PostgreSQL"
      },
      counts: {
        tenants: tenantCount,
        activeTenants: activeTenantCount,
        users: userCount,
        members: memberCount,
        families: familyCount,
        auditLogs: auditLogCount,
        activeSessions: activeSessionsCount
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || "development",
        platformVersion: "2.4.0",
        uptimeSeconds: Math.floor(process.uptime())
      }
    };
  }
}

