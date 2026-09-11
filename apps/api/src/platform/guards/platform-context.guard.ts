import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import type { Request } from "express";
import type { PlatformMembership } from "@mahalle/database";
import { PlatformService } from "../platform.service";
import type { SafeUser } from "../../users/users.service";

/**
 * The control-plane equivalent of TenantContextGuard — and deliberately a
 * completely separate code path. Requires an active PlatformMembership.
 * Shares no table, guard, or decision logic with tenant authorization: a
 * tenant OWNER has no automatic platform access, and a platform Super Admin
 * has no automatic tenant access, on purpose (see docs/authorization.md).
 */
@Injectable()
export class PlatformContextGuard implements CanActivate {
  constructor(private readonly platformService: PlatformService) {}

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

    request.platformMembership = membership;
    return true;
  }
}
