import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { TenantContextGuard } from "../../tenants/guards/tenant-context.guard";
import { PermissionGuard } from "../../tenants/guards/permission.guard";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { CurrentMembership } from "../../tenants/decorators/current-membership.decorator";
import type { MembershipWithRole } from "../../memberships/memberships.service";
import { PaginationQueryDto } from "../../common/dto/pagination-query.dto";
import { MadrassaService } from "./madrassa.service";
import { CreateMadrassaEnrollmentDto } from "./dto/create-madrassa-enrollment.dto";
import { UpdateMadrassaEnrollmentDto } from "./dto/update-madrassa-enrollment.dto";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("tenants/:slug/registers/madrassa")
@UseGuards(JwtAuthGuard, TenantContextGuard, PermissionGuard)
export class MadrassaController {
  constructor(private readonly madrassaService: MadrassaService) {}

  @Get()
  @RequirePermission("registers.madrassa.view")
  async list(@CurrentMembership() membership: MembershipWithRole, @Query() query: PaginationQueryDto) {
    const { records, total } = await this.madrassaService.list(membership.tenantId, query.page, query.pageSize);
    return { records, meta: { page: query.page, pageSize: query.pageSize, total } };
  }

  @Post()
  @RequirePermission("registers.madrassa.create")
  async create(@CurrentMembership() membership: MembershipWithRole, @Body() dto: CreateMadrassaEnrollmentDto, @Req() req: Request) {
    const record = await this.madrassaService.create({ userId: membership.userId, tenantId: membership.tenantId }, dto, requestContext(req));
    return { record };
  }

  @Patch(":id")
  @RequirePermission("registers.madrassa.update")
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() dto: UpdateMadrassaEnrollmentDto,
    @Req() req: Request
  ) {
    const record = await this.madrassaService.update({ userId: membership.userId, tenantId: membership.tenantId }, id, dto, requestContext(req));
    return { record };
  }

  @Delete(":id")
  @RequirePermission("registers.madrassa.delete")
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request) {
    await this.madrassaService.remove({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req));
    return { success: true };
  }
}
