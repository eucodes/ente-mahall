"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Download,
  EmptyState,
  Input,
  Pagination,
  Search,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@mahalle/ui";
import type { AuditLogEntry, PlatformTenant } from "@/lib/platform";

const CATEGORIES = [
  { label: "All Actions", value: "all" },
  { label: "Platform Staff (platform.*)", value: "platform" },
  { label: "Mahalle Lifecycle (tenant.*)", value: "tenant" },
  { label: "Support Mode (support.*)", value: "platform.support" },
  { label: "Authentication (auth.*)", value: "auth" },
  { label: "Billing & Plans (billing.*)", value: "billing" }
];

interface AuditLogsExplorerProps {
  entries: AuditLogEntry[];
  total: number;
  page: number;
  pageSize: number;
  tenants: PlatformTenant[];
  currentSearch?: string;
  currentAction?: string;
  currentTenantId?: string;
}

export function AuditLogsExplorer({
  entries,
  total,
  page,
  pageSize,
  tenants,
  currentSearch = "",
  currentAction = "all",
  currentTenantId = "all"
}: AuditLogsExplorerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(currentSearch);
  const [actionCategory, setActionCategory] = useState(currentAction);
  const [selectedTenant, setSelectedTenant] = useState(currentTenantId);
  const [inspectEntry, setInspectEntry] = useState<AuditLogEntry | null>(null);

  function updateQuery(newParams: { search?: string; action?: string; tenantId?: string; page?: number }) {
    const p = new URLSearchParams(searchParams.toString());
    if (newParams.page !== undefined) p.set("page", newParams.page.toString());
    else p.set("page", "1");

    if (newParams.search !== undefined) {
      if (newParams.search.trim()) p.set("search", newParams.search.trim());
      else p.delete("search");
    }

    if (newParams.action !== undefined) {
      if (newParams.action && newParams.action !== "all") p.set("action", newParams.action);
      else p.delete("action");
    }

    if (newParams.tenantId !== undefined) {
      if (newParams.tenantId && newParams.tenantId !== "all") p.set("tenantId", newParams.tenantId);
      else p.delete("tenantId");
    }

    router.push(`/audit-logs?${p.toString()}`);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateQuery({ search });
  }

  function handleActionChange(val: string) {
    setActionCategory(val);
    updateQuery({ action: val });
  }

  function handleTenantChange(val: string) {
    setSelectedTenant(val);
    updateQuery({ tenantId: val });
  }

  function exportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `audit_log_export_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by action, actor email, IP address…"
              className="pl-9 text-xs"
            />
          </div>

          <Select
            value={actionCategory}
            onChange={(e) => handleActionChange(e.target.value)}
            className="sm:w-52 text-xs"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </Select>

          <Select
            value={selectedTenant}
            onChange={(e) => handleTenantChange(e.target.value)}
            className="sm:w-48 text-xs"
          >
            <option value="all">All Mahalles</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>

          <Button type="submit" size="sm" variant="outline" className="text-xs">
            Filter
          </Button>
        </form>

        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" variant="outline" onClick={exportJSON} className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" />
            <span>Export JSON</span>
          </Button>
        </div>
      </div>

      {/* Logs Table */}
      {entries.length === 0 ? (
        <EmptyState
          title="No audit log entries match your criteria"
          description="Try broadening your search term or resetting the category filter."
        />
      ) : (
        <div className="rounded-2xl border border-border/80 overflow-hidden bg-card shadow-xs">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Mahalle Scope</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead className="text-right">Payload</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-muted/30">
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground font-mono">
                    {new Date(entry.createdAt).toLocaleString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit"
                    })}
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {entry.action}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-xs">
                    {entry.actor ? (
                      <div>
                        <p className="font-semibold text-foreground">{entry.actor.fullName}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{entry.actor.email}</p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground font-mono text-[11px]">system</span>
                    )}
                  </TableCell>

                  <TableCell className="text-xs">
                    {entry.tenant ? (
                      <div>
                        <p className="font-medium text-foreground">{entry.tenant.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{entry.tenant.slug}</p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-[11px]">Global Platform</span>
                    )}
                  </TableCell>

                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {entry.ipAddress ?? "—"}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs"
                      onClick={() => setInspectEntry(entry)}
                    >
                      Inspect
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {total > pageSize && (
            <div className="p-3 border-t border-border/60">
              <Pagination
                page={page}
                pageSize={pageSize}
                total={total}
                hrefForPage={(p) => {
                  const query = new URLSearchParams(searchParams.toString());
                  query.set("page", p.toString());
                  return `/audit-logs?${query.toString()}`;
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Forensic Payload Inspector Modal */}
      {inspectEntry && (
        <Dialog open={!!inspectEntry} onOpenChange={(open) => !open && setInspectEntry(null)}>
          <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto sm:rounded-2xl border-border">
            <DialogHeader>
              <DialogTitle className="text-base font-mono text-xs">
                {inspectEntry.action}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Recorded {new Date(inspectEntry.createdAt).toLocaleString()} · ID: {inspectEntry.id}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/30 border border-border/60">
                <div>
                  <p className="text-muted-foreground text-[11px]">Actor</p>
                  <p className="font-semibold text-foreground">
                    {inspectEntry.actor?.fullName ?? "System"} ({inspectEntry.actor?.email ?? "system"})
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px]">Target Scope</p>
                  <p className="font-semibold text-foreground">
                    {inspectEntry.tenant ? `${inspectEntry.tenant.name} (${inspectEntry.tenant.slug})` : "Platform Wide"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px]">Client IP Address</p>
                  <p className="font-mono text-foreground">{inspectEntry.ipAddress ?? "Unknown"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px]">Target Type &amp; ID</p>
                  <p className="font-mono text-foreground">
                    {inspectEntry.targetType ?? "None"}: {inspectEntry.targetId ?? "—"}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-xs mb-1.5 text-foreground">Event Payload Metadata (JSON)</p>
                <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto border border-border/40">
                  {JSON.stringify(inspectEntry.metadata, null, 2)}
                </pre>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
