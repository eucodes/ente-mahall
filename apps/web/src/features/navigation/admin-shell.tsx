"use client";

import React, { useState, useMemo, useRef, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Avatar,
  Badge,
  Building,
  Calendar,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Droplet,
  FileText,
  Globe,
  HeartHandshake,
  Home,
  Landmark,
  Layers,
  LayoutGrid,
  ListChecks,
  MapPin,
  Megaphone,
  Menu,
  PanelLeft,
  Plane,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  UsersRound,
  Users,
  Wallet,
  X,
  Bell,
  Clock,
  BarChart3,
  Eye,
  Palette,
  Receipt,
  Activity,
  SlidersHorizontal,
  Scale,
  BookOpen
} from "@mahalle/ui";
import { LogoutButton } from "@/features/auth/logout-button";
import { CommandPalette } from "@/features/search/command-palette";
import { TopbarQuickActions } from "@/features/navigation/topbar-quick-actions";
import { HijriDateBadge } from "@/features/navigation/hijri-date-badge";
import { NotificationBell } from "@/features/tenants/notification-bell";
import { IdleTimeoutProvider } from "@/features/auth/idle-timeout-provider";

export interface AdminShellProps {
  slug: string;
  tenantName: string;
  masjidName?: string;
  userName: string;
  userRole: string;
  hasDivisions: boolean;
  divisionTerm: string;
  disabledFeatures?: string[];
  notificationItems: Array<{ label: string; count: number; href: string }>;
  children: ReactNode;
}

export interface SubNavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  exact?: boolean;
  children?: SubNavItem[];
}

