import { Body, Controller, Get, Param, Patch, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { SupportStatus } from "@mahalle/database";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantContextGuard } from "../tenants/guards/tenant-context.guard";
import { PermissionGuard } from "../tenants/guards/permission.guard";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { CurrentMembership } from "../tenants/decorators/current-membership.decorator";
import type { MembershipWithRole } from "../memberships/memberships.service";
import { HealthSupportService } from "./health-support.service";
import { MemberHealthProfileDto } from "./dto/member-health-profile.dto";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("tenants/:slug/health-support")
@UseGuards(JwtAuthGuard, TenantContextGuard, PermissionGuard)
export class HealthSupportController {
  constructor(private readonly healthSupportService: HealthSupportService) {}

  @Get("stats")
  @RequirePermission("health.view")
  async getStats(@CurrentMembership() membership: MembershipWithRole) {
    const stats = await this.healthSupportService.getStats(membership.tenantId);
    return { stats, ...stats };
  }

  @Get("members")
  @RequirePermission("health.view")
  async listMembers(
    @CurrentMembership() membership: MembershipWithRole,
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string,
    @Query("search") search?: string,
    @Query("tab") tab?: "all" | "welfare" | "chronic" | "disability" | "care"
  ) {
    return this.healthSupportService.listMembers(membership.tenantId, {
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 20,
      search,
      tab
    });
  }

  @Get("families")
  @RequirePermission("health.view")
  async listFamilies(
    @CurrentMembership() membership: MembershipWithRole,
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string,
    @Query("search") search?: string
  ) {
    return this.healthSupportService.listFamilies(membership.tenantId, {
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 20,
      search
    });
  }

  @Patch("members/:memberId")
  @RequirePermission("health.manage")
  async updateMemberHealthProfile(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("memberId") memberId: string,
    @Body() dto: MemberHealthProfileDto,
    @Req() req: Request
  ) {
    return this.healthSupportService.updateMemberHealthProfile(
      { userId: membership.userId, tenantId: membership.tenantId },
      memberId,
      dto,
      requestContext(req)
    );
  }

  @Patch("families/:familyId")
  @RequirePermission("health.manage")
  async updateFamilySupport(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("familyId") familyId: string,
    @Body()
    dto: {
      requiresCommunitySupport?: boolean;
      supportCategory?: string;
      supportStatus?: SupportStatus;
      supportNotes?: string;
      emergencyContactName?: string;
      emergencyContactPhone?: string;
    },
    @Req() req: Request
  ) {
    return this.healthSupportService.updateFamilySupport(
      { userId: membership.userId, tenantId: membership.tenantId },
      familyId,
      dto,
      requestContext(req)
    );
  }
}
