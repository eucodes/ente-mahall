import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantContextGuard } from "../tenants/guards/tenant-context.guard";
import { PermissionGuard } from "../tenants/guards/permission.guard";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { CurrentMembership } from "../tenants/decorators/current-membership.decorator";
import type { MembershipWithRole } from "../memberships/memberships.service";
import { HousesService } from "./houses.service";
import { CreateHouseDto } from "./dto/create-house.dto";
import { UpdateHouseDto } from "./dto/update-house.dto";
import { ListHousesQueryDto } from "./dto/list-houses-query.dto";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("tenants/:slug/houses")
@UseGuards(JwtAuthGuard, TenantContextGuard, PermissionGuard)
export class HousesController {
  constructor(private readonly housesService: HousesService) {}

  @Get()
  @RequirePermission("houses.view")
  async list(@CurrentMembership() membership: MembershipWithRole, @Query() query: ListHousesQueryDto) {
    const { houses, total } = await this.housesService.list(
      membership.tenantId,
      query.page,
      query.pageSize,
      query.divisionId
    );
    return { houses, meta: { page: query.page, pageSize: query.pageSize, total } };
  }

  @Get(":houseId")
  @RequirePermission("houses.view")
  async findOne(@CurrentMembership() membership: MembershipWithRole, @Param("houseId") houseId: string) {
    return { house: await this.housesService.findOne(membership.tenantId, houseId) };
  }

  @Post()
  @RequirePermission("houses.create")
  async create(@CurrentMembership() membership: MembershipWithRole, @Body() dto: CreateHouseDto, @Req() req: Request) {
    const house = await this.housesService.create(
      { userId: membership.userId, tenantId: membership.tenantId },
      dto,
      requestContext(req)
    );
    return { house };
  }

  @Patch(":houseId")
  @RequirePermission("houses.update")
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("houseId") houseId: string,
    @Body() dto: UpdateHouseDto,
    @Req() req: Request
  ) {
    const house = await this.housesService.update(
      { userId: membership.userId, tenantId: membership.tenantId },
      houseId,
      dto,
      requestContext(req)
    );
    return { house };
  }

  @Delete(":houseId")
  @RequirePermission("houses.delete")
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentMembership() membership: MembershipWithRole, @Param("houseId") houseId: string, @Req() req: Request) {
    await this.housesService.remove({ userId: membership.userId, tenantId: membership.tenantId }, houseId, requestContext(req));
    return { success: true };
  }
}
