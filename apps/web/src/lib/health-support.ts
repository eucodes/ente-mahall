import { serverApiGet } from "./server-api";
import type { Member, SupportStatus } from "./members";
import type { Family } from "./business-resources";

export interface HealthSupportStats {
  totalConditions: number;
  hasDisability: number;
  hasChronicIllness: number;
  requiresRegularMedication: number;
  requiresAssistance: number;
  activeWelfareMembers: number;
  activeWelfareFamilies: number;
  topChronicConditions: { condition: string; count: number }[];
  topAssistanceTypes: { type: string; count: number }[];
  supportCategoryDistribution: { category: string; count: number }[];
}

export interface HealthMembersQuery {
  page?: number;
  pageSize?: number;
  q?: string;
  hasDisability?: boolean;
  hasLongTermIllness?: boolean;
  requiresRegularMedication?: boolean;
  requiresAssistance?: boolean;
  requiresCommunitySupport?: boolean;
  supportStatus?: SupportStatus;
  condition?: string;
}

export interface HealthFamiliesQuery {
  page?: number;
  pageSize?: number;
  q?: string;
  supportStatus?: "ACTIVE" | "MONITORING" | "RESOLVED";
  supportCategory?: string;
}

export async function getHealthSupportStats(slug: string): Promise<HealthSupportStats | null> {
  const { status, body } = await serverApiGet<{ stats?: HealthSupportStats } & HealthSupportStats>(
    `/tenants/${encodeURIComponent(slug)}/health-support/stats`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.stats ?? (body.data as HealthSupportStats);
}

export async function getHealthSupportMembers(
  slug: string,
  query: HealthMembersQuery = {}
): Promise<{ members: Member[]; total: number } | null> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("pageSize", String(query.pageSize));
  if (query.q) params.set("q", query.q);
  if (query.hasDisability !== undefined) params.set("hasDisability", String(query.hasDisability));
  if (query.hasLongTermIllness !== undefined) params.set("hasLongTermIllness", String(query.hasLongTermIllness));
  if (query.requiresRegularMedication !== undefined)
    params.set("requiresRegularMedication", String(query.requiresRegularMedication));
  if (query.requiresAssistance !== undefined) params.set("requiresAssistance", String(query.requiresAssistance));
  if (query.requiresCommunitySupport !== undefined)
    params.set("requiresCommunitySupport", String(query.requiresCommunitySupport));
  if (query.supportStatus) params.set("supportStatus", query.supportStatus);
  if (query.condition) params.set("condition", query.condition);

  const { status, body } = await serverApiGet<{ members: Member[]; meta: { total: number } }>(
    `/tenants/${encodeURIComponent(slug)}/health-support/members?${params.toString()}`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return { members: body.data.members, total: body.data.meta.total };
}

export async function getHealthSupportFamilies(
  slug: string,
  query: HealthFamiliesQuery = {}
): Promise<{ families: Family[]; total: number } | null> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("pageSize", String(query.pageSize));
  if (query.q) params.set("q", query.q);
  if (query.supportStatus) params.set("supportStatus", query.supportStatus);
  if (query.supportCategory) params.set("supportCategory", query.supportCategory);

  const { status, body } = await serverApiGet<{ families: Family[]; meta: { total: number } }>(
    `/tenants/${encodeURIComponent(slug)}/health-support/families?${params.toString()}`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return { families: body.data.families, total: body.data.meta.total };
}
