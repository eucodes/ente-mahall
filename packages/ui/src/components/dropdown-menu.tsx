"use client";

import * as React from "react";
import { cn } from "../lib/cn";

export interface DropdownMenuItem {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
  variant?: "default" | "destructive";
  disabled?: boolean;
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  align?: "left" | "right";
  direction?: "down" | "up";
  className?: string;
}

export function DropdownMenu({
  trigger,
  items,
  align = "right",
  direction = "down",
  className
}: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative inline-block text-left"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        {trigger}
      </div>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "absolute z-50 min-w-44 rounded-2xl border border-border/80 bg-card p-1.5 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 animate-in fade-in-0 zoom-in-95 focus:outline-hidden",
            direction === "up" ? "bottom-full mb-1.5" : "top-full mt-1.5",
            align === "right" ? "right-0" : "left-0",
            className
          )}
        >
          {items.map((item, index) => {
            const content = (
              <>
                {item.icon && <span className="h-4 w-4 shrink-0 text-muted-foreground">{item.icon}</span>}
                <span className="truncate">{item.label}</span>
              </>
            );

            const itemClass = cn(
              "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors text-left",
              item.disabled && "opacity-50 pointer-events-none",
              item.variant === "destructive"
                ? "text-destructive hover:bg-destructive/10"
                : "text-foreground hover:bg-muted/80"
            );

            if (item.href) {
              return (
                <a
                  key={index}
                  href={item.href}
                  className={itemClass}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                  }}
                >
                  {content}
                </a>
              );
            }

            return (
              <button
                key={index}
                type="button"
                className={itemClass}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  item.onClick?.();
                }}
              >
                {content}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
