"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Badge,
  Bell,
  DropdownMenu,
  LogOut,
  Plus,
  Search,
  ShieldCheck,
  useToast
} from "@mahalle/ui";
import { apiClient } from "@/lib/api-client";
import { CommandPalette } from "./command-palette";
import { SystemStatusDialog } from "./system-status-dialog";
import { ProvisionTenantDialog } from "./provision-tenant-dialog";

export interface ControlTopbarActionsProps {
  fullName: string;
  email: string;
  role: string;
}

export function ControlTopbarActions({ fullName, email, role }: ControlTopbarActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [provisionDialogOpen, setProvisionDialogOpen] = useState(false);

  // Global ⌘K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // Proceed to login regardless of error
    } finally {
      toast({ title: "Logged out" });
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }

  return (
    <>
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Quick Command Palette Trigger */}
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 hover:bg-muted/70 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          title="Search or jump to page (⌘K)"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Search platform&hellip;</span>
          <kbd className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </button>

        {/* Provision Tenant Action */}
        <button
          type="button"
          onClick={() => setProvisionDialogOpen(true)}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 px-3 py-1.5 text-xs font-semibold transition-opacity"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Mahalle</span>
        </button>

        {/* Cluster Telemetry Pill */}
        <button
          type="button"
          onClick={() => setStatusDialogOpen(true)}
          className="hidden lg:flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 text-xs text-emerald-700 dark:text-emerald-300 transition-colors"
          title="Inspect Cluster Health"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-[11px]">System Online</span>
        </button>

        {/* User Account Menu */}
        <DropdownMenu
          align="right"
          trigger={
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl px-1.5 py-1 transition-colors hover:bg-muted"
            >
              <Avatar name={fullName} />
              <span className="hidden text-left leading-tight md:block">
                <span className="block truncate text-xs font-semibold text-foreground">{fullName}</span>
                <span className="block truncate text-[10px] text-muted-foreground">{role}</span>
              </span>
            </button>
          }
          items={[
            { label: email, disabled: true },
            {
              label: "System Health Diagnostics",
              onClick: () => setStatusDialogOpen(true)
            },
            {
              label: "Provision New Mahalle",
              onClick: () => setProvisionDialogOpen(true)
            },
            {
              label: isLoggingOut ? "Logging out…" : "Log out",
              icon: <LogOut className="h-4 w-4" />,
              variant: "destructive",
              disabled: isLoggingOut,
              onClick: handleLogout
            }
          ]}
        />
      </div>

      {/* Modals */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onOpenProvisionModal={() => setProvisionDialogOpen(true)}
        onOpenHealthModal={() => setStatusDialogOpen(true)}
      />

      <SystemStatusDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
      />

      <ProvisionTenantDialog
        open={provisionDialogOpen}
        onOpenChange={setProvisionDialogOpen}
      />
    </>
  );
}
