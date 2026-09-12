import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantContextGuard } from "../tenants/guards/tenant-context.guard";
import { PermissionGuard } from "../tenants/guards/permission.guard";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { CurrentMembership } from "../tenants/decorators/current-membership.decorator";
import type { MembershipWithRole } from "../memberships/memberships.service";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { ActivityService, type ActivityEntry } from "./activity.service";

@Controller("tenants/:slug/activity")
@UseGuards(JwtAuthGuard, TenantContextGuard, PermissionGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @RequirePermission("audit.view")
  async list(
    @CurrentMembership() membership: MembershipWithRole,
    @Query() query: PaginationQueryDto
  ): Promise<{ entries: ActivityEntry[]; meta: { page: number; pageSize: number; total: number } }> {
    const { entries, total } = await this.activityService.list(membership.tenantId, query.page, query.pageSize);
    return { entries, meta: { page: query.page, pageSize: query.pageSize, total } };
  }
}
