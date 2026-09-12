import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantContextGuard } from "../tenants/guards/tenant-context.guard";
import { PermissionGuard } from "../tenants/guards/permission.guard";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { CurrentMembership } from "../tenants/decorators/current-membership.decorator";
import type { MembershipWithRole } from "../memberships/memberships.service";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { CommitteeService } from "./committee.service";
import { CreateCommitteeMemberDto } from "./dto/create-committee-member.dto";
import { UpdateCommitteeMemberDto } from "./dto/update-committee-member.dto";
import { CreateCommitteeMeetingDto } from "./dto/create-committee-meeting.dto";
import { UpdateCommitteeMeetingDto } from "./dto/update-committee-meeting.dto";
import { CreateCommitteeDecisionDto } from "./dto/create-committee-decision.dto";
import { UpdateCommitteeDecisionDto } from "./dto/update-committee-decision.dto";

function requestContext(req: Request) {
  return { ipAddress: req.ip, userAgent: req.headers["user-agent"] };
}

@Controller("tenants/:slug/committee")
@UseGuards(JwtAuthGuard, TenantContextGuard, PermissionGuard)
export class CommitteeController {
  constructor(private readonly committeeService: CommitteeService) {}

  // --- Members (posts) ---

  @Get("members")
  @RequirePermission("committee.view")
  async listMembers(@CurrentMembership() membership: MembershipWithRole) {
    return { members: await this.committeeService.listMembers(membership.tenantId) };
  }

  @Post("members")
  @RequirePermission("committee.create")
  async createMember(@CurrentMembership() membership: MembershipWithRole, @Body() dto: CreateCommitteeMemberDto, @Req() req: Request) {
    const member = await this.committeeService.createMember(
      { userId: membership.userId, tenantId: membership.tenantId },
      dto,
      requestContext(req)
    );
    return { member };
  }

  @Patch("members/:committeeMemberId")
  @RequirePermission("committee.update")
  @HttpCode(HttpStatus.OK)
  async updateMember(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("committeeMemberId") committeeMemberId: string,
    @Body() dto: UpdateCommitteeMemberDto,
    @Req() req: Request
  ) {
    const member = await this.committeeService.updateMember(
      { userId: membership.userId, tenantId: membership.tenantId },
      committeeMemberId,
      dto,
      requestContext(req)
    );
    return { member };
  }

  @Delete("members/:committeeMemberId")
  @RequirePermission("committee.delete")
  @HttpCode(HttpStatus.OK)
  async removeMember(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("committeeMemberId") committeeMemberId: string,
    @Req() req: Request
  ) {
    await this.committeeService.removeMember({ userId: membership.userId, tenantId: membership.tenantId }, committeeMemberId, requestContext(req));
    return { success: true };
  }

  // --- Meetings ---

  @Get("meetings")
  @RequirePermission("committee.view")
  async listMeetings(@CurrentMembership() membership: MembershipWithRole, @Query() query: PaginationQueryDto) {
    const { meetings, total } = await this.committeeService.listMeetings(membership.tenantId, query.page, query.pageSize);
    return { meetings, meta: { page: query.page, pageSize: query.pageSize, total } };
  }

  @Get("meetings/:meetingId")
  @RequirePermission("committee.view")
  async findMeeting(@CurrentMembership() membership: MembershipWithRole, @Param("meetingId") meetingId: string) {
    return { meeting: await this.committeeService.findMeetingOrThrow(membership.tenantId, meetingId) };
  }

  @Post("meetings")
  @RequirePermission("committee.create")
  async createMeeting(@CurrentMembership() membership: MembershipWithRole, @Body() dto: CreateCommitteeMeetingDto, @Req() req: Request) {
    const meeting = await this.committeeService.createMeeting(
      { userId: membership.userId, tenantId: membership.tenantId },
      dto,
      requestContext(req)
    );
    return { meeting };
  }

  @Patch("meetings/:meetingId")
  @RequirePermission("committee.update")
  @HttpCode(HttpStatus.OK)
  async updateMeeting(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("meetingId") meetingId: string,
    @Body() dto: UpdateCommitteeMeetingDto,
    @Req() req: Request
  ) {
    const meeting = await this.committeeService.updateMeeting(
      { userId: membership.userId, tenantId: membership.tenantId },
      meetingId,
      dto,
      requestContext(req)
    );
    return { meeting };
  }

  @Delete("meetings/:meetingId")
  @RequirePermission("committee.delete")
  @HttpCode(HttpStatus.OK)
  async removeMeeting(@CurrentMembership() membership: MembershipWithRole, @Param("meetingId") meetingId: string, @Req() req: Request) {
    await this.committeeService.removeMeeting({ userId: membership.userId, tenantId: membership.tenantId }, meetingId, requestContext(req));
    return { success: true };
  }

  // --- Decisions (nested under a meeting) ---

  @Post("meetings/:meetingId/decisions")
  @RequirePermission("committee.update")
  async createDecision(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("meetingId") meetingId: string,
    @Body() dto: CreateCommitteeDecisionDto,
    @Req() req: Request
  ) {
    const decision = await this.committeeService.createDecision(
      { userId: membership.userId, tenantId: membership.tenantId },
      meetingId,
      dto,
      requestContext(req)
    );
    return { decision };
  }

  @Patch("decisions/:decisionId")
  @RequirePermission("committee.update")
  @HttpCode(HttpStatus.OK)
  async updateDecision(
    @CurrentMembership() membership: MembershipWithRole,
    @Param("decisionId") decisionId: string,
    @Body() dto: UpdateCommitteeDecisionDto,
    @Req() req: Request
  ) {
    const decision = await this.committeeService.updateDecision(
      { userId: membership.userId, tenantId: membership.tenantId },
      decisionId,
      dto,
      requestContext(req)
    );
    return { decision };
  }

  @Delete("decisions/:decisionId")
  @RequirePermission("committee.delete")
  @HttpCode(HttpStatus.OK)
  async removeDecision(@CurrentMembership() membership: MembershipWithRole, @Param("decisionId") decisionId: string, @Req() req: Request) {
    await this.committeeService.removeDecision({ userId: membership.userId, tenantId: membership.tenantId }, decisionId, requestContext(req));
    return { success: true };
  }
}
