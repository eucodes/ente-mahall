import "server-only";
import { serverApiGet } from "./server-api";

export interface PlanSummary {
  id: string;
  key: string;
  name: string;
  description: string | null;
  priceMinor: number | null;
  currency: string;
  billingPeriod: string;
  userLimit: number | null;
  memberLimit: number | null;
  storageLimitMb: number | null;
  smsCredits: number | null;
  supportLevel: string | null;
  isActive: boolean;
  createdAt: string;
  featureIds: string[];
  subscriberCount: number;
}

export interface SubscriptionSummary {
  id: string;
  status: string;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  cancelledAt: string | null;
  createdAt: string;
  plan: { id: string; key: string; name: string };
}

export interface InvoiceSummary {
  id: string;
  amountMinor: number;
  currency: string;
  status: string;
  description: string | null;
  issuedAt: string | null;
  dueAt: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface PaymentSummary {
  id: string;
  amountMinor: number;
  currency: string;
  method: string;
  reference: string | null;
  invoiceId: string | null;
  recordedAt: string;
}

export async function getPlans(): Promise<PlanSummary[]> {
  const { status, body } = await serverApiGet<{ plans: PlanSummary[] }>("/platform/plans");
  if (status !== 200 || !body.success || !body.data) return [];
  return body.data.plans;
}

export async function getTenantSubscription(tenantId: string): Promise<SubscriptionSummary | null> {
  const { status, body } = await serverApiGet<{ subscription: SubscriptionSummary | null }>(
    `/platform/tenants/${encodeURIComponent(tenantId)}/billing/subscription`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.subscription;
}

export async function getTenantInvoices(tenantId: string): Promise<InvoiceSummary[]> {
  const { status, body } = await serverApiGet<{ invoices: InvoiceSummary[] }>(
    `/platform/tenants/${encodeURIComponent(tenantId)}/billing/invoices`
  );
  if (status !== 200 || !body.success || !body.data) return [];
  return body.data.invoices;
}

export async function getTenantPayments(tenantId: string): Promise<PaymentSummary[]> {
  const { status, body } = await serverApiGet<{ payments: PaymentSummary[] }>(
    `/platform/tenants/${encodeURIComponent(tenantId)}/billing/payments`
  );
  if (status !== 200 || !body.success || !body.data) return [];
  return body.data.payments;
}
