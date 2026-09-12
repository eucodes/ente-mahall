import "server-only";
import { serverApiGet } from "./server-api";

export interface Family {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  houseId: string | null;
  house: { id: string; displayNumber: string } | null;
}

export interface MahalleEvent {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startsAt: string;
  endsAt: string | null;
}

export type AnnouncementAudience = "ALL" | "COMMITTEE_ONLY" | "DIVISION";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  publishedAt: string | null;
  audience: AnnouncementAudience;
  targetDivisionId: string | null;
}

export interface Program {
  id: string;
  name: string;
  description: string | null;
}

/** Null means the API rejected this (not a member, or lacks the relevant `.view` permission). */
async function fetchPaged<T>(
  slug: string,
  resource: string,
  listField: string,
  page: number,
  pageSize: number
): Promise<{ items: T[]; total: number } | null> {
  const { status, body } = await serverApiGet<Record<string, unknown>>(
    `/tenants/${encodeURIComponent(slug)}/${resource}?page=${page}&pageSize=${pageSize}`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  const data = body.data as Record<string, unknown>;
  return { items: data[listField] as T[], total: (data.meta as { total: number }).total };
}

export const getFamilies = (slug: string, page: number, pageSize: number) =>
  fetchPaged<Family>(slug, "families", "families", page, pageSize);

export const getEvents = (slug: string, page: number, pageSize: number) =>
  fetchPaged<MahalleEvent>(slug, "events", "events", page, pageSize);

export const getAnnouncements = (slug: string, page: number, pageSize: number) =>
  fetchPaged<Announcement>(slug, "announcements", "announcements", page, pageSize);

export const getPrograms = (slug: string, page: number, pageSize: number) =>
  fetchPaged<Program>(slug, "programs", "programs", page, pageSize);
