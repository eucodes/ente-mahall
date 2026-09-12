import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantContextGuard } from "../tenants/guards/tenant-context.guard";
import { PermissionGuard } from "../tenants/guards/permission.guard";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { CurrentMembership } from "../tenants/decorators/current-membership.decorator";
import type { MembershipWithRole } from "../memberships/memberships.service";
import { NotificationsService } from "./notifications.service";
import { UpdateNotificationSettingsDto } from "./dto/update-notification-settings.dto";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("tenants/:slug/settings/notifications")
@UseGuards(JwtAuthGuard, TenantContextGuard, PermissionGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @RequirePermission("settings.view")
  async get(@CurrentMembership() membership: MembershipWithRole) {
    return { settings: await this.notificationsService.get(membership.tenantId) };
  }

  @Patch()
  @RequirePermission("settings.update")
  @HttpCode(HttpStatus.OK)
  async update(@CurrentMembership() membership: MembershipWithRole, @Body() dto: UpdateNotificationSettingsDto, @Req() req: Request) {
    const settings = await this.notificationsService.update({ userId: membership.userId, tenantId: membership.tenantId }, dto, requestContext(req));
    return { settings };
  }
}
