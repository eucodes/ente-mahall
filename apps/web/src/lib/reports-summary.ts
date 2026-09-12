import "server-only";
import { serverApiGet } from "./server-api";

interface Meta {
  total: number;
}

async function totalOf(slug: string, path: string): Promise<number | null> {
  const { status, body } = await serverApiGet<{ meta: Meta }>(`/tenants/${encodeURIComponent(slug)}/${path}`);
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.meta.total;
}

export interface ReportsSummary {
  members: number | null;
  families: number | null;
  yatheem: number | null;
  expatriate: number | null;
  committeeMeetings: number | null;
  deathRecords: number | null;
  marriageRecords: number | null;
  dues: number | null;
  pendingServiceRequests: number | null;
  upcomingEvents: number | null;
}

export async function getReportsSummary(slug: string): Promise<ReportsSummary> {
  const [
    members,
    families,
    yatheem,
    expatriate,
    committeeMeetings,
    deathRecords,
    marriageRecords,
    dues,
    pendingServiceRequests,
    upcomingEvents
  ] = await Promise.all([
    totalOf(slug, "members?pageSize=1"),
    totalOf(slug, "families?pageSize=1"),
    totalOf(slug, "members?pageSize=1&isYatheem=true"),
    totalOf(slug, "members?pageSize=1&isExpatriate=true"),
    totalOf(slug, "committee/meetings?pageSize=1"),
    totalOf(slug, "registers/death?pageSize=1"),
    totalOf(slug, "registers/marriage?pageSize=1"),
    totalOf(slug, "finance/dues?pageSize=1"),
    totalOf(slug, "services?pageSize=1&status=SUBMITTED"),
    totalOf(slug, "events?pageSize=1")
  ]);

  return {
    members,
    families,
    yatheem,
    expatriate,
    committeeMeetings,
    deathRecords,
    marriageRecords,
    dues,
    pendingServiceRequests,
    upcomingEvents
  };
}
