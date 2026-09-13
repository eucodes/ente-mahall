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
import { MarriageService } from "./marriage.service";
import { CreateMarriageRecordDto } from "./dto/create-marriage-record.dto";
import { UpdateMarriageRecordDto } from "./dto/update-marriage-record.dto";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("tenants/:slug/registers/marriage")
@UseGuards(JwtAuthGuard, TenantContextGuard, FeatureGuard, PermissionGuard)
@RequireFeature("marriage-register")
export class MarriageController {
  constructor(private readonly marriageService: MarriageService) {}

  @Get()
  @RequirePermission("registers.marriage.view")
  async list(@CurrentMembership() membership: MembershipWithRole, @Query() query: PaginationQueryDto) {
    const { records, total } = await this.marriageService.list(membership.tenantId, query.page, query.pageSize);
    return { records, meta: { page: query.page, pageSize: query.pageSize, total } };
  }

  @Post()
  @RequirePermission("registers.marriage.create")
  async create(@CurrentMembership() membership: MembershipWithRole, @Body() dto: CreateMarriageRecordDto, @Req() req: Request) {
    const record = await this.marriageService.create({ userId: membership.userId, tenantId: membership.tenantId }, dto, requestContext(req));
    return { record };
  }

  @Patch(":id")
  @RequirePermission("registers.marriage.update")
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() dto: UpdateMarriageRecordDto,
    @Req() req: Request
  ) {
    const record = await this.marriageService.update({ userId: membership.userId, tenantId: membership.tenantId }, id, dto, requestContext(req));
    return { record };
  }

  @Delete(":id")
  @RequirePermission("registers.marriage.delete")
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request) {
    await this.marriageService.remove({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req));
    return { success: true };
  }

  @Post(":id/certificate")
  @RequirePermission("registers.marriage.update")
  async issueCertificate(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request) {
    const record = await this.marriageService.issueCertificate({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req));
    return { record };
  }
}
