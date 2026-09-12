import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import type { PlatformMembership } from "@mahalle/database";
import type { PlatformRole } from "@mahalle/types";
import { PlatformService } from "../platform.service";
import { REQUIRE_PLATFORM_ROLE_KEY } from "../../common/decorators/require-platform-role.decorator";
import type { SafeUser } from "../../users/users.service";

/**
 * The control-plane equivalent of TenantContextGuard — and deliberately a
 * completely separate code path. Requires an active PlatformMembership.
 * Shares no table, guard, or decision logic with tenant authorization: a
 * tenant OWNER has no automatic platform access, and a platform Super Admin
 * has no automatic tenant access, on purpose (see docs/authorization.md).
 *
 * Also enforces @RequirePlatformRole(...) when present — the platform's own
 * equivalent of PermissionGuard, for actions (suspend/delete a tenant,
 * override a tenant's role permissions) reserved to SUPER_ADMIN.
 */
@Injectable()
export class PlatformContextGuard implements CanActivate {
  constructor(
    private readonly platformService: PlatformService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: SafeUser; platformMembership?: PlatformMembership }>();

    const user = request.user;
    if (!user) {
      throw new ForbiddenException("Platform access required");
    }

    const membership = await this.platformService.findActiveMembership(user.id);
    if (!membership) {
      throw new ForbiddenException("Platform access required");
    }

    const requiredRoles = this.reflector.getAllAndOverride<PlatformRole[] | undefined>(REQUIRE_PLATFORM_ROLE_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(membership.role as PlatformRole)) {
      throw new ForbiddenException("Your platform role does not permit this action");
    }

    request.platformMembership = membership;
    return true;
  }
}
