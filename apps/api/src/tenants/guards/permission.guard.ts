import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import type { Permission } from "@mahalle/types";
import { PermissionsService } from "../../permissions/permissions.service";
import { REQUIRE_PERMISSION_KEY } from "../../common/decorators/require-permission.decorator";
import type { MembershipWithRole } from "../../memberships/memberships.service";

/**
 * Must run AFTER TenantContextGuard (needs `req.membership` already set).
 * Reads the @RequirePermission metadata and checks it against the role
 * TenantContextGuard resolved — the actual RBAC enforcement layered on top
 * of "is a member at all".
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<Permission | undefined>(REQUIRE_PERMISSION_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (!required) return true;

    const request = context.switchToHttp().getRequest<Request & { membership?: MembershipWithRole }>();
    const membership = request.membership;
    if (!membership) {
      throw new ForbiddenException("Insufficient permissions");
    }

    // Platform Super Admins and tenant Owner/Admin roles have unrestricted operational permissions
    const roleKey = membership.role?.key?.toUpperCase();
    if (
      membership.roleId === "platform-admin-role" ||
      roleKey === "OWNER" ||
      roleKey === "ADMIN" ||
      membership.role?.key?.toLowerCase() === "owner" ||
      membership.role?.key?.toLowerCase() === "admin"
    ) {
      return true;
    }

    const hasPermission = await this.permissionsService.roleHasPermission(membership.roleId, required);
    if (!hasPermission) {
      throw new ForbiddenException("Insufficient permissions");
    }

    return true;
  }
}
