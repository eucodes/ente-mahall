"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  BarChart3,
  Users,
  Globe,
  RefreshCw,
  Button
} from "@mahalle/ui";

interface WebsiteAnalyticsProps {
  slug: string;
  tenantName: string;
}

export function WebsiteAnalytics({ slug, tenantName }: WebsiteAnalyticsProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasData, setHasData] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* 1. Top 3 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Page Views */}
        <Card className="rounded-3xl border-border/80 bg-card shadow-xs">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Page Views
              </span>
              <BarChart3 className="h-5 w-5 text-muted-foreground/70" />
            </div>
            <div className="text-3xl font-extrabold tracking-tight text-foreground">
              {hasData ? "3,840" : "0"}
            </div>
          </CardContent>
        </Card>

        {/* Unique Visitors */}
        <Card className="rounded-3xl border-border/80 bg-card shadow-xs">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Unique Visitors
              </span>
              <Users className="h-5 w-5 text-muted-foreground/70" />
            </div>
            <div className="text-3xl font-extrabold tracking-tight text-foreground">
              {hasData ? "1,290" : "0"}
            </div>
          </CardContent>
        </Card>

        {/* Sessions */}
        <Card className="rounded-3xl border-border/80 bg-card shadow-xs">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Sessions
              </span>
              <Globe className="h-5 w-5 text-muted-foreground/70" />
            </div>
            <div className="text-3xl font-extrabold tracking-tight text-foreground">
              {hasData ? "2,150" : "0"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Last 30 Days / Traffic Trend Card */}
      <Card className="rounded-3xl border-border/80 bg-card shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 p-6 pb-4">
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Last 30 Days
            </span>
            <CardTitle className="text-base font-bold text-foreground">
              Traffic trend
            </CardTitle>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              className="rounded-xl text-xs font-semibold gap-1.5 h-9 px-3.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Legend */}
          <div className="flex items-center justify-end gap-6 text-xs font-medium">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <span>Page Views</span>
            </div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-600" />
              <span>Sessions</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              <span>Unique Visitors</span>
            </div>
          </div>

          {/* Dotted Grid Line Trend Area */}
          <div className="relative h-44 sm:h-52 w-full border-t border-b border-dashed border-border/60 flex flex-col justify-between py-4">
            <div className="w-full border-b border-dashed border-border/30" />
            <div className="w-full border-b border-dashed border-border/30" />

            {hasData ? (
              <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 150">
                <path
                  d="M0,120 Q60,95 120,75 T240,40 T360,65 T500,25"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                />
                <path
                  d="M0,130 Q70,115 140,105 T260,70 T380,85 T500,55"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="2"
                />
                <path
                  d="M0,135 Q80,125 150,118 T270,90 T390,100 T500,75"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="2"
                />
              </svg>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground/70">
                No trend data recorded yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 3. Bottom Grid: 5 Analytics Breakdown Cards (Top Pages, Referrers, Countries, Devices, Browsers) */}
      <div className="grid sm:grid-cols-2 gap-5">
        {/* 1. Top Pages */}
        <Card className="rounded-3xl border-border/80 bg-card shadow-xs min-h-[200px] flex flex-col justify-between">
          <CardHeader className="border-b border-border/60 px-6 py-4">
            <CardTitle className="text-sm font-bold text-foreground">Top Pages</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col justify-center">
            {hasData ? (
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">/prayer-times</span>
                  <span className="text-muted-foreground font-mono text-xs">1,820 views</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">/announcements</span>
                  <span className="text-muted-foreground font-mono text-xs">940 views</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">/</span>
                  <span className="text-muted-foreground font-mono text-xs">680 views</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-xs text-muted-foreground/70 py-6">
                No data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* 2. Referrers */}
        <Card className="rounded-3xl border-border/80 bg-card shadow-xs min-h-[200px] flex flex-col justify-between">
          <CardHeader className="border-b border-border/60 px-6 py-4">
            <CardTitle className="text-sm font-bold text-foreground">Referrers</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col justify-center">
            {hasData ? (
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Direct / WhatsApp Links</span>
                  <span className="text-muted-foreground font-mono text-xs">68%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Google Search</span>
                  <span className="text-muted-foreground font-mono text-xs">20%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Noticeboard QR Scan</span>
                  <span className="text-muted-foreground font-mono text-xs">12%</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-xs text-muted-foreground/70 py-6">
                No data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* 3. Countries */}
        <Card className="rounded-3xl border-border/80 bg-card shadow-xs min-h-[200px] flex flex-col justify-between">
          <CardHeader className="border-b border-border/60 px-6 py-4">
            <CardTitle className="text-sm font-bold text-foreground">Countries</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col justify-center">
            {hasData ? (
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">India</span>
                  <span className="text-muted-foreground font-mono text-xs">84%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">United Arab Emirates</span>
                  <span className="text-muted-foreground font-mono text-xs">10%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Saudi Arabia</span>
                  <span className="text-muted-foreground font-mono text-xs">4%</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-xs text-muted-foreground/70 py-6">
                No data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* 4. Devices */}
        <Card className="rounded-3xl border-border/80 bg-card shadow-xs min-h-[200px] flex flex-col justify-between">
          <CardHeader className="border-b border-border/60 px-6 py-4">
            <CardTitle className="text-sm font-bold text-foreground">Devices</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col justify-center">
            {hasData ? (
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Mobile Smartphones</span>
                  <span className="text-muted-foreground font-mono text-xs">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Desktop Computers</span>
                  <span className="text-muted-foreground font-mono text-xs">19%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Tablets & iPads</span>
                  <span className="text-muted-foreground font-mono text-xs">3%</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-xs text-muted-foreground/70 py-6">
                No data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* 5. Browsers */}
        <Card className="rounded-3xl border-border/80 bg-card shadow-xs min-h-[200px] flex flex-col justify-between sm:col-span-2">
          <CardHeader className="border-b border-border/60 px-6 py-4">
            <CardTitle className="text-sm font-bold text-foreground">Browsers</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col justify-center">
            {hasData ? (
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 border border-border/40">
                  <span className="font-semibold text-foreground">Google Chrome</span>
                  <span className="text-muted-foreground font-mono text-xs">65%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 border border-border/40">
                  <span className="font-semibold text-foreground">Apple Safari</span>
                  <span className="text-muted-foreground font-mono text-xs">23%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 border border-border/40">
                  <span className="font-semibold text-foreground">Mozilla Firefox</span>
                  <span className="text-muted-foreground font-mono text-xs">8%</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-xs text-muted-foreground/70 py-6">
                No data yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
