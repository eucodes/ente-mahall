import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantContextGuard } from "../tenants/guards/tenant-context.guard";
import { CurrentMembership } from "../tenants/decorators/current-membership.decorator";
import type { MembershipWithRole } from "../memberships/memberships.service";
import { SearchService } from "./search.service";
import { SearchQueryDto } from "./dto/search-query.dto";

/**
 * No single @RequirePermission here — a search box spans several resource
 * types, each gated by its own permission (members.view, families.view, …)
 * inside SearchService itself, exactly like the pages it searches. Only
 * TenantContextGuard applies at the route level; per-category filtering is
 * the actual access control.
 */
@Controller("tenants/:slug/search")
@UseGuards(JwtAuthGuard, TenantContextGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@CurrentMembership() membership: MembershipWithRole, @Query() query: SearchQueryDto) {
    return this.searchService.search(membership.tenantId, membership.roleId, query.q);
  }
}
