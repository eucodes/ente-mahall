"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { Checkbox } from "./checkbox";

export interface PermissionMatrixCategory {
  category: string;
  keys: string[];
}

export interface PermissionMatrixProps {
  categories: PermissionMatrixCategory[];
  selected: string[];
  onChange: (keys: string[]) => void;
  disabled?: boolean;
  className?: string;
}

function titleCase(segment: string): string {
  return segment
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** "registers.marriage.view" -> { group: "registers.marriage", action: "view" }; "finance.view" -> { group: "finance", action: "view" }. */
function splitKey(key: string): { group: string; action: string } {
  const parts = key.split(".");
  const action = parts[parts.length - 1] ?? key;
  const group = parts.slice(0, -1).join(".") || key;
  return { group, action };
}

/**
 * A permission checklist grouped by resource, used by the tenant Role
 * Editor. Two-level grouping (category -> sub-resource) is derived
 * client-side from the "resource.action" / "resource.sub.action" key
 * convention itself — no extra metadata needed from the API.
 */
export function PermissionMatrix({ categories, selected, onChange, disabled, className }: PermissionMatrixProps) {
  const selectedSet = React.useMemo(() => new Set(selected), [selected]);

  function toggle(key: string) {
    if (disabled) return;
    const next = new Set(selectedSet);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onChange(Array.from(next));
  }

  function toggleGroup(keys: string[], allSelected: boolean) {
    if (disabled) return;
    const next = new Set(selectedSet);
    for (const key of keys) {
      if (allSelected) next.delete(key);
      else next.add(key);
    }
    onChange(Array.from(next));
  }

  return (
    <div className={cn("space-y-6 overflow-x-auto", className)}>
      {categories.map((category) => {
        const groups = new Map<string, string[]>();
        for (const key of category.keys) {
          const { group } = splitKey(key);
          groups.set(group, [...(groups.get(group) ?? []), key]);
        }
        return (
          <div key={category.category} className="min-w-[320px] rounded-xl border border-border">
            <div className="border-b border-border bg-muted/40 px-4 py-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{titleCase(category.category)}</p>
            </div>
            <div className="divide-y divide-border">
              {Array.from(groups.entries()).map(([group, keys]) => {
                const groupLabel = group
                  .split(".")
                  .slice(group.split(".")[0] === category.category ? 1 : 0)
                  .map(titleCase)
                  .join(" ");
                const allSelected = keys.every((k) => selectedSet.has(k));
                return (
                  <div key={group} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
                    <label className="flex min-w-[140px] items-center gap-2 text-sm font-medium">
                      <Checkbox checked={allSelected} disabled={disabled} onChange={() => toggleGroup(keys, allSelected)} />
                      {groupLabel || titleCase(category.category)}
                    </label>
                    <div className="flex flex-1 flex-wrap gap-x-5 gap-y-1.5">
                      {keys.map((key) => {
                        const { action } = splitKey(key);
                        return (
                          <label key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Checkbox checked={selectedSet.has(key)} disabled={disabled} onChange={() => toggle(key)} />
                            {titleCase(action)}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
