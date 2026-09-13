import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantContextGuard } from "../tenants/guards/tenant-context.guard";
import { PermissionGuard } from "../tenants/guards/permission.guard";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { CurrentMembership } from "../tenants/decorators/current-membership.decorator";
import type { MembershipWithRole } from "../memberships/memberships.service";
import { StructureService } from "./structure.service";
import { CreateDivisionDto, UpdateDivisionDto } from "./dto/division.dto";
import { UpdateStructureDto } from "./dto/update-structure.dto";
import { ReorderDivisionsDto } from "./dto/reorder-divisions.dto";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

function publicStructure(tenant: {
  hasDivisions: boolean;
  divisionTerm: string | null;
  houseNumberingMethod: string | null;
  houseNumberPrefix: string | null;
  houseNumberSuffix: string | null;
  houseNumberStartAt: number | null;
  houseNumberMinDigits: number | null;
  houseNumberAllowManual: boolean;
}) {
  return {
    hasDivisions: tenant.hasDivisions,
    divisionTerm: tenant.divisionTerm,
    houseNumberingMethod: tenant.houseNumberingMethod,
    houseNumberPrefix: tenant.houseNumberPrefix,
    houseNumberSuffix: tenant.houseNumberSuffix,
    houseNumberStartAt: tenant.houseNumberStartAt,
    houseNumberMinDigits: tenant.houseNumberMinDigits,
    houseNumberAllowManual: tenant.houseNumberAllowManual
  };
}

@Controller("tenants/:slug/structure")
@UseGuards(JwtAuthGuard, TenantContextGuard, PermissionGuard)
export class StructureController {
  constructor(private readonly structureService: StructureService) {}

  @Get()
  @RequirePermission("structure.view")
  async get(@CurrentMembership() membership: MembershipWithRole) {
    const { tenant, divisions } = await this.structureService.get(membership.tenantId);
    return { structure: publicStructure(tenant), divisions };
  }

  @Get("summary")
  @RequirePermission("structure.view")
  async summary(@CurrentMembership() membership: MembershipWithRole) {
    return this.structureService.summary(membership.tenantId);
  }

  @Patch()
  @RequirePermission("structure.update")
  @HttpCode(HttpStatus.OK)
  async update(@CurrentMembership() membership: MembershipWithRole, @Body() dto: UpdateStructureDto, @Req() req: Request) {
    const tenant = await this.structureService.update(
      { userId: membership.userId, tenantId: membership.tenantId },
      dto,
      requestContext(req)
    );
    return { structure: publicStructure(tenant) };
  }

  @Post("divisions")
  @RequirePermission("structure.update")
  async createDivision(@CurrentMembership() membership: MembershipWithRole, @Body() dto: CreateDivisionDto, @Req() req: Request) {
    const division = await this.structureService.createDivision(
      { userId: membership.userId, tenantId: membership.tenantId },
      dto,
      requestContext(req)
    );
    return { division };
  }

  @Post("divisions/reorder")
  @RequirePermission("structure.update")
  async reorderDivisions(@CurrentMembership() membership: MembershipWithRole, @Body() dto: ReorderDivisionsDto, @Req() req: Request) {
    const divisions = await this.structureService.reorderDivisions(
      { userId: membership.userId, tenantId: membership.tenantId },
      dto,
      requestContext(req)
    );
    return { divisions };
  }

  @Patch("divisions/:divisionId")
  @RequirePermission("structure.update")
  @HttpCode(HttpStatus.OK)
  async updateDivision(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("divisionId") divisionId: string,
    @Body() dto: UpdateDivisionDto,
    @Req() req: Request
  ) {
    const division = await this.structureService.updateDivision(
      { userId: membership.userId, tenantId: membership.tenantId },
      divisionId,
      dto,
      requestContext(req)
    );
    return { division };
  }

  @Patch("divisions/:divisionId/deactivate")
  @RequirePermission("structure.update")
  @HttpCode(HttpStatus.OK)
  async deactivateDivision(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("divisionId") divisionId: string,
    @Req() req: Request
  ) {
    const division = await this.structureService.deactivateDivision(
      { userId: membership.userId, tenantId: membership.tenantId },
      divisionId,
      requestContext(req)
    );
    return { division };
  }

  @Patch("divisions/:divisionId/reactivate")
  @RequirePermission("structure.update")
  @HttpCode(HttpStatus.OK)
  async reactivateDivision(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("divisionId") divisionId: string,
    @Req() req: Request
  ) {
    const division = await this.structureService.reactivateDivision(
      { userId: membership.userId, tenantId: membership.tenantId },
      divisionId,
      requestContext(req)
    );
    return { division };
  }
}
