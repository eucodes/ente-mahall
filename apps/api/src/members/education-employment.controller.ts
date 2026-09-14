import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { EducationLevel, EmploymentStatus } from "@mahalle/database";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantContextGuard } from "../tenants/guards/tenant-context.guard";
import { PermissionGuard } from "../tenants/guards/permission.guard";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { CurrentMembership } from "../tenants/decorators/current-membership.decorator";
import type { MembershipWithRole } from "../memberships/memberships.service";
import { EducationEmploymentService } from "./education-employment.service";

@Controller("tenants/:slug/education-employment")
@UseGuards(JwtAuthGuard, TenantContextGuard, PermissionGuard)
export class EducationEmploymentController {
  constructor(private readonly educationEmploymentService: EducationEmploymentService) {}

  @Get("stats")
  @RequirePermission("education.view")
  async getStats(@CurrentMembership() membership: MembershipWithRole) {
    const stats = await this.educationEmploymentService.getStats(membership.tenantId);
    return { stats, ...stats };
  }

  @Get("members")
  @RequirePermission("education.view")
  async listMembers(
    @CurrentMembership() membership: MembershipWithRole,
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string,
    @Query("search") search?: string,
    @Query("status") status?: EmploymentStatus,
    @Query("level") level?: EducationLevel,
    @Query("isJobSeeker") isJobSeeker?: string,
    @Query("skill") skill?: string
  ) {
    return this.educationEmploymentService.listMembers(membership.tenantId, {
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 20,
      search,
      status,
      level,
      isJobSeeker: isJobSeeker !== undefined ? isJobSeeker === "true" : undefined,
      skill
    });
  }
}
