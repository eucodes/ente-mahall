import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantContextGuard } from "../tenants/guards/tenant-context.guard";
import { PermissionGuard } from "../tenants/guards/permission.guard";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { CurrentMembership } from "../tenants/decorators/current-membership.decorator";
import type { MembershipWithRole } from "../memberships/memberships.service";
import { ServicesService, type ServiceRequestWithDetail } from "./services.service";
import { CreateServiceRequestDto } from "./dto/create-service-request.dto";
import { UpdateServiceRequestDto } from "./dto/update-service-request.dto";
import { ListServiceRequestsQueryDto } from "./dto/list-service-requests-query.dto";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("tenants/:slug/services")
@UseGuards(JwtAuthGuard, TenantContextGuard, PermissionGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @RequirePermission("services.view")
  async list(
    @CurrentMembership() membership: MembershipWithRole,
    @Query() query: ListServiceRequestsQueryDto
  ): Promise<{ requests: ServiceRequestWithDetail[]; meta: { page: number; pageSize: number; total: number } }> {
    const { requests, total } = await this.servicesService.list(membership.tenantId, query.page, query.pageSize, query.status);
    return { requests, meta: { page: query.page, pageSize: query.pageSize, total } };
  }

  @Get(":id")
  @RequirePermission("services.view")
  async findOne(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string): Promise<{ request: ServiceRequestWithDetail }> {
    return { request: await this.servicesService.findOne(membership.tenantId, id) };
  }

  @Post()
  @RequirePermission("services.create")
  async create(
    @CurrentMembership() membership: MembershipWithRole,
    @Body() dto: CreateServiceRequestDto,
    @Req() req: Request
  ): Promise<{ request: ServiceRequestWithDetail }> {
    const request = await this.servicesService.create({ userId: membership.userId, tenantId: membership.tenantId }, dto, requestContext(req));
    return { request };
  }

  @Patch(":id")
  @RequirePermission("services.update")
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() dto: UpdateServiceRequestDto,
    @Req() req: Request
  ): Promise<{ request: ServiceRequestWithDetail }> {
    const request = await this.servicesService.update({ userId: membership.userId, tenantId: membership.tenantId }, id, dto, requestContext(req));
    return { request };
  }

  @Delete(":id")
  @RequirePermission("services.delete")
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request) {
    await this.servicesService.remove({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req));
    return { success: true };
  }
}
