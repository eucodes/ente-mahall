import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import type { Role } from "@mahalle/database";
import { TENANT_ROLE_RANK, TenantRole } from "@mahalle/types";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import { MembershipsService, type MembershipWithRole } from "../memberships/memberships.service";
import { UsersService } from "../users/users.service";

/** Where a custom (non-system) role sits for escalation purposes: below OWNER, at ADMIN's rank — only OWNER/ADMIN may assign or revoke a custom operational role like "Accountant". */
const CUSTOM_ROLE_RANK = TENANT_ROLE_RANK[TenantRole.ADMIN];

function rankOf(role: Pick<Role, "key" | "isSystem">): number {
  if (!role.isSystem) return CUSTOM_ROLE_RANK;
  return TENANT_ROLE_RANK[role.key as TenantRole] ?? CUSTOM_ROLE_RANK;
}

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
   * OWNER, or a MODERATOR from creating another MODERATOR-or-above. Custom
   * (non-system) roles are treated as ADMIN-rank for this check — only
   * OWNER/ADMIN may hand out a specialized operational role.
   */
  private assertCanAssignRole(actorRole: Pick<Role, "key" | "isSystem" | "name">, targetRole: Pick<Role, "key" | "isSystem" | "name">): void {
    const actorRank = rankOf(actorRole);
    const targetRank = rankOf(targetRole);
    const actorIsOwner = actorRole.isSystem && actorRole.key === TenantRole.OWNER;
    const allowed = actorIsOwner ? targetRank <= actorRank : targetRank < actorRank;
    if (!allowed) {
      throw new ForbiddenException(`You cannot assign the ${targetRole.name} role`);
    }
  }

  private async findAssignableRoleOrThrow(tenantId: string, roleKey: string): Promise<Role> {
    const role = await this.prisma.role.findUnique({ where: { tenantId_key: { tenantId, key: roleKey } } });
    if (!role) {
      throw new NotFoundException("That role doesn't exist for this Mahalle");
    }
    if (!role.isActive) {
      throw new BadRequestException(`The "${role.name}" role is deactivated and can't be assigned. Reactivate it first.`);
    }
    return role;
  }

  async add(
    tenantId: string,
    actor: MembershipWithRole,
    input: { email: string; roleKey: string },
    context: RequestContext
  ) {
    const role = await this.findAssignableRoleOrThrow(tenantId, input.roleKey);
    this.assertCanAssignRole(actor.role, role);

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
      metadata: { email: input.email, roleKey: role.key },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return membership;
  }

  async updateRole(
    tenantId: string,
    actor: MembershipWithRole,
    membershipId: string,
    roleKey: string,
    context: RequestContext
  ) {
    if (membershipId === actor.id) {
      throw new BadRequestException("You cannot change your own role — ask another owner to do this");
    }

    const target = await this.membershipsService.findByIdForTenant(tenantId, membershipId);
    if (!target) {
      throw new NotFoundException("Membership not found");
    }

    const role = await this.findAssignableRoleOrThrow(tenantId, roleKey);
    this.assertCanAssignRole(actor.role, role);
    // Also require the actor to outrank the target's CURRENT role, so a
    // MODERATOR can't "demote" an ADMIN down to STAFF either.
    this.assertCanAssignRole(actor.role, target.role);

    if (target.role.key === TenantRole.OWNER && role.key !== TenantRole.OWNER) {
      const ownerCount = await this.membershipsService.countActiveOwners(tenantId);
      if (ownerCount <= 1) {
        throw new BadRequestException("Cannot demote the last owner of this Mahalle");
      }
    }

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
      metadata: { fromRole: target.role.key, toRole: role.key },
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

    this.assertCanAssignRole(actor.role, target.role);

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
