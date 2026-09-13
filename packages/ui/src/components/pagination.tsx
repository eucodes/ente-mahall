import * as React from "react";
import { Button } from "./button";
import { cn } from "../lib/cn";

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  /** Called with the target page number — hook up to routing/state in the consuming app. */
  hrefForPage?: (page: number) => string;
  onPageChange?: (page: number) => void;
}

export function Pagination({ page, pageSize, total, hrefForPage, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  function handlePrev(e: React.MouseEvent) {
    if (onPageChange) {
      e.preventDefault();
      if (page > 1) onPageChange(page - 1);
    }
  }

  function handleNext(e: React.MouseEvent) {
    if (onPageChange) {
      e.preventDefault();
      if (page < totalPages) onPageChange(page + 1);
    }
  }

  return (
    <nav className="flex items-center justify-between" aria-label="Pagination">
      <p className="text-xs text-muted-foreground">
        Page {page} of {totalPages} &middot; {total} total
      </p>
      <div className="flex gap-2">
        <Button
          asChild={!onPageChange}
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={onPageChange ? handlePrev : undefined}
        >
          {onPageChange ? (
            "Previous"
          ) : (
            <a
              href={page > 1 && hrefForPage ? hrefForPage(page - 1) : undefined}
              aria-label="Previous page"
              className={cn(page <= 1 && "pointer-events-none opacity-50")}
            >
              Previous
            </a>
          )}
        </Button>
        <Button
          asChild={!onPageChange}
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={onPageChange ? handleNext : undefined}
        >
          {onPageChange ? (
            "Next"
          ) : (
            <a
              href={page < totalPages && hrefForPage ? hrefForPage(page + 1) : undefined}
              aria-label="Next page"
              className={cn(page >= totalPages && "pointer-events-none opacity-50")}
            >
              Next
            </a>
          )}
        </Button>
      </div>
    </nav>
  );
}
