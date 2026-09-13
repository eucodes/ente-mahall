"use client";

import { usePathname } from "next/navigation";
import { Breadcrumbs, type BreadcrumbItem } from "@mahalle/ui";
import { useTenantName } from "./tenant-name-context";

const SEGMENT_LABELS: Record<string, string> = {
  tenants: "Fleet & Mahalles",
  users: "User Directory",
  sessions: "Sessions",
  forms: "Forms Engine",
  features: "Features & Flags",
  plans: "Plans & Billing",
  billing: "Billing",
  analytics: "Platform Analytics",
  "audit-logs": "Audit Stream",
  dashboard: "Operations"
};


/** Fallback label for an id segment, based on the segment right before it. */
const ID_FALLBACK_BY_PARENT: Record<string, string> = {
  tenants: "Mahalle",
  users: "User",
  forms: "Form"
};

/** A route segment that isn't a known label and looks like a database id (cuid/uuid). */
function isLikelyId(segment: string) {
  return segment.length >= 20 || /^[0-9a-f-]{8,}$/i.test(segment);
}

export function ControlBreadcrumbs() {
  const pathname = usePathname();
  const tenantName = useTenantName();
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  let href = "";
  const items: BreadcrumbItem[] = segments.map((segment, index) => {
    href += `/${segment}`;
    const parent = segments[index - 1];
    const idFallback = parent === "tenants" ? (tenantName ?? "Mahalle") : (ID_FALLBACK_BY_PARENT[parent] ?? "Details");
    const label = SEGMENT_LABELS[segment] ?? (isLikelyId(segment) ? idFallback : segment);
    return { label, href };
  });

  return <Breadcrumbs items={items} className="mb-4" />;
}
