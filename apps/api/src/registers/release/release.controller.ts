import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { TenantContextGuard } from "../../tenants/guards/tenant-context.guard";
import { PermissionGuard } from "../../tenants/guards/permission.guard";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { CurrentMembership } from "../../tenants/decorators/current-membership.decorator";
import type { MembershipWithRole } from "../../memberships/memberships.service";
import { PaginationQueryDto } from "../../common/dto/pagination-query.dto";
import { ReleaseService } from "./release.service";
import { CreateReleaseRecordDto } from "./dto/create-release-record.dto";
import { UpdateReleaseRecordDto } from "./dto/update-release-record.dto";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("tenants/:slug/registers/release")
@UseGuards(JwtAuthGuard, TenantContextGuard, PermissionGuard)
export class ReleaseController {
  constructor(private readonly releaseService: ReleaseService) {}

  @Get()
  @RequirePermission("registers.release.view")
  async list(@CurrentMembership() membership: MembershipWithRole, @Query() query: PaginationQueryDto) {
    const { records, total } = await this.releaseService.list(membership.tenantId, query.page, query.pageSize);
    return { records, meta: { page: query.page, pageSize: query.pageSize, total } };
  }

  @Post()
  @RequirePermission("registers.release.create")
  async create(@CurrentMembership() membership: MembershipWithRole, @Body() dto: CreateReleaseRecordDto, @Req() req: Request) {
    const record = await this.releaseService.create({ userId: membership.userId, tenantId: membership.tenantId }, dto, requestContext(req));
    return { record };
  }

  @Patch(":id")
  @RequirePermission("registers.release.update")
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() dto: UpdateReleaseRecordDto,
    @Req() req: Request
  ) {
    const record = await this.releaseService.update({ userId: membership.userId, tenantId: membership.tenantId }, id, dto, requestContext(req));
    return { record };
  }

  @Delete(":id")
  @RequirePermission("registers.release.delete")
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request) {
    await this.releaseService.remove({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req));
    return { success: true };
  }

  @Post(":id/certificate")
  @RequirePermission("registers.release.update")
  async issueCertificate(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request) {
    const record = await this.releaseService.issueCertificate({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req));
    return { record };
  }
}
