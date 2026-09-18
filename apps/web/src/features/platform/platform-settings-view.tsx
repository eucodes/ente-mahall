"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormField,
  Input,
  Select,
  Switch,
  useToast,
  Building,
  CheckCircle2,
  Clock,
  Database,
  Globe,
  HardDrive,
  Save,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { PlatformSettings, SystemStatus } from "@/lib/platform";

interface PlatformSettingsViewProps {
  settings: PlatformSettings;
  systemStatus: SystemStatus | null;
}

export function PlatformSettingsView({ settings: initialSettings, systemStatus }: PlatformSettingsViewProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [form, setForm] = useState({
    platformName: initialSettings.platformName,
    rootDomain: initialSettings.rootDomain,
    supportEmail: initialSettings.supportEmail,
    defaultCurrency: initialSettings.defaultCurrency,
    timezone: initialSettings.timezone,
    sessionTimeoutMinutes: initialSettings.sessionTimeoutMinutes,
    require2FAForSuperadmins: initialSettings.require2FAForSuperadmins,
    maxConcurrentSessions: initialSettings.maxConcurrentSessions,
    autoApproveTenants: initialSettings.autoApproveTenants,
    defaultTrialDays: initialSettings.defaultTrialDays,
    allowPublicRegistration: initialSettings.allowPublicRegistration,
    auditRetentionDays: initialSettings.auditRetentionDays,
    logIpAddresses: initialSettings.logIpAddresses,
    logUserAgents: initialSettings.logUserAgents
  });

  const [isSaving, setIsSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await apiClient.patch("/platform/settings", form);
      toast({
        title: "Platform settings saved",
        description: "Global control plane configuration has been updated.",
        variant: "success"
      });
      router.refresh();
    } catch (err) {
      toast({
        title: "Save failed",
        description: err instanceof ApiError ? err.message : "Failed to update settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure global platform identity, security rules, fleet defaults, and diagnostics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="submit" isLoading={isSaving} className="gap-1.5 shadow-sm">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Section 1: General Platform Identity */}
          <Card className="shadow-sm">
            <CardHeader className="border-b border-border bg-muted/20 pb-4">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <CardTitle className="text-base font-semibold">General Platform Identity</CardTitle>
              </div>
              <p className="text-xs text-muted-foreground">
                Base branding and canonical domains used across multi-tenant subdomains.
              </p>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Platform Name" htmlFor="set-platformName" required>
                  <Input
                    id="set-platformName"
                    value={form.platformName}
                    onChange={(e) => setForm({ ...form, platformName: e.target.value })}
                  />
                </FormField>

                <FormField label="Root Domain" htmlFor="set-rootDomain" required hint="e.g. mahalle.test">
                  <Input
                    id="set-rootDomain"
                    value={form.rootDomain}
                    onChange={(e) => setForm({ ...form, rootDomain: e.target.value })}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField label="Platform Support Email" htmlFor="set-supportEmail" required>
                  <Input
                    id="set-supportEmail"
                    type="email"
                    value={form.supportEmail}
                    onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                  />
                </FormField>

                <FormField label="Default Currency" htmlFor="set-currency">
                  <Select
                    id="set-currency"
                    value={form.defaultCurrency}
                    onChange={(e) => setForm({ ...form, defaultCurrency: e.target.value })}
                  >
                    <option value="INR">INR (₹) - Indian Rupee</option>
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="AED">AED (د.إ) - UAE Dirham</option>
                    <option value="SAR">SAR (﷼) - Saudi Riyal</option>
                  </Select>
                </FormField>

                <FormField label="Platform Timezone" htmlFor="set-timezone">
                  <Select
                    id="set-timezone"
                    value={form.timezone}
                    onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                    <option value="Asia/Riyadh">Asia/Riyadh (AST)</option>
                    <option value="UTC">UTC</option>
                  </Select>
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Security & Authentication Policy */}
          <Card className="shadow-sm">
            <CardHeader className="border-b border-border bg-muted/20 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <CardTitle className="text-base font-semibold">Security & Session Policies</CardTitle>
              </div>
              <p className="text-xs text-muted-foreground">
                Authentication guardrails, idle timeouts, and token lifetime constraints.
              </p>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Session Idle Timeout (Minutes)" htmlFor="set-timeout" hint="Default idle expiration">
                  <Select
                    id="set-timeout"
                    value={String(form.sessionTimeoutMinutes)}
                    onChange={(e) => setForm({ ...form, sessionTimeoutMinutes: Number(e.target.value) })}
                  >
                    <option value="15">15 minutes (High Security)</option>
                    <option value="30">30 minutes (Standard)</option>
                    <option value="60">60 minutes (1 hour)</option>
                    <option value="240">4 hours</option>
                    <option value="1440">24 hours (1 day)</option>
                  </Select>
                </FormField>

                <FormField label="Max Concurrent Device Sessions" htmlFor="set-maxSessions">
                  <Select
                    id="set-maxSessions"
                    value={String(form.maxConcurrentSessions)}
                    onChange={(e) => setForm({ ...form, maxConcurrentSessions: Number(e.target.value) })}
                  >
                    <option value="3">3 active sessions</option>
                    <option value="5">5 active sessions (Recommended)</option>
                    <option value="10">10 active sessions</option>
                    <option value="0">Unlimited</option>
                  </Select>
                </FormField>
              </div>

              <div className="divide-y divide-border rounded-xl border border-border">
                <div className="flex items-center justify-between p-3.5">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-foreground">Enforce Two-Factor Authentication (2FA) for Superadmins</p>
                    <p className="text-[11px] text-muted-foreground">Mandate OTP/Authenticator verification on control plane login.</p>
                  </div>
                  <Switch
                    checked={form.require2FAForSuperadmins}
                    onCheckedChange={(checked) => setForm({ ...form, require2FAForSuperadmins: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Fleet & Onboarding Defaults */}
          <Card className="shadow-sm">
            <CardHeader className="border-b border-border bg-muted/20 pb-4">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-purple-600" />
                <CardTitle className="text-base font-semibold">Fleet & Onboarding Defaults</CardTitle>
              </div>
              <p className="text-xs text-muted-foreground">
                Settings applied automatically when new Mahalles are registered.
              </p>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Default Trial Duration (Days)" htmlFor="set-trialDays">
                  <Input
                    id="set-trialDays"
                    type="number"
                    min="0"
                    max="90"
                    value={form.defaultTrialDays}
                    onChange={(e) => setForm({ ...form, defaultTrialDays: Number(e.target.value) })}
                  />
                </FormField>

                <FormField label="Audit Stream Retention (Days)" htmlFor="set-auditDays">
                  <Select
                    id="set-auditDays"
                    value={String(form.auditRetentionDays)}
                    onChange={(e) => setForm({ ...form, auditRetentionDays: Number(e.target.value) })}
                  >
                    <option value="90">90 Days</option>
                    <option value="180">180 Days (6 Months)</option>
                    <option value="365">365 Days (1 Year)</option>
                    <option value="730">730 Days (2 Years)</option>
                  </Select>
                </FormField>
              </div>

              <div className="divide-y divide-border rounded-xl border border-border">
                <div className="flex items-center justify-between p-3.5">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-foreground">Auto-approve New Mahalles</p>
                    <p className="text-[11px] text-muted-foreground">Activate newly registered Mahalles immediately without manual approval.</p>
                  </div>
                  <Switch
                    checked={form.autoApproveTenants}
                    onCheckedChange={(checked) => setForm({ ...form, autoApproveTenants: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3.5">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-foreground">Public Self-Registration</p>
                    <p className="text-[11px] text-muted-foreground">Allow public visitors on marketing site to register new Mahalle accounts.</p>
                  </div>
                  <Switch
                    checked={form.allowPublicRegistration}
                    onCheckedChange={(checked) => setForm({ ...form, allowPublicRegistration: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 4: Live Telemetry & Platform Diagnostics */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="border-b border-border bg-muted/20 pb-4">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-blue-600" />
                <CardTitle className="text-base font-semibold">Live System Telemetry</CardTitle>
              </div>
              <p className="text-xs text-muted-foreground">
                Runtime diagnostics and core infrastructure health.
              </p>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-muted">
                <div className="flex items-center gap-2.5">
                  <Database className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">Database</p>
                    <p className="text-[10px] text-muted-foreground">
                      {systemStatus?.database.provider || "PostgreSQL"}
                    </p>
                  </div>
                </div>
                <Badge variant={systemStatus?.database.connected ? "success" : "destructive"} className="gap-1 text-[10px]">
                  <CheckCircle2 className="h-3 w-3" />
                  {systemStatus?.database.connected ? "Connected" : "Disconnected"}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-muted">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">Platform Engine</p>
                    <p className="text-[10px] text-muted-foreground">Version {systemStatus?.environment.platformVersion || "2.4.0"}</p>
                  </div>
                </div>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {systemStatus?.environment.nodeEnv || "development"}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-muted">
                <div className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">Server Uptime</p>
                    <p className="text-[10px] text-muted-foreground">Continuous operation</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-foreground font-semibold">
                  {Math.floor((systemStatus?.environment.uptimeSeconds || 0) / 3600)}h{" "}
                  {Math.floor(((systemStatus?.environment.uptimeSeconds || 0) % 3600) / 60)}m
                </span>
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Fleet Summary
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-muted/20 border border-border">
                    <p className="text-muted-foreground text-[10px]">Active Mahalles</p>
                    <p className="text-base font-bold text-foreground">{systemStatus?.counts.activeTenants ?? 0}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/20 border border-border">
                    <p className="text-muted-foreground text-[10px]">Active Sessions</p>
                    <p className="text-base font-bold text-foreground">{systemStatus?.counts.activeSessions ?? 0}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="border-b border-border bg-muted/20 pb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-600" />
                <CardTitle className="text-base font-semibold">Compliance & Audit</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Capture Client IP</span>
                <span className="font-semibold text-foreground">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Log User-Agent</span>
                <span className="font-semibold text-foreground">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Audit Stream</span>
                <span className="font-semibold text-emerald-600">Append-Only / Immutable</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
