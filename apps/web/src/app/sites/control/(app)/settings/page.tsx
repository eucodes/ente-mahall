import { getPlatformSettings, getSystemStatus } from "@/lib/platform";
import { PlatformSettingsView } from "@/features/platform/platform-settings-view";

export default async function PlatformSettingsPage() {
  const [settings, systemStatus] = await Promise.all([
    getPlatformSettings(),
    getSystemStatus()
  ]);

  const fallbackSettings = {
    platformName: "MahalleOS",
    rootDomain: "mahalle.test",
    supportEmail: "support@mahalle.test",
    defaultCurrency: "INR",
    timezone: "Asia/Kolkata",
    locale: "en-IN",
    sessionTimeoutMinutes: 30,
    require2FAForSuperadmins: false,
    maxConcurrentSessions: 5,
    autoApproveTenants: true,
    defaultTrialDays: 14,
    allowPublicRegistration: true,
    auditRetentionDays: 365,
    logIpAddresses: true,
    logUserAgents: true
  };

  return (
    <PlatformSettingsView
      settings={settings || fallbackSettings}
      systemStatus={systemStatus}
    />
  );
}
