import "server-only";
import { serverApiGet } from "./server-api";
import type { Division } from "./structure";

export interface House {
  id: string;
  displayNumber: string;
  name: string | null;
  address: string | null;
  notes: string | null;
  isActive: boolean;
  divisionId: string | null;
  division: Division | null;
  createdAt: string;
  updatedAt: string;
}

export interface HouseSummary {
  totalHouses: number;
  activeHouses: number;
  inactiveHouses: number;
  unassignedHouses: number;
}

export interface HouseListFilters {
  divisionId?: string;
  q?: string;
  status?: "active" | "inactive" | "all";
  sortBy?: "displayNumber" | "name" | "createdAt" | "updatedAt";
  sortDir?: "asc" | "desc";
}

/** Null means the API rejected this (not a member, or lacks houses.view). */
export async function getHouses(
  slug: string,
  page: number,
  pageSize: number,
  filters: HouseListFilters = {}
): Promise<{ items: House[]; total: number } | null> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (filters.divisionId) params.set("divisionId", filters.divisionId);
  if (filters.q) params.set("q", filters.q);
  if (filters.status) params.set("status", filters.status);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDir) params.set("sortDir", filters.sortDir);

  const { status, body } = await serverApiGet<{ houses: House[]; meta: { total: number } }>(
    `/tenants/${encodeURIComponent(slug)}/houses?${params.toString()}`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return { items: body.data.houses, total: body.data.meta.total };
}

export async function getHouse(slug: string, houseId: string): Promise<House | null> {
  const { status, body } = await serverApiGet<{ house: House }>(`/tenants/${encodeURIComponent(slug)}/houses/${houseId}`);
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.house;
}

export async function getHouseSummary(slug: string): Promise<HouseSummary | null> {
  const { status, body } = await serverApiGet<HouseSummary>(`/tenants/${encodeURIComponent(slug)}/houses/summary`);
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data;
}

export async function getSuggestedHouseNumber(slug: string): Promise<{ suggested: string; currentHighest: string | null } | null> {
  const { status, body } = await serverApiGet<{ suggested: string; currentHighest: string | null }>(
    `/tenants/${encodeURIComponent(slug)}/houses/next-number`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data;
}
