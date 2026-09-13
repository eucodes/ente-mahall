"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Badge,
  Building,
  Button,
  Checkbox,
  ConfirmDialog,
  Download,
  DropdownMenu,
  EmptyState,
  FormField,
  Input,
  MoreVertical,
  Plus,
  Search,
  Select,
  ShieldCheck,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Users,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import { ROOT_DOMAIN } from "@/lib/env";
import type { PlatformTenant } from "@/lib/platform";
import { ProvisionTenantDialog } from "./provision-tenant-dialog";

const BULK_DELETE_CONFIRM_TEXT = "DELETE";

type StatusFilter = "all" | "active" | "suspended";
type SortOption = "newest" | "oldest" | "name" | "members";

export function TenantsTable({ tenants }: { tenants: PlatformTenant[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [districtFilter, setDistrictFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [provisionOpen, setProvisionOpen] = useState(false);

  // Extract unique districts from tenants list
  const districts = useMemo(() => {
    const set = new Set<string>();
    for (const t of tenants) {
      if (t.district) set.add(t.district);
    }
    return Array.from(set).sort();
  }, [tenants]);

  const filtered = useMemo(() => {
    return tenants
      .filter((tenant) => {
        if (statusFilter === "active" && !tenant.isActive) return false;
        if (statusFilter === "suspended" && tenant.isActive) return false;
        if (districtFilter !== "all" && tenant.district !== districtFilter) return false;
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          const matchName = tenant.name.toLowerCase().includes(q);
          const matchSlug = tenant.slug.toLowerCase().includes(q);
          const matchDistrict = tenant.district?.toLowerCase().includes(q);
          const matchPlace = tenant.place?.toLowerCase().includes(q);
          if (!matchName && !matchSlug && !matchDistrict && !matchPlace) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "members") return b.memberCount - a.memberCount;
        return 0;
      });
  }, [tenants, statusFilter, districtFilter, search, sortBy]);

  const allSelected = filtered.length > 0 && filtered.every((t) => selected.has(t.id));

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(filtered.map((t) => t.id)));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleToggleStatus(tenantId: string, currentActive: boolean) {
    try {
      await apiClient.patch(`/platform/tenants/${tenantId}/status`, { isActive: !currentActive });
      toast({
        title: currentActive ? "Mahalle Suspended" : "Mahalle Reactivated",
        description: `Status updated successfully.`,
        variant: "success"
      });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to update status";
      toast({ title: "Status Update Failed", description: message, variant: "destructive" });
    }
  }

  async function handleBulkDelete() {
    setIsDeleting(true);
    try {
      const { deleted, skipped } = await apiClient.post<{ deleted: string[]; skipped: string[] }>(
        "/platform/tenants/bulk-delete",
        { tenantIds: Array.from(selected) }
      );
      toast({
        title: `Deleted ${deleted.length} Mahalle${deleted.length === 1 ? "" : "s"}`,
        description: skipped.length > 0 ? `${skipped.length} were already gone and were skipped.` : undefined,
        variant: "success"
      });
      setSelected(new Set());
      setConfirmOpen(false);
      setConfirmText("");
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong.";
      toast({ title: "Couldn't delete the selected Mahalles", description: message, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  }

  function exportCSV() {
    const headers = ["Name", "Slug", "District", "State", "Status", "Members", "Families", "Admins", "Created At"];
    const rows = filtered.map((t) => [
      `"${t.name.replace(/"/g, '""')}"`,
      t.slug,
      `"${t.district ?? ""}"`,
      `"${t.state ?? ""}"`,
      t.isActive ? "Active" : "Suspended",
      t.memberCount,
      t.familyCount,
      t.adminCount,
      new Date(t.createdAt).toISOString().split("T")[0]
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mahalles_fleet_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const activeCount = tenants.filter((t) => t.isActive).length;
  const suspendedCount = tenants.length - activeCount;
  const totalMembers = tenants.reduce((sum, t) => sum + t.memberCount, 0);

  return (
    <div className="space-y-4">
      {/* Top telemetry pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-[11px] text-muted-foreground font-medium">Total Fleet</p>
          <p className="text-xl font-bold text-foreground mt-0.5">{tenants.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-[11px] text-emerald-600 font-medium">Active Instances</p>
          <p className="text-xl font-bold text-emerald-600 mt-0.5">{activeCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-[11px] text-rose-500 font-medium">Suspended</p>
          <p className="text-xl font-bold text-rose-500 mt-0.5">{suspendedCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-[11px] text-muted-foreground font-medium">Total Members</p>
          <p className="text-xl font-bold text-foreground mt-0.5">{totalMembers.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Selected bar */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-2.5">
          <p className="text-xs font-semibold text-destructive">
            {selected.size} Mahalle{selected.size === 1 ? "" : "s"} selected
          </p>
          <Button size="sm" variant="destructive" onClick={() => setConfirmOpen(true)}>
            Delete selected
          </Button>
        </div>
      )}

      {/* Action and Filter Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, slug, district, or place…"
              className="pl-9 text-xs"
            />
          </div>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="sm:w-36 text-xs"
          >
            <option value="all">All statuses</option>
            <option value="active">Active only</option>
            <option value="suspended">Suspended only</option>
          </Select>

          {districts.length > 0 && (
            <Select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="sm:w-36 text-xs"
            >
              <option value="all">All districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          )}

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="sm:w-40 text-xs"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name">Name (A-Z)</option>
            <option value="members">Members (High-Low)</option>
          </Select>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" variant="outline" onClick={exportCSV} className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </Button>
          <Button size="sm" onClick={() => setProvisionOpen(true)} className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            <span>Provision Mahalle</span>
          </Button>
        </div>
      </div>

      {/* Fleet Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No Mahalles match your filters"
          description="Try broadening your search term or clearing the status filter."
        />
      ) : (
        <div className="rounded-2xl border border-border/80 overflow-hidden bg-card shadow-xs">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-10">
                  <Checkbox checked={allSelected} onChange={toggleAll} aria-label="Select all Mahalles" />
                </TableHead>
                <TableHead>Mahalle &amp; Host</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Members / Families</TableHead>
                <TableHead>Admins</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((tenant) => {
                const tenantHost = `http://${tenant.slug}.${ROOT_DOMAIN}`;
                return (
                  <TableRow key={tenant.id} className="hover:bg-muted/30">
                    <TableCell>
                      <Checkbox
                        checked={selected.has(tenant.id)}
                        onChange={() => toggleOne(tenant.id)}
                        aria-label={`Select ${tenant.name}`}
                      />
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/20 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                          {tenant.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/tenants/${tenant.id}`}
                            className="font-semibold text-xs text-foreground hover:text-primary hover:underline block truncate"
                          >
                            {tenant.name}
                          </Link>
                          <span className="text-[11px] text-muted-foreground font-mono block truncate">
                            {tenant.slug}.{ROOT_DOMAIN}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {tenant.district ? (
                        <span>
                          {tenant.place ? `${tenant.place}, ` : ""}
                          <span className="text-foreground font-medium">{tenant.district}</span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground/60">—</span>
                      )}
                    </TableCell>

                    <TableCell className="text-xs">
                      <span className="font-semibold text-foreground">{tenant.memberCount}</span>
                      <span className="text-muted-foreground text-[11px] ml-1">
                        / {tenant.familyCount} fam
                      </span>
                    </TableCell>

                    <TableCell className="text-xs">
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {tenant.adminCount} staff
                      </Badge>
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {new Date(tenant.createdAt).toLocaleDateString([], {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={tenant.isActive ? "success" : "outline"}
                        className="text-[10px] gap-1"
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            tenant.isActive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
                          }`}
                        />
                        {tenant.isActive ? "Active" : "Suspended"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/tenants/${tenant.id}`}
                          className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                        >
                          Inspect
                        </Link>

                        <DropdownMenu
                          align="right"
                          trigger={
                            <button
                              type="button"
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </button>
                          }
                          items={[
                            {
                              label: "Inspect Mahalle",
                              onClick: () => router.push(`/tenants/${tenant.id}`)
                            },
                            {
                              label: "Open Portal",
                              icon: <ArrowUpRight className="h-3.5 w-3.5" />,
                              onClick: () => window.open(tenantHost, "_blank")
                            },
                            {
                              label: tenant.isActive ? "Suspend Mahalle" : "Reactivate Mahalle",
                              onClick: () => handleToggleStatus(tenant.id, tenant.isActive)
                            }
                          ]}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setConfirmText("");
        }}
        title={`Permanently delete ${selected.size} Mahalle${selected.size === 1 ? "" : "s"}?`}
        description={
          <div className="space-y-3">
            <p>
              This cascades to every member, family, event, announcement, program, and
              administrator in each selected Mahalle. This cannot be undone.
            </p>
            <FormField label={`Type "${BULK_DELETE_CONFIRM_TEXT}" to confirm`} htmlFor="bulk-delete-confirm">
              <Input
                id="bulk-delete-confirm"
                autoComplete="off"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </FormField>
          </div>
        }
        confirmLabel="Delete permanently"
        destructive
        isConfirming={isDeleting}
        confirmDisabled={confirmText !== BULK_DELETE_CONFIRM_TEXT}
        onConfirm={handleBulkDelete}
      />

      {/* Provision Dialog */}
      <ProvisionTenantDialog open={provisionOpen} onOpenChange={setProvisionOpen} />
    </div>
  );
}
