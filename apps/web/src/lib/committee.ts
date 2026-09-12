import "server-only";
import { serverApiGet } from "./server-api";

export type CommitteeMeetingStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

export interface CommitteePost {
  id: string;
  memberId: string;
  designation: string;
  displayOrder: number;
  termStart: string | null;
  termEnd: string | null;
  member: { id: string; fullName: string; phone: string | null };
}

export interface CommitteeDecision {
  id: string;
  meetingId: string;
  description: string;
  createdAt: string;
}

export interface CommitteeMeeting {
  id: string;
  title: string;
  meetingDate: string;
  location: string | null;
  agenda: string | null;
  minutes: string | null;
  status: CommitteeMeetingStatus;
  attendees: CommitteePost[];
  decisions: CommitteeDecision[];
}

/** Null means the API rejected this (not a member of the tenant, or lacks committee.view). */
export async function getCommitteePosts(slug: string): Promise<CommitteePost[] | null> {
  const { status, body } = await serverApiGet<{ members: CommitteePost[] }>(`/tenants/${encodeURIComponent(slug)}/committee/members`);
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.members;
}

export async function getCommitteeMeetings(
  slug: string,
  page: number,
  pageSize: number
): Promise<{ meetings: CommitteeMeeting[]; total: number } | null> {
  const { status, body } = await serverApiGet<{ meetings: CommitteeMeeting[]; meta: { total: number } }>(
    `/tenants/${encodeURIComponent(slug)}/committee/meetings?page=${page}&pageSize=${pageSize}`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return { meetings: body.data.meetings, total: body.data.meta.total };
}
