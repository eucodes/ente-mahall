"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Badge,
  Button,
  EmptyState,
  Input,
  Pencil,
  Search,
  Select,
  StatCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { House, HouseSummary } from "@/lib/houses";
import type { Division } from "@/lib/structure";
import { HouseFormDialog } from "./house-form-dialog";

export interface HousesRegistryProps {
  slug: string;
  houses: House[];
  divisions: Division[];
  summary: HouseSummary | null;
  suggestedNumber: string | null;
}

export function HousesRegistry({ slug, houses, divisions, summary, suggestedNumber }: HousesRegistryProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("active");
  const [formOpen, setFormOpen] = useState(false);
  const [editingHouse, setEditingHouse] = useState<House | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return houses.filter((house) => {
      if (statusFilter !== "all" && house.isActive !== (statusFilter === "active")) return false;
      if (divisionFilter && house.divisionId !== divisionFilter) return false;
      if (!q) return true;
      return (
        house.displayNumber.toLowerCase().includes(q) ||
        (house.name?.toLowerCase().includes(q) ?? false) ||
        (house.address?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [houses, query, divisionFilter, statusFilter]);

  function openAddForm() {
    setEditingHouse(null);
    setFormOpen(true);
  }

  function openEditForm(house: House) {
    setEditingHouse(house);
    setFormOpen(true);
  }

  async function handleToggleActive(house: House) {
    setBusyId(house.id);
    try {
      if (house.isActive) {
        await apiClient.delete(`/tenants/${slug}/houses/${house.id}`);
        toast({ title: `House ${house.displayNumber} deactivated`, variant: "success" });
      } else {
        await apiClient.patch(`/tenants/${slug}/houses/${house.id}/reactivate`, {});
        toast({ title: `House ${house.displayNumber} reactivated`, variant: "success" });
      }
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't update that house.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total houses" value={summary.totalHouses} tone="violet" />
          <StatCard label="Active" value={summary.activeHouses} tone="green" />
          <StatCard label="Inactive" value={summary.inactiveHouses} />
          {divisions.length > 0 && <StatCard label="Unassigned" value={summary.unassignedHouses} />}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          <Input
            leadingIcon={<Search />}
            placeholder="Search house number, name, address…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="sm:max-w-xs"
          />
          {divisions.length > 0 && (
            <Select value={divisionFilter} onChange={(e) => setDivisionFilter(e.target.value)} className="sm:max-w-[180px]">
              <option value="">All divisions</option>
              {divisions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>
          )}
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="sm:max-w-[140px]">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="all">All</option>
          </Select>
        </div>
        <Button onClick={openAddForm}>Add house</Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={houses.length === 0 ? "No houses have been registered yet." : "No houses match your search."}
          description={houses.length === 0 ? "Add your first house to begin building the Mahallu directory." : "Try a different search or filter."}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>House</TableHead>
                <TableHead>Division</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((house) => (
                <TableRow key={house.id}>
                  <TableCell>
                    <Link href={`/${slug}/houses/${house.id}`} className="font-medium text-primary hover:underline">
                      {house.displayNumber}
                    </Link>
                    {house.name && <p className="text-xs text-muted-foreground">{house.name}</p>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{house.division?.name ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{house.address ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={house.isActive ? "secondary" : "outline"}>{house.isActive ? "Active" : "Inactive"}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditForm(house)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" isLoading={busyId === house.id} onClick={() => handleToggleActive(house)}>
                        {house.isActive ? "Deactivate" : "Reactivate"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <HouseFormDialog
        slug={slug}
        open={formOpen}
        onOpenChange={setFormOpen}
        editingHouse={editingHouse}
        divisions={divisions}
        suggestedNumber={suggestedNumber}
      />
    </div>
  );
}
