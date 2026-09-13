import "server-only";
import { serverApiGet } from "./server-api";

export interface FeatureSummary {
  id: string;
  key: string;
  name: string;
  description: string | null;
  category: string | null;
  isEnabledGlobally: boolean;
  createdAt: string;
  overrideCount: number;
}

export interface TenantFeatureStatus {
  featureId: string;
  key: string;
  name: string;
  category: string | null;
  isEnabledGlobally: boolean;
  override: boolean | null;
  effective: boolean;
}

export type TenantFeatureWithStatus = TenantFeatureStatus;

export async function getFeatures(): Promise<FeatureSummary[]> {
  const { status, body } = await serverApiGet<{ features: FeatureSummary[] }>("/platform/features");
  if (status !== 200 || !body.success || !body.data) return [];
  return body.data.features;
}

export async function getTenantFeatures(tenantId: string): Promise<TenantFeatureStatus[]> {
  const { status, body } = await serverApiGet<{ features: TenantFeatureStatus[] }>(
    `/platform/tenants/${encodeURIComponent(tenantId)}/features`
  );
  if (status !== 200 || !body.success || !body.data) return [];
  return body.data.features;
}

export async function getMyTenantFeatures(slug: string): Promise<TenantFeatureStatus[]> {
  const { status, body } = await serverApiGet<{ features: TenantFeatureStatus[] }>(
    `/tenants/${encodeURIComponent(slug)}/features`
  );
  if (status !== 200 || !body.success || !body.data) return [];
  return body.data.features;
}
