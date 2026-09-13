import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantContextGuard } from "../tenants/guards/tenant-context.guard";
import { FeatureGuard } from "../features/guards/feature.guard";
import { PermissionGuard } from "../tenants/guards/permission.guard";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { RequireFeature } from "../common/decorators/require-feature.decorator";
import { CurrentMembership } from "../tenants/decorators/current-membership.decorator";
import type { MembershipWithRole } from "../memberships/memberships.service";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { AnnouncementsService } from "./announcements.service";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";
import { UpdateAnnouncementDto } from "./dto/update-announcement.dto";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("tenants/:slug/announcements")
@UseGuards(JwtAuthGuard, TenantContextGuard, FeatureGuard, PermissionGuard)
@RequireFeature("announcements")
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  @RequirePermission("announcements.view")
  async list(@CurrentMembership() membership: MembershipWithRole, @Query() query: PaginationQueryDto) {
    const { announcements, total } = await this.announcementsService.list(membership.tenantId, query.page, query.pageSize);
    return { announcements, meta: { page: query.page, pageSize: query.pageSize, total } };
  }

  @Get(":announcementId")
  @RequirePermission("announcements.view")
  async findOne(@CurrentMembership() membership: MembershipWithRole, @Param("announcementId") announcementId: string) {
    return { announcement: await this.announcementsService.findOne(membership.tenantId, announcementId) };
  }

  @Post()
  @RequirePermission("announcements.create")
  async create(
    @CurrentMembership() membership: MembershipWithRole,
    @Body() dto: CreateAnnouncementDto,
    @Req() req: Request
  ) {
    const announcement = await this.announcementsService.create(
      { userId: membership.userId, tenantId: membership.tenantId },
      dto,
      requestContext(req)
    );
    return { announcement };
  }

  @Patch(":announcementId")
  @RequirePermission("announcements.update")
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("announcementId") announcementId: string,
    @Body() dto: UpdateAnnouncementDto,
    @Req() req: Request
  ) {
    const announcement = await this.announcementsService.update(
      { userId: membership.userId, tenantId: membership.tenantId },
      announcementId,
      dto,
      requestContext(req)
    );
    return { announcement };
  }

  @Delete(":announcementId")
  @RequirePermission("announcements.delete")
  @HttpCode(HttpStatus.OK)
  async remove(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("announcementId") announcementId: string,
    @Req() req: Request
  ) {
    await this.announcementsService.remove(
      { userId: membership.userId, tenantId: membership.tenantId },
      announcementId,
      requestContext(req)
    );
    return { success: true };
  }
}
