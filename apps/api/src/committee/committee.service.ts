import { Injectable, NotFoundException } from "@nestjs/common";
import type { CommitteeDecision, Prisma } from "@mahalle/database";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import type { CreateCommitteeMemberDto } from "./dto/create-committee-member.dto";
import type { UpdateCommitteeMemberDto } from "./dto/update-committee-member.dto";
import type { CreateCommitteeMeetingDto } from "./dto/create-committee-meeting.dto";
import type { UpdateCommitteeMeetingDto } from "./dto/update-committee-meeting.dto";
import type { CreateCommitteeDecisionDto } from "./dto/create-committee-decision.dto";
import type { UpdateCommitteeDecisionDto } from "./dto/update-committee-decision.dto";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

interface ActorContext {
  userId: string;
  tenantId: string;
}

const MEMBER_INCLUDE = { member: { select: { id: true, fullName: true, phone: true } } } as const;
export type CommitteeMemberWithPerson = Prisma.CommitteeMemberGetPayload<{ include: typeof MEMBER_INCLUDE }>;

const MEETING_INCLUDE = {
  attendees: { include: MEMBER_INCLUDE },
  decisions: true
} as const;
export type CommitteeMeetingWithDetail = Prisma.CommitteeMeetingGetPayload<{ include: typeof MEETING_INCLUDE }>;

function toMeetingData(dto: Partial<CreateCommitteeMeetingDto>) {
  const { meetingDate, attendeeIds: _attendeeIds, ...rest } = dto;
  return {
    ...rest,
    ...(meetingDate !== undefined && { meetingDate: new Date(meetingDate) })
  };
}

function toCommitteeMemberData(dto: Partial<CreateCommitteeMemberDto>) {
  const { termStart, termEnd, ...rest } = dto;
  return {
    ...rest,
    ...(termStart !== undefined && { termStart: termStart ? new Date(termStart) : null }),
    ...(termEnd !== undefined && { termEnd: termEnd ? new Date(termEnd) : null })
  };
}

