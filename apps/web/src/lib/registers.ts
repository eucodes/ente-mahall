import "server-only";
import { serverApiGet } from "./server-api";
import type { RegisterRecord } from "@/features/tenants/register-types";

/** Null means the API rejected this (not a member of the tenant, or lacks the relevant registers.*.view permission). */
export async function getRegisterRecords(
  slug: string,
  resource: string,
  page: number,
  pageSize: number
): Promise<{ records: RegisterRecord[]; total: number } | null> {
  const { status, body } = await serverApiGet<{ records: RegisterRecord[]; meta: { total: number } }>(
    `/tenants/${encodeURIComponent(slug)}/${resource}?page=${page}&pageSize=${pageSize}`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return { records: body.data.records, total: body.data.meta.total };
}
