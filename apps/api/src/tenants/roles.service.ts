import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, type Role } from "@mahalle/database";
import { PERMISSIONS } from "@mahalle/types";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import type { CreateRoleDto, UpdateRoleDto } from "./dto/manage-role.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

interface ActorContext {
  userId: string;
  tenantId: string;
}

export interface RoleSummary {
  id: string;
  key: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  isActive: boolean;
  memberCount: number;
  permissionKeys: string[];
}

const VALID_PERMISSIONS = new Set<string>(PERMISSIONS);

function slugifyKey(name: string): string {
  return name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60) || "ROLE";
}

/**
 * Tenant-scoped custom-role management (create/edit/duplicate/deactivate),
 * layered on top of the same Role/Permission/RolePermission schema the
 * seeded system roles already use. System roles (isSystem: true — OWNER,
 * ADMIN, MODERATOR, EDITOR, STAFF, MEMBER) carry the privilege-escalation
 * rank in TENANT_ROLE_RANK (see AdminsService) and are deliberately
 * read-only here: editing what OWNER or ADMIN can do would risk silently
 * breaking that escalation model. Everything below only ever touches
 * isSystem: false rows.
 */
@Injectable()
export class RolesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  private async toSummary(role: Role & { permissions: { permission: { key: string } }[]; _count: { memberships: number } }): Promise<RoleSummary> {
    return {
      id: role.id,
      key: role.key,
      name: role.name,
      description: role.description,
      isSystem: role.isSystem,
      isActive: role.isActive,
      memberCount: role._count.memberships,
      permissionKeys: role.permissions.map((p) => p.permission.key)
    };
  }

  async list(tenantId: string): Promise<RoleSummary[]> {
    const roles = await this.prisma.role.findMany({
      where: { tenantId },
      orderBy: [{ isSystem: "desc" }, { name: "asc" }],
      include: { permissions: { include: { permission: true } }, _count: { select: { memberships: { where: { isActive: true } } } } }
    });
    return Promise.all(roles.map((r) => this.toSummary(r)));
  }

  private async findOrThrow(tenantId: string, roleId: string) {
    const role = await this.prisma.role.findFirst({
      where: { id: roleId, tenantId },
      include: { permissions: { include: { permission: true } }, _count: { select: { memberships: { where: { isActive: true } } } } }
    });
    if (!role) throw new NotFoundException("Role not found");
    return role;
  }

  async get(tenantId: string, roleId: string): Promise<RoleSummary> {
    return this.toSummary(await this.findOrThrow(tenantId, roleId));
  }

  private assertPermissionKeysValid(keys: string[]): void {
    const unknown = keys.filter((k) => !VALID_PERMISSIONS.has(k));
    if (unknown.length > 0) {
      throw new BadRequestException(`Unknown permission key(s): ${unknown.join(", ")}`);
    }
  }

  async create(actor: ActorContext, dto: CreateRoleDto, context: RequestContext): Promise<RoleSummary> {
    this.assertPermissionKeysValid(dto.permissionKeys);
    const permissions = await this.prisma.permission.findMany({ where: { key: { in: dto.permissionKeys } } });

    let role: Role;
    try {
      role = await this.prisma.role.create({
        data: {
          tenantId: actor.tenantId,
          key: slugifyKey(dto.name),
          name: dto.name,
          description: dto.description,
          isSystem: false,
          isActive: true,
          permissions: { create: permissions.map((p) => ({ permissionId: p.id })) }
        }
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new ConflictException("A role with a similar name already exists — try a different name.");
      }
      throw err;
    }

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "role.create",
      targetType: "Role",
      targetId: role.id,
      metadata: { name: dto.name, permissionKeys: dto.permissionKeys },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return this.get(actor.tenantId, role.id);
  }

  async update(actor: ActorContext, roleId: string, dto: UpdateRoleDto, context: RequestContext): Promise<RoleSummary> {
    const existing = await this.findOrThrow(actor.tenantId, roleId);
    if (existing.isSystem) {
      throw new ForbiddenException("System roles can't be edited — duplicate this role to create a customizable copy.");
    }
    if (dto.permissionKeys) this.assertPermissionKeysValid(dto.permissionKeys);

    await this.prisma.$transaction(async (tx) => {
      await tx.role.update({
        where: { id: roleId },
        data: { name: dto.name, description: dto.description }
      });
      if (dto.permissionKeys) {
        const permissions = await tx.permission.findMany({ where: { key: { in: dto.permissionKeys } } });
        await tx.rolePermission.deleteMany({ where: { roleId } });
        await tx.rolePermission.createMany({ data: permissions.map((p) => ({ roleId, permissionId: p.id })) });
      }
    });

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "role.update",
      targetType: "Role",
      targetId: roleId,
      metadata: { name: dto.name, permissionKeys: dto.permissionKeys },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return this.get(actor.tenantId, roleId);
  }

  async duplicate(actor: ActorContext, roleId: string, context: RequestContext): Promise<RoleSummary> {
    const source = await this.findOrThrow(actor.tenantId, roleId);
    const permissionIds = source.permissions.map((p) => p.permission.id);

    let role: Role;
    let attempt = 0;
    // Retry once with a numeric suffix if "<name> (Copy)" collides — keeps this a
    // one-click action instead of forcing the admin to pick a name up front.
    for (;;) {
      const suffix = attempt === 0 ? "(Copy)" : `(Copy ${attempt + 1})`;
      const name = `${source.name} ${suffix}`;
      try {
        role = await this.prisma.role.create({
          data: {
            tenantId: actor.tenantId,
            key: slugifyKey(name),
            name,
            description: source.description,
            isSystem: false,
            isActive: true,
            permissions: { create: permissionIds.map((permissionId) => ({ permissionId })) }
          }
        });
        break;
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002" && attempt < 5) {
          attempt += 1;
          continue;
        }
        throw err;
      }
    }

    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "role.duplicate",
      targetType: "Role",
      targetId: role.id,
      metadata: { sourceRoleId: roleId },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return this.get(actor.tenantId, role.id);
  }

  async deactivate(actor: ActorContext, roleId: string, context: RequestContext): Promise<RoleSummary> {
    const role = await this.findOrThrow(actor.tenantId, roleId);
    if (role.isSystem) {
      throw new ForbiddenException("System roles can't be deactivated.");
    }
    if (role._count.memberships > 0) {
      throw new BadRequestException(
        `${role._count.memberships} member(s) still hold this role — reassign them to another role first.`
      );
    }
    await this.prisma.role.update({ where: { id: roleId }, data: { isActive: false } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "role.deactivate",
      targetType: "Role",
      targetId: roleId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return this.get(actor.tenantId, roleId);
  }

  async reactivate(actor: ActorContext, roleId: string, context: RequestContext): Promise<RoleSummary> {
    const role = await this.findOrThrow(actor.tenantId, roleId);
    if (role.isSystem) {
      throw new ForbiddenException("System roles are always active.");
    }
    await this.prisma.role.update({ where: { id: roleId }, data: { isActive: true } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "role.reactivate",
      targetType: "Role",
      targetId: roleId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return this.get(actor.tenantId, roleId);
  }
}
