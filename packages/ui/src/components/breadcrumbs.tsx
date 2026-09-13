import * as React from "react";
import Link from "next/link";
import { cn } from "../lib/cn";
import { ChevronRight, Home } from "./icons";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export function Breadcrumbs({ items, showHome = true, className }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-xs text-muted-foreground", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {showHome && (
          <li className="flex items-center">
            <Link
              href="/"
              className="flex items-center transition-colors hover:text-foreground"
              aria-label="Home"
            >
              <Home className="h-3.5 w-3.5" />
            </Link>
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label + index} className="flex items-center gap-1.5">
              {(showHome || index > 0) && (
                <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
              )}
              {isLast || !item.href ? (
                <span className="font-semibold text-foreground truncate max-w-[200px]" aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-foreground truncate max-w-[150px]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
