import * as React from "react";
import { Button } from "./button";
import { cn } from "../lib/cn";

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  /** Called with the target page number — hook up to routing/state in the consuming app. */
  hrefForPage: (page: number) => string;
}

export function Pagination({ page, pageSize, total, hrefForPage }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-between" aria-label="Pagination">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages} &middot; {total} total
      </p>
      <div className="flex gap-2">
        <Button asChild variant="outline" size="sm" aria-disabled={page <= 1}>
          <a
            href={page > 1 ? hrefForPage(page - 1) : undefined}
            aria-label="Previous page"
            className={cn(page <= 1 && "pointer-events-none opacity-50")}
          >
            Previous
          </a>
        </Button>
        <Button asChild variant="outline" size="sm" aria-disabled={page >= totalPages}>
          <a
            href={page < totalPages ? hrefForPage(page + 1) : undefined}
            aria-label="Next page"
            className={cn(page >= totalPages && "pointer-events-none opacity-50")}
          >
            Next
          </a>
        </Button>
      </div>
    </nav>
  );
}
