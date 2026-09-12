import { redirect } from "next/navigation";
import { Card, CardContent, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getNotificationSettings } from "@/lib/notifications";
import { NotificationSettingsForm } from "@/features/tenants/notification-settings-form";

export default async function NotificationSettingsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const settings = await getNotificationSettings(slug);

  return (
    <>
      <PageHeader title="Notifications" description="What triggers a notification, and this Mahallu's SMS configuration." />

      {settings === null ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to view settings"
              description={`Your role (${membership.role.name}) doesn't include settings.view.`}
            />
          </CardContent>
        </Card>
      ) : (
        <NotificationSettingsForm slug={slug} settings={settings} />
      )}
    </>
  );
}
