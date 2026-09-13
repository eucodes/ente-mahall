import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { TenantContextGuard } from "../../tenants/guards/tenant-context.guard";
import { FeatureGuard } from "../../features/guards/feature.guard";
import { PermissionGuard } from "../../tenants/guards/permission.guard";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { RequireFeature } from "../../common/decorators/require-feature.decorator";
import { CurrentMembership } from "../../tenants/decorators/current-membership.decorator";
import type { MembershipWithRole } from "../../memberships/memberships.service";
import { PaginationQueryDto } from "../../common/dto/pagination-query.dto";
import { GraveService } from "./grave.service";
import { CreateGraveRecordDto } from "./dto/create-grave-record.dto";
import { UpdateGraveRecordDto } from "./dto/update-grave-record.dto";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("tenants/:slug/registers/grave")
@UseGuards(JwtAuthGuard, TenantContextGuard, FeatureGuard, PermissionGuard)
@RequireFeature("grave-register")
export class GraveController {
  constructor(private readonly graveService: GraveService) {}

  @Get()
  @RequirePermission("registers.grave.view")
  async list(@CurrentMembership() membership: MembershipWithRole, @Query() query: PaginationQueryDto) {
    const { records, total } = await this.graveService.list(membership.tenantId, query.page, query.pageSize);
    return { records, meta: { page: query.page, pageSize: query.pageSize, total } };
  }

  @Post()
  @RequirePermission("registers.grave.create")
  async create(@CurrentMembership() membership: MembershipWithRole, @Body() dto: CreateGraveRecordDto, @Req() req: Request) {
    const record = await this.graveService.create({ userId: membership.userId, tenantId: membership.tenantId }, dto, requestContext(req));
    return { record };
  }

  @Patch(":id")
  @RequirePermission("registers.grave.update")
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() dto: UpdateGraveRecordDto,
    @Req() req: Request
  ) {
    const record = await this.graveService.update({ userId: membership.userId, tenantId: membership.tenantId }, id, dto, requestContext(req));
    return { record };
  }

  @Delete(":id")
  @RequirePermission("registers.grave.delete")
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request) {
    await this.graveService.remove({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req));
    return { success: true };
  }
}
