import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { PlatformRole } from "@mahalle/types";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PlatformContextGuard } from "./guards/platform-context.guard";
import { RequirePlatformRole } from "../common/decorators/require-platform-role.decorator";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { MembersService } from "../members/members.service";
import { CreateMemberDto } from "../members/dto/create-member.dto";
import { UpdateMemberDto } from "../members/dto/update-member.dto";
import { FamiliesService } from "../families/families.service";
import { CreateFamilyDto } from "../families/dto/create-family.dto";
import { UpdateFamilyDto } from "../families/dto/update-family.dto";
import { EventsService } from "../events/events.service";
import { CreateEventDto } from "../events/dto/create-event.dto";
import { UpdateEventDto } from "../events/dto/update-event.dto";
import { AnnouncementsService } from "../announcements/announcements.service";
import { CreateAnnouncementDto } from "../announcements/dto/create-announcement.dto";
import { UpdateAnnouncementDto } from "../announcements/dto/update-announcement.dto";
import { ProgramsService } from "../programs/programs.service";
import { CreateProgramDto } from "../programs/dto/create-program.dto";
import { UpdateProgramDto } from "../programs/dto/update-program.dto";
import { AdminsService } from "../tenants/admins.service";
import type { PlatformMembership, User, Role } from "@mahalle/database";
import { CurrentPlatformMembership } from "./decorators/current-platform-membership.decorator";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

function serializeAdminMembership(m: { id: string; user: User; role: Role }) {
  return {
    id: m.id,
    user: { id: m.user.id, email: m.user.email, fullName: m.user.fullName },
    role: { key: m.role.key, name: m.role.name }
  };
}

/**
 * Lets the control plane reach into a single Mahalle's own operational data
 * (members, families, events, announcements, programs, administrators) —
 * the same screens a tenant OWNER/ADMIN sees on their own dashboard, but
 * reached through the platform's own guard chain instead of
 * TenantContextGuard, so the documented "platform and tenant authorization
 * share no code path" separation still holds (see docs/authorization.md).
 * Any active platform member can view; SUPER_ADMIN is required to write.
 * Administrator management (add/re-role/remove) is deliberately left
 * view-only here — its role-rank rules assume a real tenant membership as
 * the actor, which a platform session doesn't have.
 */
@Controller("platform/tenants/:tenantId")
@UseGuards(JwtAuthGuard, PlatformContextGuard)
export class PlatformTenantAccessController {
  constructor(
    private readonly membersService: MembersService,
    private readonly familiesService: FamiliesService,
    private readonly eventsService: EventsService,
    private readonly announcementsService: AnnouncementsService,
    private readonly programsService: ProgramsService,
    private readonly adminsService: AdminsService
  ) {}

  // ---- Members ----

  @Get("members")
  async listMembers(@Param("tenantId") tenantId: string, @Query() query: PaginationQueryDto) {
    const { members, total } = await this.membersService.list(tenantId, query.page, query.pageSize);
    return { members, meta: { page: query.page, pageSize: query.pageSize, total } };
  }

  @Get("members/:memberId")
  async getMember(@Param("tenantId") tenantId: string, @Param("memberId") memberId: string) {
    return { member: await this.membersService.findOne(tenantId, memberId) };
  }

  @Post("members")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  async createMember(
    @Param("tenantId") tenantId: string,
    @Body() dto: CreateMemberDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const member = await this.membersService.create({ userId: membership.userId, tenantId }, dto, requestContext(req));
    return { member };
  }

  @Patch("members/:memberId")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async updateMember(
    @Param("tenantId") tenantId: string,
    @Param("memberId") memberId: string,
    @Body() dto: UpdateMemberDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const member = await this.membersService.update({ userId: membership.userId, tenantId }, memberId, dto, requestContext(req));
    return { member };
  }

  @Delete("members/:memberId")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async removeMember(
    @Param("tenantId") tenantId: string,
    @Param("memberId") memberId: string,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    await this.membersService.remove({ userId: membership.userId, tenantId }, memberId, requestContext(req));
    return { success: true };
  }

  // ---- Families ----

  @Get("families")
  async listFamilies(@Param("tenantId") tenantId: string, @Query() query: PaginationQueryDto) {
    const { families, total } = await this.familiesService.list(tenantId, query.page, query.pageSize);
    return { families, meta: { page: query.page, pageSize: query.pageSize, total } };
  }

  @Get("families/:familyId")
  async getFamily(@Param("tenantId") tenantId: string, @Param("familyId") familyId: string) {
    return { family: await this.familiesService.findOne(tenantId, familyId) };
  }

  @Post("families")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  async createFamily(
    @Param("tenantId") tenantId: string,
    @Body() dto: CreateFamilyDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const family = await this.familiesService.create({ userId: membership.userId, tenantId }, dto, requestContext(req));
    return { family };
  }

  @Patch("families/:familyId")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async updateFamily(
    @Param("tenantId") tenantId: string,
    @Param("familyId") familyId: string,
    @Body() dto: UpdateFamilyDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const family = await this.familiesService.update({ userId: membership.userId, tenantId }, familyId, dto, requestContext(req));
    return { family };
  }

