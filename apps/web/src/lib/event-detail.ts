import "server-only";
import { serverApiGet } from "./server-api";
import type { MahalleEvent } from "./business-resources";

export async function getEvent(slug: string, eventId: string): Promise<MahalleEvent | null> {
  const { status, body } = await serverApiGet<{ event: MahalleEvent }>(`/tenants/${encodeURIComponent(slug)}/events/${eventId}`);
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.event;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  memberId: string | null;
  participantName: string;
  participantPhone: string | null;
  attended: boolean;
  createdAt: string;
}

export interface EventVoucher {
  id: string;
  voucherNumber: string | null;
  type: "RECEIPT" | "PAYMENT";
  date: string;
  amount: string;
  partyName: string | null;
  account: { id: string; name: string };
}

export interface EventFinanceSummary {
  vouchers: EventVoucher[];
  totalIncome: string;
  totalExpense: string;
  net: string;
}

export async function getEventRegistrations(slug: string, eventId: string): Promise<EventRegistration[] | null> {
  const { status, body } = await serverApiGet<{ registrations: EventRegistration[] }>(
    `/tenants/${encodeURIComponent(slug)}/events/${eventId}/registrations`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.registrations;
}

export async function getEventFinanceSummary(slug: string, eventId: string): Promise<EventFinanceSummary | null> {
  const { status, body } = await serverApiGet<EventFinanceSummary>(`/tenants/${encodeURIComponent(slug)}/events/${eventId}/finance-summary`);
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data;
}
