import "server-only";
import { serverApiGet } from "./server-api";

export type ServiceRequestStatus = "SUBMITTED" | "IN_REVIEW" | "APPROVED" | "REJECTED" | "COMPLETED";

export interface ServiceRequest {
  id: string;
  requestType: string;
  memberId: string | null;
  member: { id: string; fullName: string } | null;
  requesterName: string;
  requesterPhone: string | null;
  subject: string;
  description: string | null;
  eventId: string | null;
  event: { id: string; title: string } | null;
  registerType: string | null;
  registerRecordId: string | null;
  status: ServiceRequestStatus;
  resolutionNotes: string | null;
  createdAt: string;
}

/** Null means the API rejected this (not a member of the tenant, or lacks services.view). */
export async function getServiceRequests(
  slug: string,
  page: number,
  pageSize: number
): Promise<{ requests: ServiceRequest[]; total: number } | null> {
  const { status, body } = await serverApiGet<{ requests: ServiceRequest[]; meta: { total: number } }>(
    `/tenants/${encodeURIComponent(slug)}/services?page=${page}&pageSize=${pageSize}`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return { requests: body.data.requests, total: body.data.meta.total };
}
