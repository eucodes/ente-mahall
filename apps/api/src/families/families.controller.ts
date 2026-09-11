import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantContextGuard } from "../tenants/guards/tenant-context.guard";
import { PermissionGuard } from "../tenants/guards/permission.guard";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { CurrentMembership } from "../tenants/decorators/current-membership.decorator";
import type { MembershipWithRole } from "../memberships/memberships.service";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { FamiliesService } from "./families.service";
import { CreateFamilyDto } from "./dto/create-family.dto";
import { UpdateFamilyDto } from "./dto/update-family.dto";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("tenants/:slug/families")
@UseGuards(JwtAuthGuard, TenantContextGuard, PermissionGuard)
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Get()
  @RequirePermission("families.view")
  async list(@CurrentMembership() membership: MembershipWithRole, @Query() query: PaginationQueryDto) {
    const { families, total } = await this.familiesService.list(membership.tenantId, query.page, query.pageSize);
    return { families, meta: { page: query.page, pageSize: query.pageSize, total } };
  }

  @Get(":familyId")
  @RequirePermission("families.view")
  async findOne(@CurrentMembership() membership: MembershipWithRole, @Param("familyId") familyId: string) {
    return { family: await this.familiesService.findOne(membership.tenantId, familyId) };
  }

  @Post()
  @RequirePermission("families.create")
  async create(@CurrentMembership() membership: MembershipWithRole, @Body() dto: CreateFamilyDto, @Req() req: Request) {
    const family = await this.familiesService.create(
      { userId: membership.userId, tenantId: membership.tenantId },
      dto,
      requestContext(req)
    );
    return { family };
  }

  @Patch(":familyId")
  @RequirePermission("families.update")
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("familyId") familyId: string,
    @Body() dto: UpdateFamilyDto,
    @Req() req: Request
  ) {
    const family = await this.familiesService.update(
      { userId: membership.userId, tenantId: membership.tenantId },
      familyId,
      dto,
      requestContext(req)
    );
    return { family };
  }

  @Delete(":familyId")
  @RequirePermission("families.delete")
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentMembership() membership: MembershipWithRole, @Param("familyId") familyId: string, @Req() req: Request) {
    await this.familiesService.remove({ userId: membership.userId, tenantId: membership.tenantId }, familyId, requestContext(req));
    return { success: true };
  }
}
