"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Badge,
  Building,
  Button,
  Calendar,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Clock,
  CreditCard,
  FileText,
  Home,
  Landmark,
  LayoutGrid,
  MapPin,
  Pencil,
  Phone,
  ScrollText,
  Settings,
  ShieldCheck,
  StatCard,
  Users,
  cn
} from "@mahalle/ui";
import { ROOT_DOMAIN } from "@/lib/env";
import type {
  AuditLogEntry,
  PlatformTenant,
  TenantRoleWithPermissions
} from "@/lib/platform";
import type { TenantFeatureWithStatus } from "@/lib/features";
import type { InvoiceSummary, PaymentSummary, PlanSummary, SubscriptionSummary } from "@/lib/billing";
import { TenantStatusActions } from "./tenant-status-actions";
import { EditTenantDialog } from "./edit-tenant-dialog";
import { TenantFeaturesEditor } from "./tenant-features-editor";
import { TenantSubscriptionEditor } from "./tenant-subscription-editor";
import { InvoicesPanel } from "./invoices-panel";
import { PaymentsPanel } from "./payments-panel";
import { TenantOperationsViewer } from "./tenant-operations-viewer";

type TabKey = "overview" | "operations" | "features" | "billing" | "audit";

interface TenantCommandCenterProps {
  tenant: PlatformTenant;
  roles?: TenantRoleWithPermissions[] | null;
  tenantFeatures: TenantFeatureWithStatus[];
  plans: PlanSummary[];
  subscription: SubscriptionSummary | null;
  invoices: InvoiceSummary[];
  payments: PaymentSummary[];
  auditLogs: AuditLogEntry[];
  actorName: string;
}

