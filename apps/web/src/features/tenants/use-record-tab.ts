"use client";

import { useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Keeps the active tab in `?tab=` so a record page can be deep-linked and
 * survives refresh. Uses history.replaceState rather than router.replace so
 * switching tabs doesn't re-fetch the page's server data.
 */
export function useRecordTab<T extends string>(tabs: readonly T[], fallback: T): [T, (tab: string) => void] {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const param = searchParams.get("tab");
  const active = param !== null && (tabs as readonly string[]).includes(param) ? (param as T) : fallback;

  const setTab = useCallback(
    (tab: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (tab === fallback) params.delete("tab");
      else params.set("tab", tab);
      const query = params.toString();
      window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname);
    },
    [pathname, searchParams, fallback]
  );

  return [active, setTab];
}
