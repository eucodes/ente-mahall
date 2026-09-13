import "server-only";
import { serverApiGet } from "./server-api";

export interface Family {
  id: string;
  familyNumber: string | null;
  name: string;
  address: string | null;
  phone: string | null;
  notes: string | null;
  isActive: boolean;
  houseId: string | null;
  house: { id: string; displayNumber: string; divisionId: string | null } | null;
  createdAt: string;
  updatedAt: string;
}

export interface FamilySummary {
  totalFamilies: number;
  activeFamilies: number;
  inactiveFamilies: number;
  unassignedFamilies: number;
}

export interface FamilyListFilters {
  houseId?: string;
  divisionId?: string;
  q?: string;
  status?: "active" | "inactive" | "all";
  sortBy?: "familyNumber" | "name" | "createdAt" | "updatedAt";
  sortDir?: "asc" | "desc";
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

export async function getFamilies(
  slug: string,
  page: number,
  pageSize: number,
  filters: FamilyListFilters = {}
): Promise<{ items: Family[]; total: number } | null> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (filters.houseId) params.set("houseId", filters.houseId);
  if (filters.divisionId) params.set("divisionId", filters.divisionId);
  if (filters.q) params.set("q", filters.q);
  if (filters.status) params.set("status", filters.status);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDir) params.set("sortDir", filters.sortDir);

  const { status, body } = await serverApiGet<{ families: Family[]; meta: { total: number } }>(
    `/tenants/${encodeURIComponent(slug)}/families?${params.toString()}`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return { items: body.data.families, total: body.data.meta.total };
}

export async function getFamilySummary(slug: string): Promise<FamilySummary | null> {
  const { status, body } = await serverApiGet<FamilySummary>(`/tenants/${encodeURIComponent(slug)}/families/summary`);
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data;
}

export async function getFamily(slug: string, familyId: string): Promise<Family | null> {
  const { status, body } = await serverApiGet<{ family: Family }>(`/tenants/${encodeURIComponent(slug)}/families/${familyId}`);
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.family;
}

export const getEvents = (slug: string, page: number, pageSize: number) =>
  fetchPaged<MahalleEvent>(slug, "events", "events", page, pageSize);

export const getAnnouncements = (slug: string, page: number, pageSize: number) =>
  fetchPaged<Announcement>(slug, "announcements", "announcements", page, pageSize);

export const getPrograms = (slug: string, page: number, pageSize: number) =>
  fetchPaged<Program>(slug, "programs", "programs", page, pageSize);
