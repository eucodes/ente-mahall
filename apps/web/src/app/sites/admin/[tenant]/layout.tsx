import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AppShell,
  Avatar,
  Badge,
  Building,
  Calendar,
  Droplet,
  FileText,
  Megaphone,
  HeartHandshake,
  Home,
  Landmark,
  ListChecks,
  MapPin,
  Plane,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Users,
  Wallet,
  type NavItem
} from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { LogoutButton } from "@/features/auth/logout-button";

export default async function TenantAdminLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const membership = await getMyTenantMembership(slug);
  if (!membership) {
    redirect("/");
  }

  const base = `/${slug}`;
  const navItems: NavItem[] = [
    { label: "Overview", href: base, icon: <Home />, exact: true },
    {
      label: "People",
      icon: <UsersRound />,
      children: [
        { label: "Members", href: `${base}/members`, icon: <Users /> },
        { label: "Families", href: `${base}/families`, icon: <UsersRound /> },
        { label: "Houses", href: `${base}/houses`, icon: <MapPin /> }
      ]
    },
    {
      label: "Reports",
      icon: <HeartHandshake />,
      children: [
        { label: "All reports", href: `${base}/reports`, icon: <FileText />, exact: true },
        { label: "Yatheem register", href: `${base}/reports/yatheem`, icon: <HeartHandshake /> },
        { label: "Expatriate register", href: `${base}/reports/expatriate`, icon: <Plane /> },
        { label: "Blood groups", href: `${base}/reports/blood-groups`, icon: <Droplet /> }
      ]
    },
    {
      label: "Committee",
      icon: <Landmark />,
      children: [
        { label: "Roster", href: `${base}/committee`, icon: <Landmark />, exact: true },
        { label: "Meetings", href: `${base}/committee/meetings`, icon: <Calendar /> }
      ]
    },
    {
      label: "Registers",
      icon: <FileText />,
      children: [
        { label: "Death", href: `${base}/registers/death`, icon: <FileText /> },
        { label: "Marriage", href: `${base}/registers/marriage`, icon: <FileText /> },
        { label: "Divorce", href: `${base}/registers/divorce`, icon: <FileText /> },
        { label: "Mahallu release", href: `${base}/registers/release`, icon: <FileText /> },
        { label: "Grave", href: `${base}/registers/grave`, icon: <MapPin /> },
        { label: "Madrassa / Dars", href: `${base}/registers/madrassa`, icon: <UsersRound /> },
        { label: "Property", href: `${base}/registers/property`, icon: <Landmark /> }
      ]
    },
    {
      label: "Finance",
      icon: <Wallet />,
      children: [
        { label: "Overview", href: `${base}/finance`, icon: <Wallet />, exact: true },
        { label: "Vouchers", href: `${base}/finance/vouchers`, icon: <FileText /> },
        { label: "Dues", href: `${base}/finance/dues`, icon: <FileText /> },
        { label: "Salary", href: `${base}/finance/salary`, icon: <FileText /> },
        { label: "Cash book", href: `${base}/finance/cash-book`, icon: <FileText /> }
      ]
    },
    { label: "Services", href: `${base}/services`, icon: <FileText /> },
    { label: "Events", href: `${base}/events`, icon: <Calendar /> },
    { label: "Announcements", href: `${base}/announcements`, icon: <Megaphone /> },
    { label: "Programs", href: `${base}/programs`, icon: <ListChecks /> },
    {
      label: "Settings",
      icon: <Building />,
      children: [
        { label: "Structure", href: `${base}/settings/structure`, icon: <MapPin /> },
        { label: "Notifications", href: `${base}/settings/notifications`, icon: <Megaphone /> },
        { label: "Users & Roles", href: `${base}/admins`, icon: <ShieldCheck /> }
      ]
    }
  ];

  return (
    <AppShell
      navItems={navItems}
      brand={
        <Link href={base} className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="truncate font-semibold tracking-tight">{membership.tenant.name}</span>
        </Link>
      }
      topbarTitle={
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Admin</Badge>
          <span className="truncate text-sm font-medium text-muted-foreground">{membership.tenant.name}</span>
        </div>
      }
      topbarActions={
        <Link href="/" className="text-xs font-medium text-muted-foreground hover:text-foreground">
          &larr; All Mahalles
        </Link>
      }
      sidebarFooter={
        <div className="space-y-1 border-t border-border pt-4">
          <div className="flex items-center gap-3 rounded-xl px-1 py-1">
            <Avatar name={user.fullName} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-tight">{user.fullName}</p>
              <p className="truncate text-xs leading-tight text-muted-foreground">{membership.role.name}</p>
            </div>
          </div>
          <LogoutButton
            redirectTo="/login"
            variant="ghost"
            showIcon
            className="w-full justify-start px-1 text-muted-foreground hover:text-foreground"
          />
        </div>
      }
    >
      {children}
    </AppShell>
  );
}
