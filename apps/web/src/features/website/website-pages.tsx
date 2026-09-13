"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  Tv,
  Trophy,
  Calendar,
  Landmark,
  HeartHandshake,
  ChevronRight,
  Menu
} from "@mahalle/ui";

interface WebsitePagesProps {
  slug: string;
  tenantName: string;
}

interface PageItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

export function WebsitePages({ slug, tenantName }: WebsitePagesProps) {
  const publicBase = `https://${slug}.mahalle.app`;

  const pages: PageItem[] = [
    {
      id: "home",
      title: "Home",
      description: "Main landing page with hero, about, contact, and gallery sections",
      href: `${publicBase}/`,
      icon: <Home className="h-5 w-5 text-foreground/80" />
    },
    {
      id: "wall",
      title: "Display Wall / Prayer Screen",
      description: "Public display wall with daily prayer countdown, Iqamah schedule, and notice ticker",
      href: `${publicBase}/wall`,
      icon: <Tv className="h-5 w-5 text-foreground/80" />
    },
    {
      id: "announcements",
      title: "Announcements & Circulars",
      description: "Official Mahall notifications, Friday circulars, and community releases",
      href: `${publicBase}/announcements`,
      icon: <Trophy className="h-5 w-5 text-foreground/80" />
    },
    {
      id: "schedules",
      title: "Schedules & Prayer Times",
      description: "Daily 5 prayers, Friday Juma Iqamah, and Ramadan Sehri / Iftar timings",
      href: `${publicBase}/schedules`,
      icon: <Calendar className="h-5 w-5 text-foreground/80" />
    },
    {
      id: "committee",
      title: "Office Bearers & Committee",
      description: "Public directory of executive members, President, Secretary, and Imam",
      href: `${publicBase}/committee`,
      icon: <Landmark className="h-5 w-5 text-foreground/80" />
    },
    {
      id: "donations",
      title: "Donations & Community Aid",
      description: "Online UPI QR code, masjid maintenance fund, and welfare assistance requests",
      href: `${publicBase}/donate`,
      icon: <HeartHandshake className="h-5 w-5 text-foreground/80" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header (Matching Image 3: Icon in rounded square + Title) */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Menu className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Pages
        </h1>
      </div>

      {/* Pages List: Clean Rounded Full-width Rows (Matching Image 3) */}
      <div className="space-y-3.5">
        {pages.map((page) => (
          <a
            key={page.id}
            href={page.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="flex items-center justify-between gap-4 rounded-3xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs transition-all hover:border-emerald-500/50 hover:shadow-sm">
              <div className="flex items-center gap-4 min-w-0">
                {/* Rounded Icon Box */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-muted/60 transition-colors group-hover:bg-emerald-500/10 group-hover:text-emerald-600">
                  {page.icon}
                </div>

                <div className="min-w-0 space-y-0.5">
                  <span className="block text-sm font-bold text-foreground group-hover:text-emerald-600 transition-colors">
                    {page.title}
                  </span>
                  <p className="text-xs text-muted-foreground truncate">
                    {page.description}
                  </p>
                </div>
              </div>

              {/* Right Chevron */}
              <div className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground transition-all group-hover:text-foreground group-hover:translate-x-0.5 shrink-0">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
