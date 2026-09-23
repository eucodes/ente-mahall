import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  Avatar,
  Badge,
  Bell,
  ChevronRight,
  Clock,
  Layers,
  PageHeader,
  SettingsRow,
  SettingsSection,
  ShieldCheck,
  Wallet,
  cn
} from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getStructure } from "@/lib/structure";
import { getMyTenantFeatures, type TenantFeatureStatus } from "@/lib/features";

function groupByCategory(features: TenantFeatureStatus[]): [string, TenantFeatureStatus[]][] {
  const groups = new Map<string, TenantFeatureStatus[]>();
  for (const feature of features) {
    const key = feature.category ?? "Other";
    groups.set(key, [...(groups.get(key) ?? []), feature]);
  }
  return [...groups.entries()];
}

function ValueText({ value }: { value: string | null | undefined }) {
  return value ? (
    <p className="text-sm font-medium text-foreground">{value}</p>
  ) : (
    <p className="text-sm text-muted-foreground/70">Not set</p>
  );
}

export default async function TenantAdminSettingsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const [structureData, features] = await Promise.all([
    getStructure(slug).catch(() => null),
    getMyTenantFeatures(slug).catch(() => [])
  ]);
  const tenant = membership.tenant;
  const structure = structureData?.structure ?? null;
  const enabledCount = features.filter((f) => f.effective).length;

  const configureLinks: { href: string; icon: ReactNode; title: string; description: string }[] = [
    {
      href: `/${slug}/settings/structure`,
      icon: <Layers />,
      title: "Mahallu structure",
      description: "Wards, house numbering, and family categories"
    },
    {
      href: `/${slug}/settings/finance`,
      icon: <Wallet />,
      title: "Finance",
      description: "Receipt numbering, bank accounts, and collection heads"
    },
    {
      href: `/${slug}/settings/notifications`,
      icon: <Bell />,
      title: "Notifications",
      description: "In-app alerts and SMS configuration"
    },
    {
      href: `/${slug}/settings/admins`,
      icon: <ShieldCheck />,
      title: "Users & roles",
      description: "Who can access this Mahallu, and what they can do"
    },
    {
      href: `/${slug}/settings/activity`,
      icon: <Clock />,
      title: "Activity log",
      description: "Every change made across this Mahallu's records"
    }
  ];

  return (
    <div className="max-w-5xl space-y-6">
      <PageHeader title="General" description="Your Mahallu's identity, your account, and the modules switched on for you." />

      <SettingsSection
        title="Mahallu"
        description="How this Mahallu is identified across the admin panel and its public site."
        footerHint="These details are set during onboarding and can't be edited from here yet."
      >
        <SettingsRow label="Name">
          <ValueText value={tenant.name} />
        </SettingsRow>
        <SettingsRow label="Masjid">
          <ValueText value={tenant.masjidName} />
        </SettingsRow>
        <SettingsRow label="Workspace ID" description="Part of this Mahallu's admin and public web addresses.">
          <code className="rounded-md border border-border/70 bg-muted/50 px-2 py-0.5 font-mono text-xs text-foreground">{tenant.slug}</code>
        </SettingsRow>
        <SettingsRow label="Country">
          <ValueText value={tenant.country} />
        </SettingsRow>
        <SettingsRow label="Organization" description="Whether families and houses are grouped into wards or areas.">
          {structure ? (
            <div className="flex items-center gap-3">
              <Badge variant={structure.hasDivisions ? "success" : "secondary"}>
                {structure.hasDivisions ? `Split into ${(structure.divisionTerm || "division").toLowerCase()}s` : "Single area"}
              </Badge>
              <Link href={`/${slug}/settings/structure`} className="text-xs font-semibold text-primary hover:underline">
                Change
              </Link>
            </div>
          ) : (
            <ValueText value={null} />
          )}
        </SettingsRow>
      </SettingsSection>

      <SettingsSection
        title="Your account"
        description="The account you're signed in with."
        footerHint="Account details can't be edited from here yet."
      >
        <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar name={user.fullName} size="lg" className="h-14 w-14 text-lg" />
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-foreground">{user.fullName}</p>
              <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Role
            <Badge>{membership.role.name}</Badge>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Modules"
        description={
          features.length > 0
            ? `${enabledCount} of ${features.length} modules are switched on for this Mahallu.`
            : "The feature modules available to this Mahallu."
        }
        actions={
          <Link href={`/${slug}/billing`} className="text-sm font-semibold text-primary hover:underline">
            View plan
          </Link>
        }
        footerHint="Modules are controlled by your plan and the platform administrators."
        flush
      >
        {features.length === 0 ? (
          <p className="px-6 py-5 text-sm text-muted-foreground">No modules are configured for this Mahallu.</p>
        ) : (
          <div className="divide-y divide-border/60">
            {groupByCategory(features).map(([category, items]) => (
              <div key={category} className="px-6 py-5">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{category}</p>
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((feature) => (
                    <li
                      key={feature.featureId}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border/60 px-3.5 py-2.5"
                    >
                      <span className={cn("truncate text-sm font-medium", feature.effective ? "text-foreground" : "text-muted-foreground")}>
                        {feature.name}
                      </span>
                      <span
                        className={cn(
                          "inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold",
                          feature.effective ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"
                        )}
                      >
                        <span
                          className={cn("h-1.5 w-1.5 rounded-full", feature.effective ? "bg-emerald-500" : "bg-muted-foreground/40")}
                          aria-hidden
                        />
                        {feature.effective ? "On" : "Off"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </SettingsSection>

      <SettingsSection title="More settings" description="Everything else you can configure for this Mahallu." flush>
        <ul className="divide-y divide-border/60">
          {configureLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/40">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary [&>svg]:h-5 [&>svg]:w-5">
                  {link.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-foreground">{link.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{link.description}</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      </SettingsSection>
    </div>
  );
}
