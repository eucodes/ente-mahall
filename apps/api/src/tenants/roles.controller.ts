import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { PERMISSIONS } from "@mahalle/types";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantContextGuard } from "./guards/tenant-context.guard";
import { PermissionGuard } from "./guards/permission.guard";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { CurrentMembership } from "./decorators/current-membership.decorator";
import type { MembershipWithRole } from "../memberships/memberships.service";
import { RolesService } from "./roles.service";
import { CreateRoleDto, UpdateRoleDto } from "./dto/manage-role.dto";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("tenants/:slug/roles")
@UseGuards(JwtAuthGuard, TenantContextGuard, PermissionGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @RequirePermission("roles.view")
  async list(@CurrentMembership() membership: MembershipWithRole) {
    return { roles: await this.rolesService.list(membership.tenantId) };
  }

  @Get(":roleId")
  @RequirePermission("roles.view")
  async get(@CurrentMembership() membership: MembershipWithRole, @Param("roleId") roleId: string) {
    return { role: await this.rolesService.get(membership.tenantId, roleId) };
  }

  @Post()
  @RequirePermission("roles.create")
  async create(@CurrentMembership() membership: MembershipWithRole, @Body() dto: CreateRoleDto, @Req() req: Request) {
    const role = await this.rolesService.create({ userId: membership.userId, tenantId: membership.tenantId }, dto, requestContext(req));
    return { role };
  }

  @Patch(":roleId")
  @RequirePermission("roles.update")
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("roleId") roleId: string,
    @Body() dto: UpdateRoleDto,
    @Req() req: Request
  ) {
    const role = await this.rolesService.update({ userId: membership.userId, tenantId: membership.tenantId }, roleId, dto, requestContext(req));
    return { role };
  }

  @Post(":roleId/duplicate")
  @RequirePermission("roles.create")
  async duplicate(@CurrentMembership() membership: MembershipWithRole, @Param("roleId") roleId: string, @Req() req: Request) {
    const role = await this.rolesService.duplicate({ userId: membership.userId, tenantId: membership.tenantId }, roleId, requestContext(req));
    return { role };
  }

  @Patch(":roleId/deactivate")
  @RequirePermission("roles.delete")
  @HttpCode(HttpStatus.OK)
  async deactivate(@CurrentMembership() membership: MembershipWithRole, @Param("roleId") roleId: string, @Req() req: Request) {
    const role = await this.rolesService.deactivate({ userId: membership.userId, tenantId: membership.tenantId }, roleId, requestContext(req));
    return { role };
  }

  @Patch(":roleId/reactivate")
  @RequirePermission("roles.update")
  @HttpCode(HttpStatus.OK)
  async reactivate(@CurrentMembership() membership: MembershipWithRole, @Param("roleId") roleId: string, @Req() req: Request) {
    const role = await this.rolesService.reactivate({ userId: membership.userId, tenantId: membership.tenantId }, roleId, requestContext(req));
    return { role };
  }
}

/**
 * The read-only permission catalogue, grouped by resource — powers the
 * permission matrix in the Role Editor and the standalone "Permissions"
 * reference screen. Kept alongside RolesController since it exists purely
 * to support role management, not as its own feature.
 */
@Controller("tenants/:slug/permissions")
@UseGuards(JwtAuthGuard, TenantContextGuard, PermissionGuard)
export class PermissionsCatalogueController {
  @Get()
  @RequirePermission("roles.view")
  list() {
    const groups = new Map<string, string[]>();
    for (const key of PERMISSIONS) {
      const category = key.split(".")[0] ?? "general";
      groups.set(category, [...(groups.get(category) ?? []), key]);
    }
    return { categories: Array.from(groups.entries()).map(([category, keys]) => ({ category, keys })) };
  }
}
