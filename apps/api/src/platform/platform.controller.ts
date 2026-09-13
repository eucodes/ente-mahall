import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import type { PlatformMembership } from "@mahalle/database";
import { PlatformRole } from "@mahalle/types";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PlatformContextGuard } from "./guards/platform-context.guard";
import { CurrentPlatformMembership } from "./decorators/current-platform-membership.decorator";
import { RequirePlatformRole } from "../common/decorators/require-platform-role.decorator";
import { PlatformService } from "./platform.service";
import { ListAuditLogsDto } from "./dto/list-audit-logs.dto";
import { StartSupportSessionDto } from "./dto/support-session.dto";
import { UpdateTenantStatusDto } from "./dto/update-tenant-status.dto";
import { UpdateRolePermissionsDto } from "./dto/update-role-permissions.dto";
import { BulkDeleteTenantsDto } from "./dto/bulk-delete-tenants.dto";
import { GrantPlatformAccessDto } from "./dto/grant-platform-access.dto";
import { UpdatePlatformRoleDto } from "./dto/update-platform-role.dto";
import { ProvisionTenantDto } from "./dto/provision-tenant.dto";
import { UpdateTenantProfileDto } from "./dto/update-tenant-profile.dto";


function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("platform")
@UseGuards(JwtAuthGuard, PlatformContextGuard)
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  /** Whether the current user has control-plane access at all, and what role. Mirrors /tenants/:slug/me's pattern. */
  @Get("me")
  me(@CurrentPlatformMembership() membership: PlatformMembership) {
    return { role: membership.role };
  }

  @Get("tenants")
  async tenants() {
    const tenants = await this.platformService.listAllTenants();
    return { tenants };
  }

  @Post("tenants")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async provisionTenant(
    @Body() dto: ProvisionTenantDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const tenant = await this.platformService.provisionTenant(dto, membership.userId, requestContext(req));
    return { tenant };
  }

  @Get("tenants/:tenantId")
  async tenant(@Param("tenantId") tenantId: string) {
    const tenant = await this.platformService.getTenantDetail(tenantId);
    return { tenant };
  }

  @Patch("tenants/:tenantId")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async updateTenantProfile(
    @Param("tenantId") tenantId: string,
    @Body() dto: UpdateTenantProfileDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const tenant = await this.platformService.updateTenantProfile(
      tenantId,
      dto,
      membership.userId,
      requestContext(req)
    );
    return { tenant };
  }


  /** Suspend ("stop") or reactivate a Mahalle. Reversible — see PlatformService for what this does and doesn't affect. */
  @Patch("tenants/:tenantId/status")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async updateTenantStatus(
    @Param("tenantId") tenantId: string,
    @Body() dto: UpdateTenantStatusDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const tenant = await this.platformService.setTenantStatus(
      tenantId,
      dto.isActive,
      membership.userId,
      requestContext(req)
    );
    return { tenant };
  }

  /** Declares the start of an audited Support Mode session against this Mahalle. Grants no access by itself — see PlatformService.startSupportSession. */
  @Post("tenants/:tenantId/support/start")
  @HttpCode(HttpStatus.OK)
  async startSupportSession(
    @Param("tenantId") tenantId: string,
    @Body() dto: StartSupportSessionDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    await this.platformService.startSupportSession(tenantId, dto.reason, membership.userId, requestContext(req));
    return { success: true };
  }

  /** Declares the end of a previously started Support Mode session. */
  @Post("tenants/:tenantId/support/end")
  @HttpCode(HttpStatus.OK)
  async endSupportSession(
    @Param("tenantId") tenantId: string,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    await this.platformService.endSupportSession(tenantId, membership.userId, requestContext(req));
    return { success: true };
  }

  /** Permanently deletes several Mahalles at once. Irreversible; stale ids in the selection are skipped, not fatal. */
  @Post("tenants/bulk-delete")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async bulkDeleteTenants(
    @Body() dto: BulkDeleteTenantsDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const result = await this.platformService.bulkDeleteTenants(dto.tenantIds, membership.userId, requestContext(req));
    return result;
  }

  /** Permanently deletes a Mahalle and everything under it. Irreversible. */
  @Delete("tenants/:tenantId")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async deleteTenant(
    @Param("tenantId") tenantId: string,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    await this.platformService.deleteTenant(tenantId, membership.userId, requestContext(req));
    return { success: true };
  }

  /** What each of a tenant's roles currently grants — read side of platform control over tenant admins. */
  @Get("tenants/:tenantId/roles")
  async tenantRoles(@Param("tenantId") tenantId: string) {
    const roles = await this.platformService.getTenantRoles(tenantId);
    return { roles };
  }

  /** Overrides what a tenant role (e.g. its ADMIN) is permitted to do — the platform deciding, not the tenant's own OWNER. */
  @Patch("tenants/:tenantId/roles/:roleId/permissions")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async updateRolePermissions(
    @Param("tenantId") tenantId: string,
    @Param("roleId") roleId: string,
    @Body() dto: UpdateRolePermissionsDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const role = await this.platformService.updateRolePermissions(
      tenantId,
      roleId,
      dto.permissions,
      membership.userId,
      requestContext(req)
    );
    return { role };
  }

  /** Every account with control-plane access — visible to any platform member, mutated by SUPER_ADMIN only. */
  @Get("users")
  async platformUsers() {
    const users = await this.platformService.listPlatformUsers();
    return { users };
  }

  @Post("users")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async grantPlatformAccess(
    @Body() dto: GrantPlatformAccessDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const user = await this.platformService.grantPlatformAccess(
      dto.email,
      dto.role,
      membership.userId,
      requestContext(req)
    );
    return { user };
  }

  @Patch("users/:membershipId/role")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async updatePlatformUserRole(
    @Param("membershipId") membershipId: string,
    @Body() dto: UpdatePlatformRoleDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const user = await this.platformService.updatePlatformMembershipRole(
      membershipId,
      dto.role,
      membership.userId,
      requestContext(req)
    );
    return { user };
  }

  @Delete("users/:membershipId")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async revokePlatformAccess(
    @Param("membershipId") membershipId: string,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    await this.platformService.revokePlatformAccess(membershipId, membership.userId, requestContext(req));
    return { success: true };
  }

  /** A platform user's sign-in sessions (Section K's "Access / Security"). */
  @Get("users/:userId/sessions")
  async userSessions(@Param("userId") userId: string) {
    const sessions = await this.platformService.listUserSessions(userId);
    return { sessions };
  }

  @Post("sessions/:sessionId/revoke")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async revokeSession(
    @Param("sessionId") sessionId: string,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    await this.platformService.revokeSession(sessionId, membership.userId, requestContext(req));
    return { success: true };
  }

  @Get("all-users")
  async allUsers(@Query("search") search?: string) {
    const users = await this.platformService.listAllUsers(search);
    return { users };
  }

  @Get("system/status")
  async systemStatus() {
    return await this.platformService.getSystemStatus();
  }

  @Get("audit-logs")
  async auditLogs(@Query() query: ListAuditLogsDto) {
    const { entries, total } = await this.platformService.listAuditLogs(query);
    return {
      entries,
      meta: { page: query.page, pageSize: query.pageSize, total }
    };
  }
}

