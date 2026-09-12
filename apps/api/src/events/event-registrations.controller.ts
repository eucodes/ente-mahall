import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantContextGuard } from "../tenants/guards/tenant-context.guard";
import { PermissionGuard } from "../tenants/guards/permission.guard";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { CurrentMembership } from "../tenants/decorators/current-membership.decorator";
import type { MembershipWithRole } from "../memberships/memberships.service";
import { EventRegistrationsService } from "./event-registrations.service";
import { CreateEventRegistrationDto } from "./dto/create-event-registration.dto";
import { UpdateEventRegistrationDto } from "./dto/update-event-registration.dto";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("tenants/:slug/events/:eventId/registrations")
@UseGuards(JwtAuthGuard, TenantContextGuard, PermissionGuard)
export class EventRegistrationsController {
  constructor(private readonly registrationsService: EventRegistrationsService) {}

  @Get()
  @RequirePermission("events.view")
  async list(@CurrentMembership() membership: MembershipWithRole, @Param("eventId") eventId: string) {
    return { registrations: await this.registrationsService.list(membership.tenantId, eventId) };
  }

  @Post()
  @RequirePermission("events.update")
  async create(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("eventId") eventId: string,
    @Body() dto: CreateEventRegistrationDto,
    @Req() req: Request
  ) {
    const registration = await this.registrationsService.create(
      { userId: membership.userId, tenantId: membership.tenantId },
      eventId,
      dto,
      requestContext(req)
    );
    return { registration };
  }

  @Patch(":id")
  @RequirePermission("events.update")
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("id") id: string,
    @Body() dto: UpdateEventRegistrationDto,
    @Req() req: Request
  ) {
    const registration = await this.registrationsService.update({ userId: membership.userId, tenantId: membership.tenantId }, id, dto, requestContext(req));
    return { registration };
  }

  @Delete(":id")
  @RequirePermission("events.update")
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentMembership() membership: MembershipWithRole, @Param("id") id: string, @Req() req: Request) {
    await this.registrationsService.remove({ userId: membership.userId, tenantId: membership.tenantId }, id, requestContext(req));
    return { success: true };
  }
}
