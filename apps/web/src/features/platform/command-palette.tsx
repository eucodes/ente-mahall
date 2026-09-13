"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building,
  CreditCard,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  FileText,
  Home,
  LayoutGrid,
  ScrollText,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users
} from "@mahalle/ui";
import { apiClient } from "@/lib/api-client";
import type { PlatformTenant } from "@/lib/platform";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenProvisionModal?: () => void;
  onOpenHealthModal?: () => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  onOpenProvisionModal,
  onOpenHealthModal
}: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [tenants, setTenants] = useState<PlatformTenant[]>([]);
  const [isLoadingTenants, setIsLoadingTenants] = useState(false);

  useEffect(() => {
    if (open && tenants.length === 0) {
      setIsLoadingTenants(true);
      apiClient
        .get<{ tenants: PlatformTenant[] }>("/platform/tenants")
        .then((res) => {
          setTenants(res.tenants ?? []);
        })
        .catch(() => {})
        .finally(() => setIsLoadingTenants(false));
    }
  }, [open, tenants.length]);

  const q = query.trim().toLowerCase();

  const navigationItems = [
    { label: "Overview", href: "/", icon: <Home className="h-4 w-4" />, group: "Navigation" },
    { label: "All Mahalles (Fleet)", href: "/tenants", icon: <Building className="h-4 w-4" />, group: "Navigation" },
    { label: "Audit Logs & Compliance", href: "/audit-logs", icon: <ScrollText className="h-4 w-4" />, group: "Navigation" },
    { label: "Analytics & Telemetry", href: "/analytics", icon: <LayoutGrid className="h-4 w-4" />, group: "Navigation" },
    { label: "Plans & Billing", href: "/plans", icon: <CreditCard className="h-4 w-4" />, group: "Platform" }
  ];

  const filteredNav = navigationItems.filter(
    (item) => !q || item.label.toLowerCase().includes(q) || item.group.toLowerCase().includes(q)
  );

  const filteredTenants = tenants
    .filter((t) => !q || t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q))
    .slice(0, 8);

  function handleSelect(href: string) {
    onOpenChange(false);
    setQuery("");
    router.push(href);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden sm:rounded-2xl border-border shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Quick Command Palette</DialogTitle>
        </DialogHeader>

        <div className="flex items-center border-b border-border px-4 py-3 bg-muted/20">
          <Search className="h-4 w-4 text-muted-foreground mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, search Mahalle, or jump to page..."
            className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-hidden text-foreground outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-block rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground ml-2">
            ESC
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-border/40">
          {/* Quick Actions */}
          {(!q || "provision new mahalle create".includes(q)) && (
            <div className="pb-2">
              <p className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Quick Actions
              </p>
              {onOpenProvisionModal && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    onOpenProvisionModal();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm hover:bg-primary/10 hover:text-primary transition-colors text-foreground group"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-primary/20">
                    <Building className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-xs">Provision New Mahalle</p>
                    <p className="text-[11px] text-muted-foreground">Commission a new tenant instance</p>
                  </div>
                </button>
              )}
              {onOpenHealthModal && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    onOpenHealthModal();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm hover:bg-primary/10 hover:text-primary transition-colors text-foreground group mt-0.5"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-primary/20">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-xs">System Health Diagnostics</p>
                    <p className="text-[11px] text-muted-foreground">Inspect cluster telemetry and database status</p>
                  </div>
                </button>
              )}
            </div>
          )}

          {/* Mahalles Search Results */}
          {filteredTenants.length > 0 && (
            <div className="py-2">
              <p className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Mahalles ({filteredTenants.length})
              </p>
              <div className="space-y-0.5">
                {filteredTenants.map((tenant) => (
                  <button
                    key={tenant.id}
                    type="button"
                    onClick={() => handleSelect(`/tenants/${tenant.id}`)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-sm hover:bg-muted transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-[11px] font-bold text-emerald-600 border border-emerald-500/20">
                        {tenant.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-xs text-foreground truncate">{tenant.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono truncate">{tenant.slug}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground group-hover:text-foreground font-medium">
                      Jump &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Pages */}
          {filteredNav.length > 0 && (
            <div className="pt-2">
              <p className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Platform Pages
              </p>
              <div className="space-y-0.5">
                {filteredNav.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => handleSelect(item.href)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm hover:bg-muted transition-colors text-foreground"
                  >
                    <div className="text-muted-foreground">{item.icon}</div>
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredNav.length === 0 && filteredTenants.length === 0 && (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No matching commands or Mahalles found for &quot;{query}&quot;
            </div>
          )}
        </div>

        <div className="border-t border-border/80 bg-muted/40 px-4 py-2 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Tip: Use ⌘K anywhere in the control plane to open</span>
          <span className="font-mono text-[10px]">ESC to close</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
