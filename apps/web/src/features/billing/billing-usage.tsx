"use client";

import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  RefreshCw,
  HardDrive,
  Users,
  LayoutGrid,
  FileText,
  MessageSquare,
  BarChart3,
  Layers
} from "@mahalle/ui";

interface BillingUsageProps {
  slug: string;
  tenantName: string;
}

interface UsageCardItem {
  id: string;
  title: string;
  used: number;
  limit: number;
  icon: React.ReactNode;
}

export function BillingUsage({ slug, tenantName }: BillingUsageProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Storage usage
  const storageUsedMb = 0;
  const storageLimitMb = 100;
  const storagePct = Math.round((storageUsedMb / storageLimitMb) * 100);

  // Usage items matching Image 3 structure
  const items: UsageCardItem[] = [
    {
      id: "divisions",
      title: "Sub-divisions",
      used: 1,
      limit: 1,
      icon: <LayoutGrid className="h-5 w-5 text-muted-foreground/70" />
    },
    {
      id: "members",
      title: "Members",
      used: 1,
      limit: 50,
      icon: <Users className="h-5 w-5 text-muted-foreground/70" />
    },
    {
      id: "programmes",
      title: "Programmes & Registers",
      used: 1,
      limit: 25,
      icon: <FileText className="h-5 w-5 text-muted-foreground/70" />
    },
    {
      id: "users",
      title: "Users",
      used: 1,
      limit: 3,
      icon: <Users className="h-5 w-5 text-muted-foreground/70" />
    },
    {
      id: "whatsapp",
      title: "SMS & WhatsApp credits",
      used: 4,
      limit: 5,
      icon: <MessageSquare className="h-5 w-5 text-muted-foreground/70" />
    },
    {
      id: "views_month",
      title: "Website views / month",
      used: 0,
      limit: 1000,
      icon: <BarChart3 className="h-5 w-5 text-muted-foreground/70" />
    },
    {
      id: "views_day",
      title: "Website views / day",
      used: 0,
      limit: 100,
      icon: <BarChart3 className="h-5 w-5 text-muted-foreground/70" />
    }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => setIsRecalculating(false), 800);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Usage
          </span>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Plan limits and usage
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            className="rounded-xl text-xs font-semibold gap-1.5 h-9 px-3.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="rounded-xl text-xs font-semibold gap-1.5 h-9 px-3.5"
          >
            <Layers className="h-4 w-4 text-muted-foreground" />
            <span>Resources</span>
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={handleRecalculate}
            className="rounded-xl text-xs font-semibold gap-1.5 h-9 px-4"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRecalculating ? "animate-spin" : ""}`} />
            <span>Recalculate</span>
          </Button>
        </div>
      </div>

      {/* Grid of Usage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left Column: Storage Card */}
        <Card className="md:col-span-4 rounded-3xl border-border/80 bg-card shadow-xs flex flex-col justify-between p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Storage
            </span>
            <HardDrive className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>

          {/* Center Circular Gauge */}
          <div className="my-8 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              {/* Outer Circular Track */}
              <div className="h-36 w-36 rounded-full border-4 border-muted/50 flex flex-col items-center justify-center relative">
                {/* Indicator Point */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-blue-600 shadow-xs" />
                <span className="text-2xl font-extrabold text-foreground tracking-tight">
                  {storagePct}%
                </span>
                <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Capacity
                </span>
              </div>
            </div>
          </div>

          {/* Bottom storage label */}
          <div className="text-center font-mono font-bold text-sm text-foreground">
            {storageUsedMb} MB <span className="text-muted-foreground font-normal">/ {storageLimitMb} MB</span>
          </div>
        </Card>

        {/* Right Column: 2-column Grid of Resource Cards */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => {
            const pct = Math.min(100, Math.round((item.used / item.limit) * 100));

            return (
              <Card key={item.id} className="rounded-3xl border-border/80 bg-card shadow-xs p-5 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground truncate pr-2">
                    {item.title}
                  </span>
                  {item.icon}
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold text-foreground font-mono">
                      {item.used}
                    </span>
                    <span className="text-sm text-muted-foreground font-mono">
                      / {item.limit}
                    </span>
                  </div>

                  {/* Horizontal Progress Bar */}
                  <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{ width: `${Math.max(4, pct)}%` }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
