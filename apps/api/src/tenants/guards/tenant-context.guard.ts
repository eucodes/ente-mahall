import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import type { Request } from "express";
import { PrismaService } from "../../database/prisma.service";
import { TenantsService } from "../tenants.service";
import { MembershipsService, type MembershipWithRole } from "../../memberships/memberships.service";
import type { SafeUser } from "../../users/users.service";

/**
 * The tenant-isolation gate. Resolves `:slug` to a real Tenant and ensures
 * the authenticated user is either an active member or a Platform Administrator.
 */
@Injectable()
export class TenantContextGuard implements CanActivate {
  constructor(
    private readonly tenantsService: TenantsService,
    private readonly membershipsService: MembershipsService,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user?: SafeUser; tenant?: unknown; membership?: unknown }>();
    const slug = request.params.slug;
    if (!slug || typeof slug !== "string") {
      throw new NotFoundException("Mahalle not found");
    }

    const tenant = await this.tenantsService.findActiveBySlugOrThrow(slug);

    const user = request.user;
    if (!user) {
      throw new ForbiddenException("You do not have access to this Mahalle");
    }

    let membership = await this.membershipsService.findActiveMembership(tenant.id, user.id);
    if (!membership) {
      // Platform staff / super admin elevation
      const platformMembership = await this.prisma.platformMembership.findUnique({
        where: { userId: user.id }
      });

      if (platformMembership) {
        const adminRole = (await this.prisma.role.findFirst({
          where: { tenantId: tenant.id, key: "admin" }
        })) ?? {
          id: "platform-admin-role",
          tenantId: tenant.id,
          key: "admin",
          name: "Platform Super Admin",
          description: "Platform root access",
          isSystem: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        membership = {
          id: `platform-${user.id}`,
          tenantId: tenant.id,
          userId: user.id,
          roleId: adminRole.id,
          isActive: true,
          invitedByUserId: null,
          joinedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          role: adminRole
        } as MembershipWithRole;
      }
    }

    if (!membership) {
      throw new ForbiddenException("You do not have access to this Mahalle");
    }

    request.tenant = tenant;
    request.membership = membership;
    return true;
  }
}