function isItemActive(pathname: string, item: SubNavItem): boolean {
  if (!item.href) return false;
  return item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function groupHasActiveChild(pathname: string, item: SubNavItem): boolean {
  if (isItemActive(pathname, item)) return true;
  return item.children?.some((child) => groupHasActiveChild(pathname, child)) ?? false;
}

interface BreadcrumbContextType {
  detailTitle: string | null;
  setDetailTitle: (title: string | null) => void;
}

export const BreadcrumbContext = React.createContext<BreadcrumbContextType>({
  detailTitle: null,
  setDetailTitle: () => { },
});

export function useBreadcrumb() {
  return React.useContext(BreadcrumbContext);
}

export function AdminShell({
  slug,
  tenantName,
  userName,
  userRole,
  hasDivisions,
  divisionTerm,
  disabledFeatures = [],
  notificationItems,
  children
}: AdminShellProps) {
  const pathname = usePathname();
  const [detailTitle, setDetailTitle] = useState<string | null>(null);
  const [navSearch, setNavSearch] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSubNavOpen, setMobileSubNavOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const userMenuRef = useRef<HTMLDivElement>(null);

  const base = `/${slug}`;

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  // Determine current active primary rail section
  const isHomeActive = pathname === base;
  const isWebsiteActive = pathname.startsWith(`${base}/website`);
  const isBillingActive = pathname.startsWith(`${base}/billing`);
  const isSettingsActive = pathname.startsWith(`${base}/settings`);
  const isMahallActive =
    !isHomeActive && !isWebsiteActive && !isBillingActive && !isSettingsActive;

  // Capitalize division term
  const divisionLabel = divisionTerm
    ? divisionTerm.charAt(0).toUpperCase() + divisionTerm.slice(1)
    : "Ward";

  // Toggle group expansion
  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => {
      const currentState =
        prev[label] !== undefined
          ? prev[label]
          : mahallNavItems.some(
            (item) => item.label === label && groupHasActiveChild(pathname, item)
          );
      return {
        ...prev,
        [label]: !currentState
      };
    });
  };

  const isFeatureDisabled = (key: string) => disabledFeatures?.includes(key) ?? false;

  // Define Sub-Navigation hierarchical items for Mahall
  const mahallNavItems: SubNavItem[] = useMemo(() => {
    const registerChildren = [
      !isFeatureDisabled("marriage-register") && {
        label: "Marriage (Nikah)",
        href: `${base}/registers/marriage`
      },
      !isFeatureDisabled("death-register") && {
        label: "Death (Mayyith)",
        href: `${base}/registers/death`
      },
      !isFeatureDisabled("divorce-register") && {
        label: "Divorce (Talaq)",
        href: `${base}/registers/divorce`
      },
      !isFeatureDisabled("release-register") && {
        label: "Mahallu Release (NOC)",
        href: `${base}/registers/release`
      },
      !isFeatureDisabled("grave-register") && {
        label: "Grave (Kabarsthan)",
        href: `${base}/registers/grave`
      },
      !isFeatureDisabled("madrassa") && {
        label: "Madrassa & Dars",
        href: `${base}/registers/madrassa`
      },
      !isFeatureDisabled("property-register") && {
        label: "Waqf & Property",
        href: `${base}/registers/property`
      }
    ].filter(Boolean) as SubNavItem[];

    const items: SubNavItem[] = [
      {
        label: "Dashboard",
        href: `${base}/overview`,
        icon: <LayoutGrid className="h-4 w-4" />,
        exact: true
      },
      {
        label: "People",
        icon: <Users className="h-4 w-4" />,
        children: [
          {
            label: "Members Directory",
            href: `${base}/members`
          },
          {
            label: "Families Registry",
            href: `${base}/families`
          },
          {
            label: "Houses Directory",
            href: `${base}/houses`
          },
          ...(hasDivisions
            ? [
              {
                label: `${divisionLabel}s`,
                href: `${base}/divisions`
              }
            ]
            : []),
          {
            label: "Education & Employment",
            href: `${base}/education-employment`
          },
          {
            label: "Health & Support",
            href: `${base}/health-support`
          }
        ]
      }
    ];
    // Finance: Operational entries for normal people (simple, clear, friendly)
    if (!isFeatureDisabled("finance")) {
      items.push({
        label: "Finance",
        icon: <Wallet className="h-4 w-4" />,
        children: [
          {
            label: "Overview",
            href: `${base}/finance`,
            exact: true
          },
          {
            label: "Collections",
            href: `${base}/finance/collections`
          },
          {
            label: "Payments",
            href: `${base}/finance/payments`
          },
          {
            label: "Finance Reports",
            href: `${base}/finance/reports`
          }
        ]
      });
    }

    // Accountant: Dedicated workspace managed by the Accountant
    if (!isFeatureDisabled("accounting")) {
      items.push({
        label: "Accountant",
        icon: <Scale className="h-4 w-4" />,
        children: [
          {
            label: "Manual Journals",
            href: `${base}/accountant/manual-journals`
          },
          {
            label: "Bulk Update",
            href: `${base}/accountant/bulk-update`
          },
          {
            label: "Chart of Accounts",
            href: `${base}/accountant/chart-of-accounts`
          },
          {
            label: "Reports",
            href: `${base}/accountant/reports`
          }
        ]
      });
    }
    if (registerChildren.length > 0) {
      items.push({
        label: "Registers",
        icon: <FileText className="h-4 w-4" />,
        children: registerChildren
      });
    }



    if (!isFeatureDisabled("committee")) {
      items.push({
        label: "Committee",
        icon: <Landmark className="h-4 w-4" />,
        children: [
          {
            label: "Office Bearers",
            href: `${base}/committee`,
            exact: true
          },
          {
            label: "Meetings & Minutes",
            href: `${base}/committee/meetings`
          }
        ]
      });
    }

    if (!isFeatureDisabled("services")) {
      items.push({
        label: "Services & Aid",
        href: `${base}/services`,
        icon: <HeartHandshake className="h-4 w-4" />
      });
    }

    if (!isFeatureDisabled("events")) {
      items.push({
        label: "Events & Calendar",
        href: `${base}/events`,
        icon: <Calendar className="h-4 w-4" />
      });
    }

    if (!isFeatureDisabled("announcements")) {
      items.push({
        label: "Announcements",
        href: `${base}/announcements`,
        icon: <Megaphone className="h-4 w-4" />
      });
    }

    if (!isFeatureDisabled("programs")) {
      items.push({
        label: "Programs & Milad",
        href: `${base}/programs`,
        icon: <ListChecks className="h-4 w-4" />
      });
    }

    items.push({
      label: "Reports",
      icon: <FileText className="h-4 w-4" />,
      children: [
        {
          label: "Executive Reports",
          href: `${base}/reports`,
          exact: true
        },
        {
          label: "Yatheem (Orphans)",
          href: `${base}/reports/yatheem`
        },
        {
          label: "Expatriates (Pravasi)",
          href: `${base}/reports/expatriate`
        },
        {
          label: "Blood Donor Registry",
          href: `${base}/reports/blood-groups`
        }
      ]
    });

    return items;
  }, [base, hasDivisions, divisionLabel, disabledFeatures]);

  // Sub-Navigation for Website (Overview, Analytics, Domains, Pages, Visibility, Theme)
  const websiteNavItems: SubNavItem[] = useMemo(
    () => [
      {
        label: "Overview",
        href: `${base}/website`,
        icon: <Globe className="h-4 w-4" />,
        exact: true
      },
      {
        label: "Analytics",
        href: `${base}/website/analytics`,
        icon: <BarChart3 className="h-4 w-4" />
      },
      {
        label: "Domains",
        href: `${base}/website/domains`,
        icon: <Globe className="h-4 w-4" />
      },
      {
        label: "Pages",
        href: `${base}/website/pages`,
        icon: <FileText className="h-4 w-4" />
      },
      {
        label: "Visibility",
        href: `${base}/website/visibility`,
        icon: <Eye className="h-4 w-4" />
      },
      {
        label: "Theme Customizer",
        href: `${base}/website/theme`,
        icon: <Palette className="h-4 w-4" />
      }
    ],
    [base]
  );

  // Sub-Navigation for Billing (Plan Details, Usage, Payments)
  const billingNavItems: SubNavItem[] = useMemo(
    () => [
      {
        label: "Plan Details",
        href: `${base}/billing`,
        icon: <SlidersHorizontal className="h-4 w-4" />,
        exact: true
      },
      {
        label: "Usage",
        href: `${base}/billing/usage`,
        icon: <Activity className="h-4 w-4" />
      },
      {
        label: "Payments",
        href: `${base}/billing/payments`,
        icon: <Receipt className="h-4 w-4" />
      }
    ],
    [base]
  );

  // Sub-Navigation for Settings
  const settingsNavItems: SubNavItem[] = useMemo(
    () => [
      {
        label: "General",
        href: `${base}/settings`,
        icon: <Settings className="h-4 w-4" />,
        exact: true
      },
      {
        label: "Mahallu structure",
        href: `${base}/settings/structure`,
        icon: <Layers className="h-4 w-4" />
      },
      {
        label: "Finance",
        href: `${base}/settings/finance`,
        icon: <Wallet className="h-4 w-4" />
      },
      {
        label: "Notifications",
        href: `${base}/settings/notifications`,
        icon: <Bell className="h-4 w-4" />
      },
      {
        label: "Users & roles",
        href: `${base}/settings/admins`,
        icon: <ShieldCheck className="h-4 w-4" />
      },
      {
        label: "Activity log",
        href: `${base}/settings/activity`,
        icon: <Clock className="h-4 w-4" />
      }
    ],
    [base]
  );

  // Active sub-navigation list based on active primary tab
  const rawSubNavItems = useMemo(() => {
    if (isMahallActive) return mahallNavItems;
    if (isWebsiteActive) return websiteNavItems;
    if (isBillingActive) return billingNavItems;
    if (isSettingsActive) return settingsNavItems;
    return [];
  }, [
    isMahallActive,
    isWebsiteActive,
    isBillingActive,
    isSettingsActive,
    mahallNavItems,
    websiteNavItems,
    billingNavItems,
    settingsNavItems
  ]);

  // Filter items by search query
  const filteredSubNavItems = useMemo(() => {
    if (!navSearch.trim()) return rawSubNavItems;
    const query = navSearch.toLowerCase().trim();

    return rawSubNavItems
      .map((item) => {
        if (item.children) {
          const matchingChildren = item.children.filter((child) =>
            child.label.toLowerCase().includes(query)
          );
          if (matchingChildren.length > 0) {
            return {
              ...item,
              children: matchingChildren
            };
          }
          if (item.label.toLowerCase().includes(query)) {
            return item;
          }
          return null;
        }
        if (item.label.toLowerCase().includes(query)) {
          return item;
        }
        return null;
      })
      .filter((item): item is SubNavItem => item !== null);
  }, [rawSubNavItems, navSearch]);

  const hasSubSidebar = !isHomeActive && rawSubNavItems.length > 0;
  const showSubSidebar = hasSubSidebar && !sidebarCollapsed;

  const renderNavElement = (item: SubNavItem, index: number) => {
    if (item.children && item.children.length > 0) {
      const isChildActive = groupHasActiveChild(pathname, item);
      const isGroupOpen =
        navSearch.trim() !== "" ||
        (expandedGroups[item.label] !== undefined
          ? expandedGroups[item.label]
          : isChildActive);

      return (
        <div key={`group-${item.label}-${index}`} className="space-y-0.5">
          <button
            type="button"
            onClick={() => toggleGroup(item.label)}
            className={`flex w-full items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${isChildActive
                ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold"
                : "text-foreground/80 hover:bg-muted/70 hover:text-foreground"
              }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={
                  isChildActive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground"
                }
              >
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {item.badge}
              <ChevronDown
                className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${isGroupOpen ? "rotate-180" : ""
                  }`}
              />
            </div>
          </button>

          {isGroupOpen && (
            <div className="ml-5 space-y-0.5 border-l border-border/70 pl-2.5 py-0.5 my-0.5 animate-in fade-in-50 duration-150">
              {item.children.map((child, childIdx) => {
                if (child.children && child.children.length > 0) {
                  return renderNavElement(child, childIdx);
                }
                const isChildCurrent = isItemActive(pathname, child);
                return (
                  <Link
                    key={childIdx}
                    href={child.href ?? "#"}
                    className={`block rounded-lg px-2.5 py-1.5 text-xs transition-colors ${isChildCurrent
                        ? "text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-500/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60 font-medium"
                      }`}
                  >
                    <span className="truncate">{child.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    const isActive = isItemActive(pathname, item);
    return (
      <Link
        key={`link-${item.href ?? item.label}-${index}`}
        href={item.href ?? "#"}
        className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${isActive
            ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold"
            : "text-foreground/80 hover:bg-muted/70 hover:text-foreground font-medium"
          }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={
              isActive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-muted-foreground"
            }
          >
            {item.icon}
          </span>
          <span className="truncate">{item.label}</span>
        </div>
        {item.badge}
      </Link>
    );
  };

const BREADCRUMB_ROUTE_LABELS: Record<string, string> = {
  // Main
  overview: "Dashboard",

  // People
  members: "Members Directory",
  families: "Families Registry",
  divisions: "Wards",
  houses: "Houses Directory",
  "education-employment": "Education & Employment",
  "health-support": "Health & Support",
  programs: "Programs & Relief",

  // Finance
  finance: "Finance",
  collections: "Collections",
  payments: "Payments",
  vouchers: "Payments",
  reports: "Reports",

  // Accountant
  accountant: "Accountant",
  accounting: "Accountant",
  "bulk-update": "Bulk Update",
  "chart-of-accounts": "Chart of Accounts",
  accounts: "Chart of Accounts",
  "manual-journals": "Manual Journals",
  journal: "Manual Journals",
  ledger: "General Ledger",
  "bank-book": "Bank Book",
  "cash-book": "Cash Book",
  "trial-balance": "Trial Balance",
  "receipt-payment": "Receipt & Payment",
  "income-expenditure": "Income & Expenditure",
  "balance-sheet": "Balance Sheet",
  "financial-year": "Financial Year",
  "taxes-legal": "Taxes & Legal Filings",

  // Registers
  registers: "Registers",
  marriage: "Marriage (Nikah)",
  death: "Death (Mayyith)",
  divorce: "Divorce (Talaq)",
  release: "Mahallu Release (NOC)",
  grave: "Grave (Kabarsthan)",
  madrassa: "Madrassa & Dars",
  property: "Waqf & Property",

  // Committee & Operations
  committee: "Committee",
  meetings: "Meetings & Minutes",
  services: "Service Requests",
  events: "Events & Notices",
  announcements: "Announcements",
  activity: "Activity Stream",

  // Reports
  "blood-groups": "Blood Directory",
  expatriate: "Pravasi / Expatriate",
  yatheem: "Yatheem & Widows",

  // Access & Admin
  admins: "Access Management",
  roles: "Roles & Permissions",

  // Website
  website: "Website",
  pages: "Pages",
  visibility: "Visibility",
  theme: "Theme Customizer",
  domains: "Domains",
  analytics: "Analytics",

  // Billing
  billing: "Billing & Plans",
  usage: "Usage",

  // Settings
  settings: "Settings",
  structure: "Mahallu Structure",
  notifications: "Notification Preferences"
};

const BREADCRUMB_PATH_OVERRIDES: Record<string, string> = {
  "/finance/reports": "Finance Reports",
  "/reports/blood-groups": "Blood Directory",
  "/reports/expatriate": "Pravasi / Expatriate",
  "/reports/yatheem": "Yatheem & Widows",
  "/billing/payments": "Payment History",
  "/settings/finance": "Finance Settings"
};

const UNLINKED_PATHS = new Set(["/registers"]);

function isLikelyId(segment: string): boolean {
  return segment.length >= 20 || /^[0-9a-f-]{8,}$/i.test(segment) || /^\d+$/.test(segment);
}

  // Dynamic breadcrumb generation matching reference model
  const subPath = pathname.replace(new RegExp(`^/${slug}`), "") || "/";

  const breadcrumbs = useMemo(() => {
    const items: Array<{ label: string; href?: string; isLast?: boolean }> = [];

    if (subPath === "/" || subPath === "") {
      return items;
    }

    const parts = subPath.split("/").filter(Boolean);

    parts.forEach((part, idx) => {
      const isLast = idx === parts.length - 1;
      const currentSubPath = "/" + parts.slice(0, idx + 1).join("/");
      const parentPart = idx > 0 ? parts[idx - 1] : "";

      let label: string;
      if (isLast && detailTitle) {
        label = detailTitle;
      } else if (BREADCRUMB_PATH_OVERRIDES[currentSubPath]) {
        label = BREADCRUMB_PATH_OVERRIDES[currentSubPath];
      } else if (part === "divisions") {
        label = `${divisionLabel}s`;
      } else if (isLikelyId(part)) {
        if (parentPart === "members") label = "Member Profile";
        else if (parentPart === "families") label = "Family Profile";
        else if (parentPart === "divisions") label = `${divisionLabel} Details`;
        else if (parentPart === "houses") label = "House Details";
        else if (parentPart === "events") label = "Event Details";
        else label = "Details";
      } else if (BREADCRUMB_ROUTE_LABELS[part]) {
        label = BREADCRUMB_ROUTE_LABELS[part];
      } else {
        label = part.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      }

      const canLink = !isLast && !UNLINKED_PATHS.has(currentSubPath);
      const href = canLink ? `/${slug}${currentSubPath}` : undefined;

      items.push({
        label,
        href,
        isLast
      });
    });

    if (items.length > 0) {
      items[items.length - 1].isLast = true;
    }

    return items;
  }, [subPath, slug, detailTitle, divisionLabel]);

  return (
    <IdleTimeoutProvider>
      <div className="flex h-screen w-full overflow-hidden bg-transparent text-foreground">
      {/* ------------------------------------------------------------- */}
      {/* UNIFIED SEAMLESS SIDEBAR       */}
      {/* ------------------------------------------------------------- */}
      <aside className="relative flex shrink-0 bg-transparent z-30 select-none">
        {/* Tier 1: Primary Icon Rail */}
        <div className="flex w-[68px] shrink-0 flex-col items-center justify-between py-5 px-11">
          {/* Top: App Icon & Navigation Items */}
          <div className="flex flex-col items-center gap-6">
            {/* App Icon */}
            <Link
              href={base}
              title="Ente Mahall"
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xs hover:opacity-90 transition-opacity"
            >
              <Sparkles className="h-5 w-5" />
            </Link>

            {/* Primary Rail Navigation Items */}
            <nav className="flex flex-col items-center gap-2">
              {/* 1. Home */}
              <Link
                href={base}
                title="Home"
                className={`group relative flex h-11 w-11 flex-col items-center justify-center rounded-2xl text-[10px] font-semibold transition-all ${isHomeActive
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <LayoutGrid className="h-5 w-5" />
                <span className="mt-0.5 text-[9px] leading-none">Home</span>
              </Link>

              {/* 2. Mahall */}
              <Link
                href={`${base}/overview`}
                title="Mahall Operations"
                className={`group relative flex h-11 w-11 flex-col items-center justify-center rounded-2xl text-[10px] font-semibold transition-all ${isMahallActive
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <Building className="h-5 w-5" />
                <span className="mt-0.5 text-[9px] leading-none">Mahall</span>
              </Link>

              {/* 3. Website */}
              <Link
                href={`${base}/website`}
                title="Public Website"
                className={`group relative flex h-11 w-11 flex-col items-center justify-center rounded-2xl text-[10px] font-semibold transition-all ${isWebsiteActive
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <Globe className="h-5 w-5" />
                <span className="mt-0.5 text-[9px] leading-none">Website</span>
              </Link>

              {/* 4. Billing */}
              <Link
                href={`${base}/billing`}
                title="Billing & Subscription"
                className={`group relative flex h-11 w-11 flex-col items-center justify-center rounded-2xl text-[10px] font-semibold transition-all ${isBillingActive
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <CreditCard className="h-5 w-5" />
                <span className="mt-0.5 text-[9px] leading-none">Billing</span>
              </Link>

              {/* 5. Settings */}
              <Link
                href={`${base}/settings`}
                title="Settings"
                className={`group relative flex h-11 w-11 flex-col items-center justify-center rounded-2xl text-[10px] font-semibold transition-all ${isSettingsActive
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <Settings className="h-5 w-5" />
                <span className="mt-0.5 text-[9px] leading-none">Settings</span>
              </Link>
            </nav>
          </div>

          {/* Bottom: Sidebar Toggle (Only enabled when sub-sidebar exists) */}
          {hasSubSidebar ? (
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
              title={sidebarCollapsed ? "Open sidebar" : "Collapse sidebar"}
            >
              <PanelLeft className="h-5 w-5" />
            </button>
          ) : (
            <div className="h-10 w-10" />
          )}
        </div>

        {/* Tier 2: Sub-Sidebar Column (Seamlessly adjacent on the same background) */}
        {showSubSidebar && (
          <div className="hidden md:flex w-[215px] shrink-0 flex-col py-4 pr-3">
            {/* Top: Application Logo & Name (matching image 1) */}
            <div className="h-10 flex items-center gap-2.5 px-2">
              <div className="min-w-0">
                <span className="block text-base font-extrabold tracking-tight text-foreground leading-none">
                  ENTE MAHALL
                </span>
              </div>
            </div>

            {/* Search navigation input */}
            <div className="mt-4 px-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search navigation..."
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  className="w-full rounded-xl border border-border/80 bg-background/80 py-1.5 pl-8 pr-7 text-xs placeholder:text-muted-foreground/70 outline-none focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                />
                {navSearch && (
                  <button
                    type="button"
                    onClick={() => setNavSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Sub-Navigation Links */}
            <div className="mt-3 flex-1 overflow-y-auto space-y-0.5 pr-1 scrollbar-thin">
              {filteredSubNavItems.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  No matching items
                </div>
              ) : (
                filteredSubNavItems.map((item, idx) => renderNavElement(item, idx))
              )}
            </div>
          </div>
        )}
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE FLYOUT DRAWER FOR SUB-NAV                             */}
      {/* ------------------------------------------------------------- */}
      {mobileSubNavOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-xs"
            onClick={() => setMobileSubNavOpen(false)}
          />
          <div className="relative ml-[68px] flex h-full w-64 flex-col border-r border-border bg-card p-4 shadow-2xl z-50">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
              <span className="text-sm font-bold tracking-tight text-foreground">
                Ente Mahall
              </span>
              <button
                type="button"
                onClick={() => setMobileSubNavOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 text-xs">
              {filteredSubNavItems.map((item, idx) =>
                renderNavElement(item, idx)
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MAIN VIEWPORT CANVAS - Single Large Curved Canvas Container   */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col p-2 sm:p-2.5 min-w-0 overflow-hidden">
        <div className="flex flex-1 flex-col rounded-[24px] sm:rounded-[28px] bg-card shadow-[0px_0px_14px_0px_#00000013] overflow-hidden min-w-0">
          {/* Top Header Bar */}
          <header className="relative z-30 flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-card/70 px-4 sm:px-6 backdrop-blur-md">
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={() => setMobileSubNavOpen(true)}
                className="flex md:hidden items-center justify-center rounded-xl p-2 text-muted-foreground hover:bg-muted"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Breadcrumb Trail */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 min-w-0 text-xs">
                {/* Home Icon */}
                <Link
                  href={`/${slug}`}
                  className="flex items-center text-muted-foreground hover:text-foreground transition-colors p-0.5 shrink-0"
                  title="Home"
                >
                  <Home className="h-3.5 w-3.5" />
                </Link>

                {breadcrumbs.length === 0 ? (
                  <>
                    <ChevronRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                    <span className="font-bold text-foreground truncate max-w-[140px] sm:max-w-[200px]">
                      Dashboard
                    </span>
                  </>
                ) : null}

                {/* Breadcrumb Path Items */}
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={crumb.href || idx}>
                    <ChevronRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                    {crumb.isLast ? (
                      <span className="font-bold text-foreground truncate max-w-[150px] sm:max-w-[240px]">
                        {crumb.label}
                      </span>
                    ) : crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="font-medium text-muted-foreground hover:text-foreground transition-colors truncate max-w-[120px] sm:max-w-[180px]"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="font-medium text-muted-foreground truncate max-w-[120px] sm:max-w-[180px]">
                        {crumb.label}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </nav>


            </div>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <CommandPalette slug={slug} />
              <TopbarQuickActions slug={slug} /></div>
            {/* Topbar Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Theme toggle */}
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title="Toggle theme"
              >
                <Sun className="h-4 w-4" />
              </button>

              <NotificationBell slug={slug} items={notificationItems} />

              {/* User Avatar Menu */}
              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="group relative flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-105 focus:outline-hidden"
                  title={`${userName} (${userRole})`}
                >
                  <Avatar name={userName} size="sm" className="h-9 w-9 text-xs" />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
                </button>

                {/* User Popover */}
                {userMenuOpen && (
                  <div
                    className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-border bg-card p-3 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 animate-in fade-in zoom-in-95 duration-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-3 border-b border-border/60 pb-3 mb-2">
                      <Avatar name={userName} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-foreground">
                          {userName}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {userRole}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Link
                        href={`${base}/settings`}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                        Account Settings
                      </Link>
                      <LogoutButton
                        redirectTo="/login"
                        variant="ghost"
                        showIcon
                        className="w-full justify-start rounded-xl px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/30"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Scrollable Main Workspace Canvas Page */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
            <div className="mx-auto max-w-7xl">
              <BreadcrumbContext.Provider value={{ detailTitle, setDetailTitle }}>
                {children}
              </BreadcrumbContext.Provider>
            </div>
          </main>
        </div>
      </div>
      </div>
    </IdleTimeoutProvider>
  );
}
