"use client";

import * as React from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = React.useState(false);
  const [coords, setCoords] = React.useState<React.CSSProperties>({});
  const containerRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = React.useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const approxHeight = items.length * 36 + 24;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    let openUpwards = direction === "up";
    if (direction === "down" && spaceBelow < approxHeight + 12 && spaceAbove > spaceBelow) {
      openUpwards = true;
    }

    const nextStyle: React.CSSProperties = {
      position: "fixed",
      zIndex: 99999
    };

    if (openUpwards) {
      nextStyle.bottom = `${window.innerHeight - rect.top + 6}px`;
    } else {
      nextStyle.top = `${rect.bottom + 6}px`;
    }

    if (align === "right") {
      nextStyle.right = `${Math.max(8, window.innerWidth - rect.right)}px`;
    } else {
      nextStyle.left = `${Math.max(8, rect.left)}px`;
    }

    setCoords(nextStyle);
  }, [align, direction, items.length]);

  React.useEffect(() => {
    if (!open) return;

    updatePosition();

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    function handleScrollOrResize() {
      updatePosition();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [open, updatePosition]);

  return (
    <div
      ref={containerRef}
      className="relative inline-block text-left"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => {
            const next = !o;
            if (next) {
              // Update position right as it opens
              updatePosition();
            }
            return next;
          });
        }}
      >
        {trigger}
      </div>

      {mounted &&
        open &&
        createPortal(
          <div
            ref={menuRef}
            style={coords}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "min-w-48 rounded-2xl border border-border/80 bg-card p-1.5 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 animate-in fade-in-0 zoom-in-95 focus:outline-hidden",
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
                "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
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
          </div>,
          document.body
        )}
    </div>
  );
}