export function TenantCommandCenter({
  tenant,
  tenantFeatures,
  plans,
  subscription,
  invoices,
  payments,
  auditLogs,
  actorName
}: TenantCommandCenterProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const tenantPortalUrl = `http://${tenant.slug}.${ROOT_DOMAIN}`;
  const tenantAdminUrl = `http://admin.${ROOT_DOMAIN}/${tenant.slug}`;

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Overview & Profile", icon: <Home className="h-3.5 w-3.5" /> },
    { key: "operations", label: "Mahall Admin Operations", icon: <LayoutGrid className="h-3.5 w-3.5" /> },
    { key: "features", label: "Feature Flags", icon: <Settings className="h-3.5 w-3.5" /> },
    { key: "billing", label: "Plans & Billing", icon: <CreditCard className="h-3.5 w-3.5" /> },
    { key: "audit", label: "Audit Stream", icon: <ScrollText className="h-3.5 w-3.5" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/tenants"
          className="text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
        >
          &larr; Back to Fleet Directory
        </Link>
        <span className="text-[11px] text-muted-foreground font-mono">
          ID: {tenant.id}
        </span>
      </div>

      {/* Mahalle Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 min-w-0">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/30 text-xl font-black text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              {tenant.name.slice(0, 2).toUpperCase()}
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-foreground truncate">
                  {tenant.name}
                </h1>
                <Badge
                  variant={tenant.isActive ? "success" : "outline"}
                  className="text-[10px] gap-1 shrink-0"
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      tenant.isActive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
                    }`}
                  />
                  {tenant.isActive ? "Active Fleet" : "Suspended"}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-mono">
                <span className="text-primary font-semibold">{tenant.slug}.{ROOT_DOMAIN}</span>
                {tenant.district && (
                  <>
                    <span>·</span>
                    <span className="font-sans">{tenant.place ? `${tenant.place}, ` : ""}{tenant.district}</span>
                  </>
                )}
                {tenant.contactPhone && (
                  <>
                    <span>·</span>
                    <span className="font-sans">{tenant.contactPhone}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditDialogOpen(true)}
              className="gap-1.5 text-xs"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>Edit Profile</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(tenantPortalUrl, "_blank")}
              className="gap-1.5 text-xs"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>Public Portal</span>
            </Button>

            <Button
              size="sm"
              variant="primary"
              onClick={() => window.open(tenantAdminUrl, "_blank")}
              className="gap-1.5 text-xs font-bold shadow-xs"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>Launch Admin Console</span>
            </Button>

            <TenantStatusActions
              tenantId={tenant.id}
              slug={tenant.slug}
              isActive={tenant.isActive}
              afterDeleteHref="/tenants"
            />
          </div>
        </div>

        {/* Telemetry quick counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border/60">
          <div>
            <p className="text-[11px] text-muted-foreground font-medium">Registered Members</p>
            <p className="text-lg font-bold text-foreground mt-0.5">{tenant.memberCount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground font-medium">Households / Families</p>
            <p className="text-lg font-bold text-foreground mt-0.5">{tenant.familyCount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground font-medium">Administrative Seats</p>
            <p className="text-lg font-bold text-foreground mt-0.5">{tenant.adminCount}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground font-medium">Commission Date</p>
            <p className="text-lg font-bold text-foreground mt-0.5">
              {new Date(tenant.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-border/80 pb-px overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-b-2 cursor-pointer whitespace-nowrap",
              activeTab === tab.key
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & PROFILE */}
      {activeTab === "overview" && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Card 1: Core Mahalle & Description */}
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader className="flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-bold">Mahalle Profile</CardTitle>
                <CardDescription className="text-xs">Identity &amp; Official Communications</CardDescription>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setEditDialogOpen(true)} className="h-7 text-xs">
                Edit
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div>
                <p className="text-muted-foreground text-[11px]">Jurisdiction Description</p>
                <p className="mt-0.5 font-medium text-foreground">
                  {tenant.description || "No official description provided."}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/60">
                <div>
                  <p className="text-muted-foreground text-[11px]">Contact Email</p>
                  <p className="font-semibold mt-0.5 text-foreground">{tenant.contactEmail ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px]">Contact Phone</p>
                  <p className="font-semibold mt-0.5 text-foreground">{tenant.contactPhone ?? "—"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground text-[11px]">Website</p>
                  <p className="font-semibold mt-0.5 text-foreground font-mono">{tenant.website ?? "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Central Masjid */}
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader className="flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-bold">Central Masjid &amp; Religious Leadership</CardTitle>
                <CardDescription className="text-xs">Masjid institution profile</CardDescription>
              </div>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-muted-foreground text-[11px]">Masjid Name</p>
                  <p className="font-semibold mt-0.5 text-foreground">{tenant.masjidName || "Not configured"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px]">Masjid Phone</p>
                  <p className="font-semibold mt-0.5 text-foreground">{tenant.masjidPhone || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px]">Chief Imam</p>
                  <p className="font-semibold mt-0.5 text-foreground">{tenant.imamName || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px]">Khatheeb</p>
                  <p className="font-semibold mt-0.5 text-foreground">{tenant.khatheebName || "—"}</p>
                </div>
              </div>
              {tenant.masjidAddress && (
                <div className="pt-2 border-t border-border/60">
                  <p className="text-muted-foreground text-[11px]">Masjid Address</p>
                  <p className="mt-0.5 font-medium text-foreground">{tenant.masjidAddress}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 3: Location & Jurisdiction */}
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader className="flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-bold">Geographical Jurisdiction</CardTitle>
                <CardDescription className="text-xs">Administrative locality boundaries</CardDescription>
              </div>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-muted-foreground text-[11px]">State / Region</p>
                  <p className="font-semibold mt-0.5 text-foreground">{tenant.state || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px]">District</p>
                  <p className="font-semibold mt-0.5 text-foreground">{tenant.district || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px]">Place / Locality</p>
                  <p className="font-semibold mt-0.5 text-foreground">{tenant.place || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px]">PIN / Postal Code</p>
                  <p className="font-semibold mt-0.5 text-foreground font-mono">{tenant.pinCode || "—"}</p>
                </div>
              </div>
              {tenant.addressLine1 && (
                <div className="pt-2 border-t border-border/60">
                  <p className="text-muted-foreground text-[11px]">Address</p>
                  <p className="mt-0.5 font-medium text-foreground">{tenant.addressLine1}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 4: Primary Committee */}
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader className="flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-bold">Primary Committee Office Bearers</CardTitle>
                <CardDescription className="text-xs">Executive management leaders</CardDescription>
              </div>
              <Landmark className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-1 gap-2.5">
                <div className="flex items-center justify-between p-2 rounded-xl bg-muted/30">
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">President</span>
                    <p className="font-semibold text-foreground">{tenant.presidentName || "Unassigned"}</p>
                  </div>
                  <span className="text-muted-foreground font-mono text-[11px]">{tenant.presidentPhone || "—"}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-muted/30">
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">General Secretary</span>
                    <p className="font-semibold text-foreground">{tenant.secretaryName || "Unassigned"}</p>
                  </div>
                  <span className="text-muted-foreground font-mono text-[11px]">{tenant.secretaryPhone || "—"}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-muted/30">
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">Treasurer</span>
                    <p className="font-semibold text-foreground">{tenant.treasurerName || "Unassigned"}</p>
                  </div>
                  <span className="text-muted-foreground font-mono text-[11px]">{tenant.treasurerPhone || "—"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: MAHALL OPERATIONAL FUNCTIONS */}
      {activeTab === "operations" && (
        <TenantOperationsViewer tenantId={tenant.id} tenantSlug={tenant.slug} />
      )}

      {/* TAB 3: FEATURE FLAGS */}
      {activeTab === "features" && (
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Feature Flags &amp; Module Toggles</CardTitle>
            <CardDescription className="text-xs">
              Live functional toggles for this Mahalle. Disabling a feature immediately blocks access in both the API and the Admin UI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TenantFeaturesEditor tenantId={tenant.id} features={tenantFeatures} />
          </CardContent>
        </Card>
      )}

      {/* TAB 4: PLANS & BILLING */}
      {activeTab === "billing" && (
        <div className="space-y-6">
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Subscription &amp; Entitlement Plan</CardTitle>
              <CardDescription className="text-xs">
                Which plan this Mahalle is entitled to, and its billing status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TenantSubscriptionEditor
                tenantId={tenant.id}
                subscription={subscription}
                plans={plans}
              />
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <InvoicesPanel tenantId={tenant.id} invoices={invoices} />
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Offline &amp; Electronic Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentsPanel tenantId={tenant.id} payments={payments} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 6: AUDIT STREAM */}
      {activeTab === "audit" && (
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold">Audit Stream for {tenant.name}</CardTitle>
              <CardDescription className="text-xs">Recorded actions scoped to this Mahalle</CardDescription>
            </div>
            <Link
              href={`/audit-logs?tenantId=${tenant.id}`}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Open Full Audit Log &rarr;
            </Link>
          </CardHeader>
          <CardContent>
            {auditLogs.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No recorded audit logs for this Mahalle yet.
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {auditLogs.map((log) => (
                  <div key={log.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {log.action}
                        </Badge>
                        <span className="text-muted-foreground text-[11px]">
                          by <span className="text-foreground font-semibold">{log.actor?.email ?? "system"}</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        IP: {log.ipAddress ?? "unknown"}
                      </p>
                    </div>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Profile Modal */}
      <EditTenantDialog
        tenant={tenant}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  );
}
