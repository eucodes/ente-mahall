import "server-only";
import { serverApiGet } from "./server-api";

export interface NotificationSettings {
  notifyOnNewServiceRequest: boolean;
  notifyOnNewDue: boolean;
  eventReminderDaysBefore: number | null;
  smsEnabled: boolean;
  smsProviderName: string | null;
  smsSenderId: string | null;
}

/** Null means the API rejected this (not a member of the tenant, or lacks settings.view). */
export async function getNotificationSettings(slug: string): Promise<NotificationSettings | null> {
  const { status, body } = await serverApiGet<{ settings: NotificationSettings }>(`/tenants/${encodeURIComponent(slug)}/settings/notifications`);
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.settings;
}
