import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import type { Member, Tenant } from "@mahalle/database";
import { appScopeFromRequest, scopedCookieName } from "../../auth/app-scope";
import { ACCESS_TOKEN_COOKIE } from "../../auth/auth.constants";
import { PrismaService } from "../../database/prisma.service";
import { TenantsService } from "../../tenants/tenants.service";
import { MemberTokenService } from "../member-token.service";

export type RequestWithMember = Request & { member: Member; tenant: Tenant };

/**
 * Verifies a member's session cookie AND that its token was issued for
 * *this* tenant. The "tenant" app-scope cookie is shared by every tenant
 * subdomain (there's no per-slug cookie name), so without this check a
 * member's valid token from one Mahalle would also authenticate them on any
 * other Mahalle's dashboard — this closes that cross-tenant leak by
 * comparing the token's tenantId against the tenant resolved from the URL.
 */
@Injectable()
export class MemberAuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: MemberTokenService,
    private readonly tenantsService: TenantsService,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithMember>();
    const slug = req.params.slug;
    if (!slug || typeof slug !== "string") {
      throw new NotFoundException("Mahalle not found");
    }
    const tenant = await this.tenantsService.findActiveBySlugOrThrow(slug);

    const app = appScopeFromRequest(req);
    const token = app
      ? (req.cookies as Record<string, string> | undefined)?.[scopedCookieName(ACCESS_TOKEN_COOKIE, app)]
      : undefined;
    if (!token) {
      throw new UnauthorizedException();
    }

    let payload;
    try {
      payload = this.tokenService.verifyAccessToken(token);
    } catch {
      throw new UnauthorizedException();
    }

    if (payload.tenantId !== tenant.id) {
      throw new UnauthorizedException();
    }

    const member = await this.prisma.member.findFirst({
      where: { id: payload.sub, tenantId: tenant.id, isActive: true }
    });
    if (!member) {
      throw new UnauthorizedException();
    }

    req.member = member;
    req.tenant = tenant;
    return true;
  }
}
