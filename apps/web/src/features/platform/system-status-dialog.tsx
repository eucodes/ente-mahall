"use client";

import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  CheckCircle2,
  Clock,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  ShieldCheck,
  Spinner
} from "@mahalle/ui";
import { apiClient } from "@/lib/api-client";
import type { SystemStatus } from "@/lib/platform";

interface SystemStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SystemStatusDialog({ open, onOpenChange }: SystemStatusDialogProps) {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  function fetchStatus() {
    setIsLoading(true);
    apiClient
      .get<SystemStatus>("/platform/system/status")
      .then((res) => {
        setStatus(res);
        setLastChecked(new Date());
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    if (open) {
      fetchStatus();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:rounded-2xl border-border">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base">System Telemetry & Health</DialogTitle>
              <DialogDescription className="text-xs">
                Platform node and cluster diagnostics
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isLoading && !status ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <Spinner className="h-6 w-6 text-primary" />
            <span className="text-xs text-muted-foreground">Probing cluster health…</span>
          </div>
        ) : status ? (
          <div className="space-y-4 text-xs">
            {/* Status overview banner */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="font-semibold text-xs">All Systems Operational</span>
              </div>
              <Badge variant="success" className="text-[10px] uppercase font-mono">
                Healthy
              </Badge>
            </div>

            {/* Diagnostics grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl border border-border/70 bg-card space-y-1">
                <p className="text-[11px] text-muted-foreground">Database Engine</p>
                <p className="font-bold text-sm text-foreground">{status.database.provider}</p>
                <span className="inline-flex items-center text-[10px] text-emerald-600 font-medium">
                  ● Connected &amp; Synced
                </span>
              </div>

              <div className="p-3 rounded-xl border border-border/70 bg-card space-y-1">
                <p className="text-[11px] text-muted-foreground">Platform Engine</p>
                <p className="font-bold text-sm text-foreground">v{status.environment.platformVersion}</p>
                <span className="text-[10px] text-muted-foreground">
                  Node: {status.environment.nodeEnv}
                </span>
              </div>
            </div>

            {/* Counts breakdown */}
            <div className="p-3 rounded-xl border border-border/70 bg-muted/20 space-y-2">
              <p className="font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">
                Cluster Entity Counts
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-card p-2 rounded-lg border border-border/50">
                  <p className="text-xs font-bold text-foreground">{status.counts.tenants}</p>
                  <p className="text-[10px] text-muted-foreground">Mahalles</p>
                </div>
                <div className="bg-card p-2 rounded-lg border border-border/50">
                  <p className="text-xs font-bold text-foreground">{status.counts.users}</p>
                  <p className="text-[10px] text-muted-foreground">Users</p>
                </div>
                <div className="bg-card p-2 rounded-lg border border-border/50">
                  <p className="text-xs font-bold text-foreground">{status.counts.members}</p>
                  <p className="text-[10px] text-muted-foreground">Members</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] pt-1 text-muted-foreground">
                <span>Active Refresh Sessions:</span>
                <span className="font-mono font-semibold text-foreground">{status.counts.activeSessions}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-muted-foreground">
                <span>Immutable Audit Logs:</span>
                <span className="font-mono font-semibold text-foreground">{status.counts.auditLogs}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {lastChecked ? `Checked ${lastChecked.toLocaleTimeString()}` : ""}
              </span>
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={fetchStatus} isLoading={isLoading}>
                Re-check
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-destructive">
            Could not retrieve system telemetry.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
