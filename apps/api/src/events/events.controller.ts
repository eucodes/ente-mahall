import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantContextGuard } from "../tenants/guards/tenant-context.guard";
import { FeatureGuard } from "../features/guards/feature.guard";
import { PermissionGuard } from "../tenants/guards/permission.guard";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { RequireFeature } from "../common/decorators/require-feature.decorator";
import { CurrentMembership } from "../tenants/decorators/current-membership.decorator";
import type { MembershipWithRole } from "../memberships/memberships.service";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { EventsService } from "./events.service";
import { EventRegistrationsService } from "./event-registrations.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("tenants/:slug/events")
@UseGuards(JwtAuthGuard, TenantContextGuard, FeatureGuard, PermissionGuard)
@RequireFeature("events")
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly registrationsService: EventRegistrationsService
  ) {}

  @Get()
  @RequirePermission("events.view")
  async list(@CurrentMembership() membership: MembershipWithRole, @Query() query: PaginationQueryDto) {
    const { events, total } = await this.eventsService.list(membership.tenantId, query.page, query.pageSize);
    return { events, meta: { page: query.page, pageSize: query.pageSize, total } };
  }

  @Get(":eventId")
  @RequirePermission("events.view")
  async findOne(@CurrentMembership() membership: MembershipWithRole, @Param("eventId") eventId: string) {
    return { event: await this.eventsService.findOne(membership.tenantId, eventId) };
  }

  @Post()
  @RequirePermission("events.create")
  async create(@CurrentMembership() membership: MembershipWithRole, @Body() dto: CreateEventDto, @Req() req: Request) {
    const event = await this.eventsService.create(
      { userId: membership.userId, tenantId: membership.tenantId },
      dto,
      requestContext(req)
    );
    return { event };
  }

  @Patch(":eventId")
  @RequirePermission("events.update")
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("eventId") eventId: string,
    @Body() dto: UpdateEventDto,
    @Req() req: Request
  ) {
    const event = await this.eventsService.update(
      { userId: membership.userId, tenantId: membership.tenantId },
      eventId,
      dto,
      requestContext(req)
    );
    return { event };
  }

  @Delete(":eventId")
  @RequirePermission("events.delete")
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentMembership() membership: MembershipWithRole, @Param("eventId") eventId: string, @Req() req: Request) {
    await this.eventsService.remove({ userId: membership.userId, tenantId: membership.tenantId }, eventId, requestContext(req));
    return { success: true };
  }

  @Get(":eventId/finance-summary")
  @RequirePermission("finance.view")
  async financeSummary(@CurrentMembership() membership: MembershipWithRole, @Param("eventId") eventId: string) {
    return this.registrationsService.financeSummary(membership.tenantId, eventId);
  }
}
