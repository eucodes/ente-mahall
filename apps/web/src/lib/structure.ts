import "server-only";
import { serverApiGet } from "./server-api";

export interface Structure {
  hasDivisions: boolean;
  divisionTerm: string | null;
  houseNumberingMethod: string | null;
}

export interface Division {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  order: number;
}

/** Null means the API rejected this (not a member, or lacks structure.view). */
export async function getStructure(slug: string): Promise<{ structure: Structure; divisions: Division[] } | null> {
  const { status, body } = await serverApiGet<{ structure: Structure; divisions: Division[] }>(
    `/tenants/${encodeURIComponent(slug)}/structure`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data;
}
