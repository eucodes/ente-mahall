"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/cn";

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  /** Match the pathname exactly instead of by prefix (use for the section's own index route). */
  exact?: boolean;
}

export interface AppShellProps {
  brand: React.ReactNode;
  navItems: NavItem[];
  topbarTitle?: React.ReactNode;
  topbarActions?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
  accent?: "primary" | "destructive" | "lime";
  children: React.ReactNode;
}

const ACTIVE_CLASSES: Record<NonNullable<AppShellProps["accent"]>, string> = {
  primary: "bg-primary text-primary-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  lime: "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
};

function isActive(pathname: string, item: NavItem) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function AppShell({
  brand,
  navItems,
  topbarTitle,
  topbarActions,
  sidebarFooter,
  accent = "lime",
  children
}: AppShellProps) {
  const pathname = usePathname();
  const activeClass = ACTIVE_CLASSES[accent];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-64 shrink-0 flex-col bg-card md:flex">
        <div className="flex h-16 items-center gap-2 px-6">{brand}</div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-4">
          {navItems.map((item) => {
            const active = isActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors [&>svg]:h-[18px] [&>svg]:w-[18px]",
                  active ? activeClass : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
        {sidebarFooter && <div className="p-4">{sidebarFooter}</div>}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/75 md:px-8">
          <div className="min-w-0 md:hidden">{brand}</div>
          <div className="hidden min-w-0 md:block">{topbarTitle}</div>
          <div className="flex shrink-0 items-center gap-3">{topbarActions}</div>
        </header>

        <div className="border-b border-border bg-card px-2 py-2 md:hidden">
          <nav className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const active = isActive(pathname, item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    active ? activeClass : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