  @Delete("families/:familyId")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async removeFamily(
    @Param("tenantId") tenantId: string,
    @Param("familyId") familyId: string,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    await this.familiesService.remove({ userId: membership.userId, tenantId }, familyId, requestContext(req));
    return { success: true };
  }

  // ---- Events ----

  @Get("events")
  async listEvents(@Param("tenantId") tenantId: string, @Query() query: PaginationQueryDto) {
    const { events, total } = await this.eventsService.list(tenantId, query.page, query.pageSize);
    return { events, meta: { page: query.page, pageSize: query.pageSize, total } };
  }

  @Get("events/:eventId")
  async getEvent(@Param("tenantId") tenantId: string, @Param("eventId") eventId: string) {
    return { event: await this.eventsService.findOne(tenantId, eventId) };
  }

  @Post("events")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  async createEvent(
    @Param("tenantId") tenantId: string,
    @Body() dto: CreateEventDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const event = await this.eventsService.create({ userId: membership.userId, tenantId }, dto, requestContext(req));
    return { event };
  }

  @Patch("events/:eventId")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async updateEvent(
    @Param("tenantId") tenantId: string,
    @Param("eventId") eventId: string,
    @Body() dto: UpdateEventDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const event = await this.eventsService.update({ userId: membership.userId, tenantId }, eventId, dto, requestContext(req));
    return { event };
  }

  @Delete("events/:eventId")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async removeEvent(
    @Param("tenantId") tenantId: string,
    @Param("eventId") eventId: string,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    await this.eventsService.remove({ userId: membership.userId, tenantId }, eventId, requestContext(req));
    return { success: true };
  }

  // ---- Announcements ----

  @Get("announcements")
  async listAnnouncements(@Param("tenantId") tenantId: string, @Query() query: PaginationQueryDto) {
    const { announcements, total } = await this.announcementsService.list(tenantId, query.page, query.pageSize);
    return { announcements, meta: { page: query.page, pageSize: query.pageSize, total } };
  }

  @Get("announcements/:announcementId")
  async getAnnouncement(@Param("tenantId") tenantId: string, @Param("announcementId") announcementId: string) {
    return { announcement: await this.announcementsService.findOne(tenantId, announcementId) };
  }

  @Post("announcements")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  async createAnnouncement(
    @Param("tenantId") tenantId: string,
    @Body() dto: CreateAnnouncementDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const announcement = await this.announcementsService.create({ userId: membership.userId, tenantId }, dto, requestContext(req));
    return { announcement };
  }

  @Patch("announcements/:announcementId")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async updateAnnouncement(
    @Param("tenantId") tenantId: string,
    @Param("announcementId") announcementId: string,
    @Body() dto: UpdateAnnouncementDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const announcement = await this.announcementsService.update(
      { userId: membership.userId, tenantId },
      announcementId,
      dto,
      requestContext(req)
    );
    return { announcement };
  }

  @Delete("announcements/:announcementId")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async removeAnnouncement(
    @Param("tenantId") tenantId: string,
    @Param("announcementId") announcementId: string,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    await this.announcementsService.remove({ userId: membership.userId, tenantId }, announcementId, requestContext(req));
    return { success: true };
  }

  // ---- Programs ----

  @Get("programs")
  async listPrograms(@Param("tenantId") tenantId: string, @Query() query: PaginationQueryDto) {
    const { programs, total } = await this.programsService.list(tenantId, query.page, query.pageSize);
    return { programs, meta: { page: query.page, pageSize: query.pageSize, total } };
  }

  @Get("programs/:programId")
  async getProgram(@Param("tenantId") tenantId: string, @Param("programId") programId: string) {
    return { program: await this.programsService.findOne(tenantId, programId) };
  }

  @Post("programs")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  async createProgram(
    @Param("tenantId") tenantId: string,
    @Body() dto: CreateProgramDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const program = await this.programsService.create({ userId: membership.userId, tenantId }, dto, requestContext(req));
    return { program };
  }

  @Patch("programs/:programId")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async updateProgram(
    @Param("tenantId") tenantId: string,
    @Param("programId") programId: string,
    @Body() dto: UpdateProgramDto,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    const program = await this.programsService.update({ userId: membership.userId, tenantId }, programId, dto, requestContext(req));
    return { program };
  }

  @Delete("programs/:programId")
  @RequirePlatformRole(PlatformRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async removeProgram(
    @Param("tenantId") tenantId: string,
    @Param("programId") programId: string,
    @CurrentPlatformMembership() membership: PlatformMembership,
    @Req() req: Request
  ) {
    await this.programsService.remove({ userId: membership.userId, tenantId }, programId, requestContext(req));
    return { success: true };
  }

  // ---- Administrators (view-only: role-rank logic assumes a real tenant actor) ----

  @Get("admins")
  async listAdmins(@Param("tenantId") tenantId: string) {
    const members = await this.adminsService.list(tenantId);
    return { admins: members.map(serializeAdminMembership) };
  }
}
