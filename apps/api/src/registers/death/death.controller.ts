import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { TenantContextGuard } from "../../tenants/guards/tenant-context.guard";
import { PermissionGuard } from "../../tenants/guards/permission.guard";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { CurrentMembership } from "../../tenants/decorators/current-membership.decorator";
import type { MembershipWithRole } from "../../memberships/memberships.service";
import { PaginationQueryDto } from "../../common/dto/pagination-query.dto";
import { DeathService } from "./death.service";
import { CreateDeathRecordDto } from "./dto/create-death-record.dto";
import { UpdateDeathRecordDto } from "./dto/update-death-record.dto";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("tenants/:slug/registers/death")
@UseGuards(JwtAuthGuard, TenantContextGuard, PermissionGuard)
export class DeathController {
  constructor(private readonly deathService: DeathService) {}

  @Get()
  @RequirePermission("registers.death.view")
  async list(@CurrentMembership() membership: MembershipWithRole, @Query() query: PaginationQueryDto) {
    const { records, total } = await this.deathService.list(membership.tenantId, query.page, query.pageSize);
    return { records, meta: { page: query.page, pageSize: query.pageSize, total } };
  }

  @Post()
  @RequirePermission("registers.death.create")
  async create(@CurrentMembership() membership: MembershipWithRole, @Body() dto: CreateDeathRecordDto, @Req() req: Request) {
    const record = await this.deathService.create({ userId: membership.userId, tenantId: membership.tenantId }, dto, requestContext(req));
    return { record };
  }

  @Patch(":id")
  @RequirePermission("registers.death.update")
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() dto: UpdateDeathRecordDto,
    @Req() req: Request
  ) {
    const record = await this.deathService.update({ userId: membership.userId, tenantId: membership.tenantId }, id, dto, requestContext(req));
    return { record };
  }

  @Delete(":id")
  @RequirePermission("registers.death.delete")
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request) {
    await this.deathService.remove({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req));
    return { success: true };
  }

  @Post(":id/certificate")
  @RequirePermission("registers.death.update")
  async issueCertificate(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request) {
    const record = await this.deathService.issueCertificate({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req));
    return { record };
  }
}
