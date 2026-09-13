"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/cn";
import { ChevronDown, X } from "./icons";

export interface NavItem {
  label: string;
  /** Omit on a group header — a group toggles open/closed instead of navigating. */
  href?: string;
  icon?: React.ReactNode;
  /** Match the pathname exactly instead of by prefix (use for the section's own index route). */
  exact?: boolean;
  /** Presence makes this a collapsible group instead of a link. */
  children?: NavItem[];
  /** Optional badge or counter (e.g., '3', 'New') */
  badge?: React.ReactNode;
  /** If true, renders as an uppercase section label */
  isSectionHeader?: boolean;
}

export interface AppShellProps {
  brand: React.ReactNode;
  navItems: NavItem[];
  topbarTitle?: React.ReactNode;
  topbarActions?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
  accent?: "primary" | "destructive" | "lime" | "emerald";
  children: React.ReactNode;
}

const ACTIVE_CLASSES: Record<NonNullable<AppShellProps["accent"]>, string> = {
  primary: "bg-primary text-primary-foreground font-semibold shadow-xs",
  destructive: "bg-destructive text-destructive-foreground font-semibold",
  lime: "bg-sidebar-accent text-sidebar-accent-foreground font-semibold",
  emerald: "bg-emerald-600/10 text-emerald-800 dark:text-emerald-300 font-semibold border-l-2 border-emerald-600 pl-[12px]"
};

function isActive(pathname: string, item: NavItem) {
  if (!item.href) return false;
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function groupHasActiveChild(pathname: string, item: NavItem): boolean {
  return item.children?.some((child) => isActive(pathname, child) || groupHasActiveChild(pathname, child)) ?? false;
}

function NavLink({
  item,
  pathname,
  activeClass,
  onNavigate
}: {
  item: NavItem;
  pathname: string;
  activeClass: string;
  onNavigate?: () => void;
}) {
  const active = isActive(pathname, item);
  return (
    <Link
      href={item.href ?? "#"}
      onClick={onNavigate}
      className={cn(
        "group relative flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-150 [&>div>svg]:h-[17px] [&>div>svg]:w-[17px]",
        active
          ? activeClass
          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
      )}
    >
      <div className="flex items-center gap-2.5 truncate">
        {item.icon && (
          <span className={cn("transition-colors", active ? "text-inherit" : "text-muted-foreground/80 group-hover:text-foreground")}>
            {item.icon}
          </span>
        )}
        <span className="truncate">{item.label}</span>
      </div>
      {item.badge && <span className="shrink-0">{item.badge}</span>}
    </Link>
  );
}

function NavGroup({
  item,
  pathname,
  activeClass,
  isOpen,
  onToggle,
  onNavigate
}: {
  item: NavItem;
  pathname: string;
  activeClass: string;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
  const isChildActive = groupHasActiveChild(pathname, item);

  return (
    <div className="space-y-0.5">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={cn(
          "flex w-full items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors hover:bg-muted/70 hover:text-foreground [&>div>svg]:h-[17px] [&>div>svg]:w-[17px]",
          isChildActive ? "text-foreground font-semibold" : "text-muted-foreground"
        )}
      >
        <div className="flex items-center gap-2.5 truncate">
          {item.icon && <span className={cn("transition-colors", isChildActive ? "text-primary" : "text-muted-foreground/80")}>{item.icon}</span>}
          <span className="truncate">{item.label}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {item.badge}
          <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground/70 transition-transform duration-200", isOpen && "rotate-180")} />
        </div>
      </button>

      {isOpen && (
        <div className="ml-4 space-y-0.5 border-l border-border/80 pl-2.5 pt-0.5 animate-in fade-in-50 duration-150">
          {item.children?.map((child) =>
            child.children ? (
              <NavGroup
                key={child.label}
                item={child}
                pathname={pathname}
                activeClass={activeClass}
                isOpen={groupHasActiveChild(pathname, child)}
                onToggle={() => {}}
                onNavigate={onNavigate}
              />
            ) : (
              <NavLink key={child.href ?? child.label} item={child} pathname={pathname} activeClass={activeClass} onNavigate={onNavigate} />
            )
          )}
        </div>
      )}
    </div>
  );
}

function NavSection({
  item,
  pathname,
  activeClass,
  expandedGroup,
  onToggleGroup,
  onNavigate
}: {
  item: NavItem;
  pathname: string;
  activeClass: string;
  expandedGroup: string | null;
  onToggleGroup: (label: string) => void;
  onNavigate?: () => void;
}) {
  if (item.isSectionHeader) {
    return (
      <div className="px-3 pt-4 pb-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{item.label}</p>
      </div>
    );
  }

  if (item.children) {
    return (
      <NavGroup
        item={item}
        pathname={pathname}
        activeClass={activeClass}
        isOpen={expandedGroup === item.label}
        onToggle={() => onToggleGroup(item.label)}
        onNavigate={onNavigate}
      />
    );
  }

  return <NavLink item={item} pathname={pathname} activeClass={activeClass} onNavigate={onNavigate} />;
}

export function AppShell({
  brand,
  navItems,
  topbarTitle,
  topbarActions,
  sidebarFooter,
  accent = "primary",
  children
}: AppShellProps) {
  const pathname = usePathname();
  const activeClass = ACTIVE_CLASSES[accent];
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Accordion state: automatically find active group from current route
  const findActiveGroup = React.useCallback(() => {
    for (const item of navItems) {
      if (item.children && groupHasActiveChild(pathname, item)) {
        return item.label;
      }
    }
    return null;
  }, [navItems, pathname]);

  const [expandedGroup, setExpandedGroup] = React.useState<string | null>(findActiveGroup);

  // Sync expanded group when route changes
  React.useEffect(() => {
    const active = findActiveGroup();
    if (active) {
      setExpandedGroup(active);
    }
    setMobileOpen(false);
  }, [pathname, findActiveGroup]);

  // When any group is expanded, collapse all other groups
  const handleToggleGroup = React.useCallback((label: string) => {
    setExpandedGroup((current) => (current === label ? null : label));
  }, []);

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-30 md:flex md:w-64 md:flex-col border-r border-border/70 bg-card">
        <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border/60 px-5">{brand}</div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-thin">
          {navItems.map((item, idx) => (
            <NavSection
              key={item.href ?? item.label ?? idx}
              item={item}
              pathname={pathname}
              activeClass={activeClass}
              expandedGroup={expandedGroup}
              onToggleGroup={handleToggleGroup}
            />
          ))}
        </nav>
        {sidebarFooter && <div className="shrink-0 border-t border-border/60 p-3 bg-muted/20">{sidebarFooter}</div>}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in-0"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-50 flex w-72 max-w-[85vw] flex-col bg-card shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
              {brand}
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto p-3">
              {navItems.map((item, idx) => (
                <NavSection
                  key={item.href ?? item.label ?? idx}
                  item={item}
                  pathname={pathname}
                  activeClass={activeClass}
                  expandedGroup={expandedGroup}
                  onToggleGroup={handleToggleGroup}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
            </nav>
            {sidebarFooter && <div className="shrink-0 border-t border-border p-3 bg-muted/20">{sidebarFooter}</div>}
          </aside>
        </div>
      )}

      {/* Main Content Surface */}
      <div className="flex min-w-0 flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center border-b border-border/70 bg-card/90 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-card/75 md:px-8">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Hamburger trigger for mobile */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
                aria-label="Open menu"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </button>
              <div className="min-w-0">{topbarTitle}</div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">{topbarActions}</div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
