"use client";

import * as React from "react";
import { cn } from "../lib/cn";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "pills" | "underline";
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, variant = "pills", className }: TabsProps) {
  return (
    <div className={cn("flex items-center gap-1 overflow-x-auto border-border", variant === "underline" && "border-b", className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "group relative flex shrink-0 items-center gap-2 text-sm font-medium transition-all duration-150 focus-visible:outline-none",
              variant === "pills" && [
                "rounded-xl px-3.5 py-2",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              ],
              variant === "underline" && [
                "px-4 py-2.5 -mb-px border-b-2",
                isActive
                  ? "border-primary text-foreground font-semibold"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
              ]
            )}
          >
            {tab.icon && (
              <span className={cn("h-4 w-4 shrink-0", isActive ? "text-inherit" : "text-muted-foreground group-hover:text-foreground")}>
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  "ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  isActive
                    ? variant === "pills"
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {tab.count}
              </span>
            )}
            {tab.badge}
          </button>
        );
      })}
    </div>
  );
}
