import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import type { User, Role } from "@mahalle/database";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantContextGuard } from "./guards/tenant-context.guard";
import { PermissionGuard } from "./guards/permission.guard";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { CurrentMembership } from "./decorators/current-membership.decorator";
import type { MembershipWithRole } from "../memberships/memberships.service";
import { AdminsService } from "./admins.service";
import { AddAdminDto, UpdateAdminRoleDto } from "./dto/manage-admin.dto";

function serializeMembership(m: { id: string; user: User; role: Role }) {
  return {
    id: m.id,
    user: { id: m.user.id, email: m.user.email, fullName: m.user.fullName },
    role: { key: m.role.key, name: m.role.name }
  };
}

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("tenants/:slug/admins")
@UseGuards(JwtAuthGuard, TenantContextGuard, PermissionGuard)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get()
  @RequirePermission("admins.view")
  async list(@Param("slug") slug: string, @CurrentMembership() membership: MembershipWithRole) {
    const members = await this.adminsService.list(membership.tenantId);
    return { admins: members.map(serializeMembership) };
  }

  @Post()
  @RequirePermission("admins.create")
  async add(
    @CurrentMembership() actor: MembershipWithRole,
    @Body() dto: AddAdminDto,
    @Req() req: Request
  ) {
    const membership = await this.adminsService.add(actor.tenantId, actor, dto, requestContext(req));
    return { admin: serializeMembership(membership) };
  }

  @Patch(":membershipId")
  @RequirePermission("admins.update")
  @HttpCode(HttpStatus.OK)
  async updateRole(
    @CurrentMembership() actor: MembershipWithRole,
    @Param("membershipId") membershipId: string,
    @Body() dto: UpdateAdminRoleDto,
    @Req() req: Request
  ) {
    const membership = await this.adminsService.updateRole(
      actor.tenantId,
      actor,
      membershipId,
      dto.roleKey,
      requestContext(req)
    );
    return { admin: serializeMembership(membership) };
  }

  @Delete(":membershipId")
  @RequirePermission("admins.delete")
  @HttpCode(HttpStatus.OK)
  async remove(
    @CurrentMembership() actor: MembershipWithRole,
    @Param("membershipId") membershipId: string,
    @Req() req: Request
  ) {
    await this.adminsService.remove(actor.tenantId, actor, membershipId, requestContext(req));
    return { success: true };
  }
}
