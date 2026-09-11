import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { TENANT_ROLE_RANK, TenantRole } from "@mahalle/types";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import { MembershipsService, type MembershipWithRole } from "../memberships/memberships.service";
import { UsersService } from "../users/users.service";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Administrator management for a single tenant: add/remove/re-role other
 * members. Kept separate from TenantsService (tenant lifecycle) since the
 * rules here are specifically about privilege escalation, not tenant CRUD.
 */
@Injectable()
export class AdminsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly membershipsService: MembershipsService,
    private readonly usersService: UsersService,
    private readonly audit: AuditService
  ) {}

  list(tenantId: string) {
    return this.membershipsService.listForTenant(tenantId);
  }

  /**
   * An actor may only grant/modify a role ranked strictly below their own —
   * except OWNER, who may also grant OWNER (to share or transfer ownership).
   * This is what stops an ADMIN from making themselves (or anyone else) an
   * OWNER, or a MODERATOR from creating another MODERATOR-or-above.
   */
  private assertCanAssignRole(actorRole: TenantRole, targetRole: TenantRole): void {
    const actorRank = TENANT_ROLE_RANK[actorRole];
    const targetRank = TENANT_ROLE_RANK[targetRole];
    const allowed = actorRole === TenantRole.OWNER ? targetRank <= actorRank : targetRank < actorRank;
    if (!allowed) {
      throw new ForbiddenException(`You cannot assign the ${targetRole} role`);
    }
  }

  async add(
    tenantId: string,
    actor: MembershipWithRole,
    input: { email: string; roleKey: TenantRole },
    context: RequestContext
  ) {
    this.assertCanAssignRole(actor.role.key as TenantRole, input.roleKey);

    const user = await this.usersService.findByEmail(input.email);
    if (!user) {
      throw new NotFoundException("No account with that email exists yet — ask them to register first");
    }

    const existing = await this.prisma.tenantMembership.findUnique({
      where: { tenantId_userId: { tenantId, userId: user.id } }
    });
    if (existing?.isActive) {
      throw new ConflictException("This person is already a member of this Mahalle");
    }

    const role = await this.prisma.role.findUniqueOrThrow({
      where: { tenantId_key: { tenantId, key: input.roleKey } }
    });

    const membership = existing
      ? await this.prisma.tenantMembership.update({
          where: { id: existing.id },
          data: { isActive: true, roleId: role.id },
          include: { user: true, role: true }
        })
      : await this.prisma.tenantMembership.create({
          data: { tenantId, userId: user.id, roleId: role.id },
          include: { user: true, role: true }
        });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId,
      action: "tenant.admin.add",
      targetType: "TenantMembership",
      targetId: membership.id,
      metadata: { email: input.email, roleKey: input.roleKey },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return membership;
  }

  async updateRole(
    tenantId: string,
    actor: MembershipWithRole,
    membershipId: string,
    roleKey: TenantRole,
    context: RequestContext
  ) {
    if (membershipId === actor.id) {
      throw new BadRequestException("You cannot change your own role — ask another owner to do this");
    }

    const target = await this.membershipsService.findByIdForTenant(tenantId, membershipId);
    if (!target) {
      throw new NotFoundException("Membership not found");
    }

    this.assertCanAssignRole(actor.role.key as TenantRole, roleKey);
    // Also require the actor to outrank the target's CURRENT role, so a
    // MODERATOR can't "demote" an ADMIN down to STAFF either.
    this.assertCanAssignRole(actor.role.key as TenantRole, target.role.key as TenantRole);

    if (target.role.key === TenantRole.OWNER && roleKey !== TenantRole.OWNER) {
      const ownerCount = await this.membershipsService.countActiveOwners(tenantId);
      if (ownerCount <= 1) {
        throw new BadRequestException("Cannot demote the last owner of this Mahalle");
      }
    }

    const role = await this.prisma.role.findUniqueOrThrow({
      where: { tenantId_key: { tenantId, key: roleKey } }
    });

    const updated = await this.prisma.tenantMembership.update({
      where: { id: membershipId },
      data: { roleId: role.id },
      include: { user: true, role: true }
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId,
      action: "tenant.admin.role_change",
      targetType: "TenantMembership",
      targetId: membershipId,
      metadata: { fromRole: target.role.key, toRole: roleKey },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return updated;
  }

  async remove(tenantId: string, actor: MembershipWithRole, membershipId: string, context: RequestContext): Promise<void> {
    if (membershipId === actor.id) {
      throw new BadRequestException("You cannot remove yourself — ask another owner to do this");
    }

    const target = await this.membershipsService.findByIdForTenant(tenantId, membershipId);
    if (!target) {
      throw new NotFoundException("Membership not found");
    }

    this.assertCanAssignRole(actor.role.key as TenantRole, target.role.key as TenantRole);

    if (target.role.key === TenantRole.OWNER) {
      const ownerCount = await this.membershipsService.countActiveOwners(tenantId);
      if (ownerCount <= 1) {
        throw new BadRequestException("Cannot remove the last owner of this Mahalle");
      }
    }

    await this.prisma.tenantMembership.update({
      where: { id: membershipId },
      data: { isActive: false }
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId,
      action: "tenant.admin.remove",
      targetType: "TenantMembership",
      targetId: membershipId,
      metadata: { removedUserId: target.userId, removedRole: target.role.key },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }
}
