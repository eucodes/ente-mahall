"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Checkbox, FormField, Input, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { NotificationSettings } from "@/lib/notifications";

export function NotificationSettingsForm({ slug, settings }: { slug: string; settings: NotificationSettings }) {
  const router = useRouter();
  const { toast } = useToast();
  const [notifyOnNewServiceRequest, setNotifyOnNewServiceRequest] = useState(settings.notifyOnNewServiceRequest);
  const [notifyOnNewDue, setNotifyOnNewDue] = useState(settings.notifyOnNewDue);
  const [eventReminderDaysBefore, setEventReminderDaysBefore] = useState(settings.eventReminderDaysBefore?.toString() ?? "");
  const [smsEnabled, setSmsEnabled] = useState(settings.smsEnabled);
  const [smsProviderName, setSmsProviderName] = useState(settings.smsProviderName ?? "");
  const [smsSenderId, setSmsSenderId] = useState(settings.smsSenderId ?? "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNotifyOnNewServiceRequest(settings.notifyOnNewServiceRequest);
    setNotifyOnNewDue(settings.notifyOnNewDue);
    setEventReminderDaysBefore(settings.eventReminderDaysBefore?.toString() ?? "");
    setSmsEnabled(settings.smsEnabled);
    setSmsProviderName(settings.smsProviderName ?? "");
    setSmsSenderId(settings.smsSenderId ?? "");
  }, [settings]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    try {
      await apiClient.patch(`/tenants/${slug}/settings/notifications`, {
        notifyOnNewServiceRequest,
        notifyOnNewDue,
        eventReminderDaysBefore: eventReminderDaysBefore ? Number(eventReminderDaysBefore) : undefined,
        smsEnabled,
        smsProviderName: smsProviderName || undefined,
        smsSenderId: smsSenderId || undefined
      });
      toast({ title: "Notification settings saved", variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't save settings.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>In-app notifications</CardTitle>
          <CardDescription>What the admin dashboard should surface as new activity.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={notifyOnNewServiceRequest} onChange={(e) => setNotifyOnNewServiceRequest(e.target.checked)} />
            New service request submitted
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={notifyOnNewDue} onChange={(e) => setNotifyOnNewDue(e.target.checked)} />
            New due assigned to a member
          </label>
          <FormField label="Remind before an event" htmlFor="reminder-days" hint="Days before an event to surface a reminder — leave blank to disable">
            <Input
              id="reminder-days"
              type="number"
              min={0}
              max={30}
              className="max-w-[120px]"
              value={eventReminderDaysBefore}
              onChange={(e) => setEventReminderDaysBefore(e.target.value)}
            />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SMS</CardTitle>
          <CardDescription>
            Configuration only — this deployment isn&apos;t connected to an SMS provider yet. Choosing a provider (and, in India,
            registering DLT templates) is a decision for your Mahallu to make; these fields just record the intent so it&apos;s ready
            once a provider is wired up.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={smsEnabled} onChange={(e) => setSmsEnabled(e.target.checked)} />
            Enable SMS notifications (once connected)
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Provider name" htmlFor="sms-provider" hint="e.g. MSG91, Twilio">
              <Input id="sms-provider" value={smsProviderName} onChange={(e) => setSmsProviderName(e.target.value)} />
            </FormField>
            <FormField label="Sender ID" htmlFor="sms-sender">
              <Input id="sms-sender" value={smsSenderId} onChange={(e) => setSmsSenderId(e.target.value)} />
            </FormField>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" isLoading={isSaving}>
        Save
      </Button>
    </form>
  );
}
