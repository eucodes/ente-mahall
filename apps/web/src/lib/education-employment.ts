import { serverApiGet } from "./server-api";
import type { EducationLevel, EmploymentStatus, Member } from "./members";

export interface EducationEmploymentStats {
  totalMembers: number;
  employed: number;
  selfEmployedOrBusiness: number;
  jobSeekers: number;
  students: number;
  higherEducation: number;
  expatriates: number;
  topSkills: { skill: string; count: number }[];
  educationDistribution: { level: string; count: number }[];
  employmentDistribution: { status: string; count: number }[];
}

export interface EducationEmploymentQuery {
  page?: number;
  pageSize?: number;
  q?: string;
  educationLevel?: EducationLevel;
  employmentStatus?: EmploymentStatus;
  isJobSeeker?: boolean;
  skill?: string;
}

export async function getEducationEmploymentStats(slug: string): Promise<EducationEmploymentStats | null> {
  const { status, body } = await serverApiGet<{ stats?: EducationEmploymentStats } & EducationEmploymentStats>(
    `/tenants/${encodeURIComponent(slug)}/education-employment/stats`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.stats ?? (body.data as EducationEmploymentStats);
}

export async function getEducationEmploymentMembers(
  slug: string,
  query: EducationEmploymentQuery = {}
): Promise<{ members: Member[]; total: number } | null> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("pageSize", String(query.pageSize));
  if (query.q) params.set("q", query.q);
  if (query.educationLevel) params.set("educationLevel", query.educationLevel);
  if (query.employmentStatus) params.set("employmentStatus", query.employmentStatus);
  if (query.isJobSeeker !== undefined) params.set("isJobSeeker", String(query.isJobSeeker));
  if (query.skill) params.set("skill", query.skill);

  const { status, body } = await serverApiGet<{ members: Member[]; meta: { total: number } }>(
    `/tenants/${encodeURIComponent(slug)}/education-employment/members?${params.toString()}`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return { members: body.data.members, total: body.data.meta.total };
}