/** Same tenant-scoping pattern as MembersService — see its comment for why. */
@Injectable()
export class CommitteeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  // --- Committee members (posts) --------------------------------------

  async listMembers(tenantId: string): Promise<CommitteeMemberWithPerson[]> {
    return this.prisma.committeeMember.findMany({
      where: { tenantId, isActive: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      include: MEMBER_INCLUDE
    });
  }

  private async findMemberOrThrow(tenantId: string, committeeMemberId: string): Promise<CommitteeMemberWithPerson> {
    const record = await this.prisma.committeeMember.findFirst({
      where: { id: committeeMemberId, tenantId, isActive: true },
      include: MEMBER_INCLUDE
    });
    if (!record) {
      throw new NotFoundException("Committee post not found");
    }
    return record;
  }

  private async assertMemberInTenant(tenantId: string, memberId: string): Promise<void> {
    const member = await this.prisma.member.findFirst({ where: { id: memberId, tenantId, isActive: true } });
    if (!member) {
      throw new NotFoundException("Member not found");
    }
  }

  async createMember(
    actor: ActorContext,
    dto: CreateCommitteeMemberDto,
    context: RequestContext
  ): Promise<CommitteeMemberWithPerson> {
    await this.assertMemberInTenant(actor.tenantId, dto.memberId);
    const record = await this.prisma.committeeMember.create({
      data: { ...toCommitteeMemberData(dto), tenantId: actor.tenantId } as Prisma.CommitteeMemberUncheckedCreateInput,
      include: MEMBER_INCLUDE
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "committee.member.create",
      targetType: "CommitteeMember",
      targetId: record.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return record;
  }

  async updateMember(
    actor: ActorContext,
    committeeMemberId: string,
    dto: UpdateCommitteeMemberDto,
    context: RequestContext
  ): Promise<CommitteeMemberWithPerson> {
    await this.findMemberOrThrow(actor.tenantId, committeeMemberId);
    if (dto.memberId) await this.assertMemberInTenant(actor.tenantId, dto.memberId);
    const record = await this.prisma.committeeMember.update({
      where: { id: committeeMemberId },
      data: toCommitteeMemberData(dto),
      include: MEMBER_INCLUDE
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "committee.member.update",
      targetType: "CommitteeMember",
      targetId: record.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return record;
  }

  async removeMember(actor: ActorContext, committeeMemberId: string, context: RequestContext): Promise<void> {
    await this.findMemberOrThrow(actor.tenantId, committeeMemberId);
    await this.prisma.committeeMember.update({ where: { id: committeeMemberId }, data: { isActive: false } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "committee.member.delete",
      targetType: "CommitteeMember",
      targetId: committeeMemberId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  // --- Meetings ---------------------------------------------------------

  async listMeetings(tenantId: string, page: number, pageSize: number): Promise<{ meetings: CommitteeMeetingWithDetail[]; total: number }> {
    const where = { tenantId };
    const [meetings, total] = await Promise.all([
      this.prisma.committeeMeeting.findMany({
        where,
        orderBy: { meetingDate: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: MEETING_INCLUDE
      }),
      this.prisma.committeeMeeting.count({ where })
    ]);
    return { meetings, total };
  }

  async findMeetingOrThrow(tenantId: string, meetingId: string): Promise<CommitteeMeetingWithDetail> {
    const meeting = await this.prisma.committeeMeeting.findFirst({
      where: { id: meetingId, tenantId },
      include: MEETING_INCLUDE
    });
    if (!meeting) {
      throw new NotFoundException("Meeting not found");
    }
    return meeting;
  }

  private async assertAttendeesInTenant(tenantId: string, attendeeIds: string[] | undefined): Promise<void> {
    if (!attendeeIds || attendeeIds.length === 0) return;
    const count = await this.prisma.committeeMember.count({ where: { id: { in: attendeeIds }, tenantId } });
    if (count !== attendeeIds.length) {
      throw new NotFoundException("One or more attendees were not found");
    }
  }

  async createMeeting(
    actor: ActorContext,
    dto: CreateCommitteeMeetingDto,
    context: RequestContext
  ): Promise<CommitteeMeetingWithDetail> {
    await this.assertAttendeesInTenant(actor.tenantId, dto.attendeeIds);
    const meeting = await this.prisma.committeeMeeting.create({
      data: {
        ...toMeetingData(dto),
        tenantId: actor.tenantId,
        ...(dto.attendeeIds ? { attendees: { connect: dto.attendeeIds.map((id) => ({ id })) } } : {})
      } as Prisma.CommitteeMeetingUncheckedCreateInput,
      include: MEETING_INCLUDE
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "committee.meeting.create",
      targetType: "CommitteeMeeting",
      targetId: meeting.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return meeting;
  }

  async updateMeeting(
    actor: ActorContext,
    meetingId: string,
    dto: UpdateCommitteeMeetingDto,
    context: RequestContext
  ): Promise<CommitteeMeetingWithDetail> {
    await this.findMeetingOrThrow(actor.tenantId, meetingId);
    await this.assertAttendeesInTenant(actor.tenantId, dto.attendeeIds);
    const meeting = await this.prisma.committeeMeeting.update({
      where: { id: meetingId },
      data: {
        ...toMeetingData(dto),
        ...(dto.attendeeIds ? { attendees: { set: dto.attendeeIds.map((id) => ({ id })) } } : {})
      },
      include: MEETING_INCLUDE
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "committee.meeting.update",
      targetType: "CommitteeMeeting",
      targetId: meeting.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return meeting;
  }

  async removeMeeting(actor: ActorContext, meetingId: string, context: RequestContext): Promise<void> {
    await this.findMeetingOrThrow(actor.tenantId, meetingId);
    await this.prisma.committeeMeeting.delete({ where: { id: meetingId } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "committee.meeting.delete",
      targetType: "CommitteeMeeting",
      targetId: meetingId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }

  // --- Decisions ----------------------------------------------------------

  async createDecision(
    actor: ActorContext,
    meetingId: string,
    dto: CreateCommitteeDecisionDto,
    context: RequestContext
  ): Promise<CommitteeDecision> {
    await this.findMeetingOrThrow(actor.tenantId, meetingId);
    const decision = await this.prisma.committeeDecision.create({
      data: { ...dto, meetingId, tenantId: actor.tenantId }
    });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "committee.decision.create",
      targetType: "CommitteeDecision",
      targetId: decision.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return decision;
  }

  private async findDecisionOrThrow(tenantId: string, decisionId: string): Promise<CommitteeDecision> {
    const decision = await this.prisma.committeeDecision.findFirst({ where: { id: decisionId, tenantId } });
    if (!decision) {
      throw new NotFoundException("Decision not found");
    }
    return decision;
  }

  async updateDecision(
    actor: ActorContext,
    decisionId: string,
    dto: UpdateCommitteeDecisionDto,
    context: RequestContext
  ): Promise<CommitteeDecision> {
    await this.findDecisionOrThrow(actor.tenantId, decisionId);
    const decision = await this.prisma.committeeDecision.update({ where: { id: decisionId }, data: dto });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "committee.decision.update",
      targetType: "CommitteeDecision",
      targetId: decision.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
    return decision;
  }

  async removeDecision(actor: ActorContext, decisionId: string, context: RequestContext): Promise<void> {
    await this.findDecisionOrThrow(actor.tenantId, decisionId);
    await this.prisma.committeeDecision.delete({ where: { id: decisionId } });
    await this.audit.record({
      actorUserId: actor.userId,
      tenantId: actor.tenantId,
      action: "committee.decision.delete",
      targetType: "CommitteeDecision",
      targetId: decisionId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });
  }
}
