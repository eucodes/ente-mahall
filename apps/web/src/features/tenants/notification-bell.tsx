"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Badge, Bell } from "@mahalle/ui";

export interface NotificationItem {
  label: string;
  count: number;
  href: string;
}

export function NotificationBell({ slug, items }: { slug: string; items: NotificationItem[] }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const total = items.reduce((sum, item) => sum + item.count, 0);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {total > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
            {total > 9 ? "9+" : total}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-72 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
          <p className="border-b border-border px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Needs attention
          </p>
          {items.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground">Nothing needs attention right now.</p>
          ) : (
            <ul>
              {items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={() => setOpen(false)} className="flex items-center justify-between px-3 py-2.5 text-sm hover:bg-muted">
                    <span>{item.label}</span>
                    <Badge variant="secondary">{item.count}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
