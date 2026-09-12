import "server-only";
import { serverApiGet } from "./server-api";
import type { Division } from "./structure";

export interface House {
  id: string;
  displayNumber: string;
  address: string | null;
  divisionId: string | null;
  division: Division | null;
}

/** Null means the API rejected this (not a member, or lacks houses.view). */
export async function getHouses(slug: string, page: number, pageSize: number): Promise<{ items: House[]; total: number } | null> {
  const { status, body } = await serverApiGet<{ houses: House[]; meta: { total: number } }>(
    `/tenants/${encodeURIComponent(slug)}/houses?page=${page}&pageSize=${pageSize}`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return { items: body.data.houses, total: body.data.meta.total };
}
