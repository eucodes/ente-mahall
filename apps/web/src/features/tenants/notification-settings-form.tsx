"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, SettingsRow, SettingsSection, Switch, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { NotificationSettings } from "@/lib/notifications";
import { UnsavedChangesBar } from "@/features/settings/unsaved-changes-bar";

interface FormValues {
  notifyOnNewServiceRequest: boolean;
  notifyOnNewDue: boolean;
  eventReminderDaysBefore: string;
  smsEnabled: boolean;
  smsProviderName: string;
  smsSenderId: string;
}

function toFormValues(settings: NotificationSettings): FormValues {
  return {
    notifyOnNewServiceRequest: settings.notifyOnNewServiceRequest,
    notifyOnNewDue: settings.notifyOnNewDue,
    eventReminderDaysBefore: settings.eventReminderDaysBefore?.toString() ?? "",
    smsEnabled: settings.smsEnabled,
    smsProviderName: settings.smsProviderName ?? "",
    smsSenderId: settings.smsSenderId ?? ""
  };
}

export function NotificationSettingsForm({ slug, settings }: { slug: string; settings: NotificationSettings }) {
  const router = useRouter();
  const { toast } = useToast();
  // After a save, router.refresh() hands back settings equal to what's in the form, so the bar clears itself.
  const initial = useMemo(() => toFormValues(settings), [settings]);
  const [values, setValues] = useState<FormValues>(initial);
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = (Object.keys(initial) as (keyof FormValues)[]).some((key) => initial[key] !== values[key]);
  const reminderDays = Number(values.eventReminderDaysBefore);
  const reminderInvalid =
    values.eventReminderDaysBefore !== "" && !(Number.isInteger(reminderDays) && reminderDays >= 0 && reminderDays <= 30);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await apiClient.patch(`/tenants/${slug}/settings/notifications`, {
        notifyOnNewServiceRequest: values.notifyOnNewServiceRequest,
        notifyOnNewDue: values.notifyOnNewDue,
        eventReminderDaysBefore: values.eventReminderDaysBefore ? reminderDays : undefined,
        smsEnabled: values.smsEnabled,
        smsProviderName: values.smsProviderName || undefined,
        smsSenderId: values.smsSenderId || undefined
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
    <div className="max-w-5xl space-y-6">
      <SettingsSection title="In-app alerts" description="What the admin dashboard surfaces as new activity for your team.">
        <SettingsRow label="New service requests" description="Alert when a member submits a service request.">
          <Switch
            checked={values.notifyOnNewServiceRequest}
            onCheckedChange={(checked) => update("notifyOnNewServiceRequest", checked)}
            aria-label="Alert on new service requests"
          />
        </SettingsRow>
        <SettingsRow label="New dues" description="Alert when a due is assigned to a member.">
          <Switch
            checked={values.notifyOnNewDue}
            onCheckedChange={(checked) => update("notifyOnNewDue", checked)}
            aria-label="Alert on new dues"
          />
        </SettingsRow>
        <SettingsRow
          label="Event reminders"
          description="How many days before an event to show a reminder. Leave blank to turn reminders off."
          htmlFor="reminder-days"
        >
          <div className="flex items-center gap-2">
            <Input
              id="reminder-days"
              type="number"
              min={0}
              max={30}
              inputMode="numeric"
              className="w-24"
              invalid={reminderInvalid}
              value={values.eventReminderDaysBefore}
              onChange={(e) => update("eventReminderDaysBefore", e.target.value)}
            />
            <span className="text-sm text-muted-foreground">days before</span>
          </div>
          {reminderInvalid && <p className="mt-1.5 text-xs text-destructive">Enter a whole number from 0 to 30.</p>}
        </SettingsRow>
      </SettingsSection>

      <SettingsSection
        title="SMS"
        description="This deployment isn't connected to an SMS provider yet. These settings record your choice, so everything is ready once a provider is connected."
      >
        <SettingsRow label="SMS notifications" description="Send notifications by SMS once a provider is connected.">
          <Switch checked={values.smsEnabled} onCheckedChange={(checked) => update("smsEnabled", checked)} aria-label="Enable SMS notifications" />
        </SettingsRow>
        <SettingsRow label="Provider" description="The SMS gateway your Mahallu has chosen, e.g. MSG91 or Twilio." htmlFor="sms-provider">
          <Input
            id="sms-provider"
            className="md:max-w-xs"
            placeholder="e.g. MSG91"
            value={values.smsProviderName}
            onChange={(e) => update("smsProviderName", e.target.value)}
          />
        </SettingsRow>
        <SettingsRow
          label="Sender ID"
          description="The name recipients see. In India this must match your DLT-registered sender ID."
          htmlFor="sms-sender"
        >
          <Input
            id="sms-sender"
            className="font-mono md:max-w-xs"
            placeholder="e.g. MAHALL"
            value={values.smsSenderId}
            onChange={(e) => update("smsSenderId", e.target.value)}
          />
        </SettingsRow>
      </SettingsSection>

      <UnsavedChangesBar
        visible={isDirty}
        saving={isSaving}
        disabled={reminderInvalid}
        onDiscard={() => setValues(initial)}
        onSave={() => void handleSave()}
      />
    </div>
  );
}
