import "server-only";
import { serverApiGet } from "./server-api";

export interface Structure {
  hasDivisions: boolean;
  divisionTerm: string | null;
  houseNumberingMethod: string | null;
  houseNumberPrefix: string | null;
  houseNumberSuffix: string | null;
  houseNumberStartAt: number | null;
  houseNumberMinDigits: number | null;
  houseNumberAllowManual: boolean;
  hasFamilyStatuses?: boolean;
  familyStatusTerm?: string | null;
}

export interface Division {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  order: number;
  isActive: boolean;
}

export interface FamilyStatus {
  id: string;
  name: string;
  code: string | null;
  color: string | null;
  description: string | null;
  order: number;
  isActive: boolean;
}

export interface StructureSummary {
  totalDivisions: number;
  totalHouses: number;
  activeHouses: number;
  inactiveHouses: number;
  unassignedHouses: number;
}

/** Null means the API rejected this (not a member, or lacks structure.view). */
export async function getStructure(slug: string): Promise<{ structure: Structure; divisions: Division[]; familyStatuses?: FamilyStatus[] } | null> {
  const { status, body } = await serverApiGet<{ structure: Structure; divisions: Division[]; familyStatuses?: FamilyStatus[] }>(
    `/tenants/${encodeURIComponent(slug)}/structure`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data;
}

export async function getStructureSummary(slug: string): Promise<StructureSummary | null> {
  const { status, body } = await serverApiGet<StructureSummary>(`/tenants/${encodeURIComponent(slug)}/structure/summary`);
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data;
}
