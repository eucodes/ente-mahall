"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@mahalle/ui";

interface WebsiteVisibilityProps {
  slug: string;
  tenantName: string;
}

interface VisibilityToggleItem {
  id: string;
  label: string;
  enabled: boolean;
}

export function WebsiteVisibility({ slug, tenantName }: WebsiteVisibilityProps) {
  // 1. Page Visibility sections
  const [pageVisibility, setPageVisibility] = useState<VisibilityToggleItem[]>([
    { id: "schedules", label: "Schedules (Prayer Times)", enabled: true },
    { id: "announcements", label: "Announcements & Notices", enabled: true },
    { id: "downloads", label: "Downloads & Forms", enabled: true },
    { id: "gallery", label: "Photo Gallery & Campus", enabled: true },
    { id: "committee", label: "Office Bearers & Committee", enabled: true },
    { id: "wall", label: "Public Wall / Noticeboard", enabled: true },
    { id: "donations", label: "Online UPI Donations", enabled: true },
    { id: "verification", label: "Nikah Certificate Verification", enabled: true }
  ]);

  // 2. Navbar Visibility
  const [navbarVisibility, setNavbarVisibility] = useState<VisibilityToggleItem[]>([
    { id: "nav_schedules", label: "Schedules", enabled: true },
    { id: "nav_announcements", label: "Announcements", enabled: true },
    { id: "nav_downloads", label: "Downloads", enabled: true },
    { id: "nav_gallery", label: "Gallery", enabled: true },
    { id: "nav_committee", label: "Committee", enabled: true },
    { id: "nav_wall", label: "Wall", enabled: true },
    { id: "nav_donations", label: "Donate", enabled: true }
  ]);

  // 3. Footer Visibility
  const [footerVisibility, setFooterVisibility] = useState<VisibilityToggleItem[]>([
    { id: "foot_schedules", label: "Schedules & Iqamah", enabled: true },
    { id: "foot_announcements", label: "Notices & Circulars", enabled: true },
    { id: "foot_downloads", label: "Application Forms", enabled: true },
    { id: "foot_gallery", label: "Masjid Campus Gallery", enabled: true },
    { id: "foot_committee", label: "Contact Committee", enabled: true },
    { id: "foot_wall", label: "Live Display Wall", enabled: true }
  ]);

  const toggleItem = (
    list: VisibilityToggleItem[],
    setList: React.Dispatch<React.SetStateAction<VisibilityToggleItem[]>>,
    id: string
  ) => {
    setList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Visibility Card (Matching Image 2) */}
      <Card className="rounded-3xl border-border/80 shadow-xs">
        <CardHeader className="border-b border-border/60 pb-3 space-y-0.5">
          <CardTitle className="text-sm font-bold text-foreground">Page Visibility</CardTitle>
          <p className="text-xs text-muted-foreground">
            Choose which sections are visible on the public website.
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid sm:grid-cols-2 gap-3">
            {pageVisibility.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-2xs hover:bg-muted/30 transition-colors"
              >
                <span className="text-xs font-semibold text-foreground truncate pr-2">
                  {item.label}
                </span>

                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={() => toggleItem(pageVisibility, setPageVisibility, item.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    item.enabled ? "bg-emerald-600 dark:bg-emerald-500" : "bg-muted"
                  }`}
                  role="switch"
                  aria-checked={item.enabled}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      item.enabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2. Navbar Visibility Card (Matching Image 2) */}
      <Card className="rounded-3xl border-border/80 shadow-xs">
        <CardHeader className="border-b border-border/60 pb-3 space-y-0.5">
          <CardTitle className="text-sm font-bold text-foreground">Navbar Visibility</CardTitle>
          <p className="text-xs text-muted-foreground">
            Choose which links appear in the public navigation bar.
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid sm:grid-cols-2 gap-3">
            {navbarVisibility.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-2xs hover:bg-muted/30 transition-colors"
              >
                <span className="text-xs font-semibold text-foreground truncate pr-2">
                  {item.label}
                </span>

                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={() => toggleItem(navbarVisibility, setNavbarVisibility, item.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    item.enabled ? "bg-emerald-600 dark:bg-emerald-500" : "bg-muted"
                  }`}
                  role="switch"
                  aria-checked={item.enabled}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      item.enabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3. Footer Visibility Card (Matching Image 2) */}
      <Card className="rounded-3xl border-border/80 shadow-xs">
        <CardHeader className="border-b border-border/60 pb-3 space-y-0.5">
          <CardTitle className="text-sm font-bold text-foreground">Footer Visibility</CardTitle>
          <p className="text-xs text-muted-foreground">
            Choose which links and columns appear in the public footer.
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid sm:grid-cols-2 gap-3">
            {footerVisibility.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-2xs hover:bg-muted/30 transition-colors"
              >
                <span className="text-xs font-semibold text-foreground truncate pr-2">
                  {item.label}
                </span>

                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={() => toggleItem(footerVisibility, setFooterVisibility, item.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    item.enabled ? "bg-emerald-600 dark:bg-emerald-500" : "bg-muted"
                  }`}
                  role="switch"
                  aria-checked={item.enabled}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      item.enabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
