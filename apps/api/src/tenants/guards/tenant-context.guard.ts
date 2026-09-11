import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import type { Request } from "express";
import { TenantsService } from "../tenants.service";
import { MembershipsService } from "../../memberships/memberships.service";
import type { SafeUser } from "../../users/users.service";

/**
 * The tenant-isolation gate. Must run AFTER JwtAuthGuard (so `req.user` is
 * already populated). Resolves the `:slug` route param to a real Tenant and
 * requires the authenticated user to have an ACTIVE TenantMembership on it —
 * the tenant id/slug in the URL is only ever a lookup key, never trusted for
 * authorization on its own. Attaches `req.tenant` and `req.membership` for
 * `@CurrentTenant()`/`@CurrentMembership()` to read.
 *
 * This checks membership only — NOT role/permission. That's Phase 4
 * (`@RequirePermission`), layered on top of this guard.
 */
@Injectable()
export class TenantContextGuard implements CanActivate {
  constructor(
    private readonly tenantsService: TenantsService,
    private readonly membershipsService: MembershipsService
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
      // JwtAuthGuard should have already rejected this — defensive only.
      throw new ForbiddenException("You do not have access to this Mahalle");
    }

    const membership = await this.membershipsService.findActiveMembership(tenant.id, user.id);
    if (!membership) {
      throw new ForbiddenException("You do not have access to this Mahalle");
    }

    request.tenant = tenant;
    request.membership = membership;
    return true;
  }
}
