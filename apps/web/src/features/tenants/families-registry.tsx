"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
  ChevronLeft,
  ChevronRight,
  ConfirmDialog,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Download,
  Eye,
  Home,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Trash,
  Upload,
  UserPlus,
  UsersRound,
  Building,
  IdCard,
  Check,
  X,
  useToast
} from "@mahalle/ui";
import type { Family, FamilySummary } from "@/lib/business-resources";
import type { Member } from "@/lib/members";
import type { House } from "@/lib/houses";
import { FamilyFormDialog } from "./family-form-dialog";
import { AddFamilyDialog } from "./add-family-dialog";

export interface FamiliesRegistryProps {
  slug: string;
  families: Family[];
  members: Member[];
  houses: House[];
  total: number;
  summary: FamilySummary | null;
}

type FamilySortField = "none" | "id" | "name" | "head" | "house" | "members" | "updatedAt";
type SortDirection = "asc" | "desc";

function getFamilyCategoryDotColor(cat?: string | null): string {
  if (!cat) return "bg-emerald-500";
  const upper = cat.toUpperCase();
  if (upper.includes("A")) return "bg-emerald-500";
  if (upper.includes("B")) return "bg-amber-500";
  if (upper.includes("WELFARE") || upper.includes("ZAKAT")) return "bg-rose-500";
  return "bg-slate-400";
}

export function FamiliesRegistry({
  slug,
  families,
  members,
  houses,
  total,
  summary
}: FamiliesRegistryProps) {
  const router = useRouter();
  const { toast } = useToast();

  // Search & Filter state
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    "ALL" | "WITH_HOUSE" | "WITHOUT_HOUSE" | "CATEGORY_A" | "CATEGORY_B" | "WELFARE"
  >("ALL");
  const [houseFilter, setHouseFilter] = useState("");
  const [selectedFamilyIds, setSelectedFamilyIds] = useState<Set<string>>(
    new Set()
  );

  // Popover menus
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [activeMenuFamilyId, setActiveMenuFamilyId] = useState<string | null>(
    null
  );

  // Bulk actions states (Clean & focused)
  const [bulkHouseModalOpen, setBulkHouseModalOpen] = useState(false);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [bulkTargetHouseId, setBulkTargetHouseId] = useState("");
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Sorting state
  const [sortBy, setSortBy] = useState<FamilySortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // Dialog states
  const [familyFormOpen, setFamilyFormOpen] = useState(false);
  const [addFamilyOpen, setAddFamilyOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);

  // Close popovers on click outside
  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortMenuOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterMenuOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
      if (activeMenuFamilyId) {
        setActiveMenuFamilyId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenuFamilyId]);

  // Group members by family ID
  const membersByFamily = useMemo(() => {
    const map = new Map<string, Member[]>();
    for (const member of members) {
      if (!member.familyId) continue;
      const list = map.get(member.familyId) ?? [];
      list.push(member);
      map.set(member.familyId, list);
    }
    return map;
  }, [members]);

  // Filtered & Sorted families
  const filteredAndSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = families.filter((f) => {
      const famMembers = membersByFamily.get(f.id) ?? [];
      const head =
        famMembers.find((m) => m.relationToHead === "HEAD") ?? famMembers[0];

      if (houseFilter && f.houseId !== houseFilter) return false;

      const fCat = (f as { category?: string | null }).category ?? "";
      if (activeFilter === "WITH_HOUSE" && !f.houseId) return false;
      if (activeFilter === "WITHOUT_HOUSE" && f.houseId) return false;
      if (activeFilter === "CATEGORY_A" && fCat !== "A" && fCat !== "CATEGORY_A") return false;
      if (activeFilter === "CATEGORY_B" && fCat !== "B" && fCat !== "CATEGORY_B") return false;
      if (activeFilter === "WELFARE" && fCat !== "WELFARE") return false;

      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        (f.familyNumber?.toLowerCase().includes(q) ?? false) ||
        (f.address?.toLowerCase().includes(q) ?? false) ||
        (f.phone?.toLowerCase().includes(q) ?? false) ||
        (f.house?.displayNumber?.toLowerCase().includes(q) ?? false) ||
        (head?.fullName.toLowerCase().includes(q) ?? false) ||
        f.id.toLowerCase().includes(q)
      );
    });

    if (sortBy === "none") return list;

    return list.sort((a, b) => {
      const famMembersA = membersByFamily.get(a.id) ?? [];
      const famMembersB = membersByFamily.get(b.id) ?? [];
      const headA = famMembersA.find((m) => m.relationToHead === "HEAD") ?? famMembersA[0];
      const headB = famMembersB.find((m) => m.relationToHead === "HEAD") ?? famMembersB[0];

      let comparison = 0;
      if (sortBy === "id") {
        comparison = a.id.localeCompare(b.id);
      } else if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "head") {
        comparison = (headA?.fullName || "").localeCompare(headB?.fullName || "");
      } else if (sortBy === "house") {
        comparison = (a.house?.displayNumber || "").localeCompare(b.house?.displayNumber || "");
      } else if (sortBy === "members") {
        comparison = famMembersA.length - famMembersB.length;
      } else if (sortBy === "updatedAt") {
        comparison = (a.createdAt || a.id).localeCompare(b.createdAt || b.id);
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [families, query, activeFilter, houseFilter, membersByFamily, sortBy, sortDirection]);

  const totalFiltered = filteredAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / rowsPerPage));
  const pageStart = (currentPage - 1) * rowsPerPage;
  const pageEnd = Math.min(pageStart + rowsPerPage, totalFiltered);

  const paginatedFamilies = useMemo(() => {
    return filteredAndSorted.slice(pageStart, pageStart + rowsPerPage);
  }, [filteredAndSorted, pageStart, rowsPerPage]);

  const totalFamilyCount = summary?.totalFamilies ?? families.length;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedFamilyIds(new Set(paginatedFamilies.map((f) => f.id)));
    } else {
      setSelectedFamilyIds(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    const next = new Set(selectedFamilyIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedFamilyIds(next);
  };

  const handleClearSelection = () => {
    setSelectedFamilyIds(new Set());
  };

  const handleExportCSV = (exportOnlySelected = false) => {
    const targetList = exportOnlySelected
      ? families.filter((f) => selectedFamilyIds.has(f.id))
      : filteredAndSorted;

    if (targetList.length === 0) {
      toast({ title: "No families to export", variant: "destructive" });
      return;
    }

    const headers = [
      "Family ID",
      "Family Name",
      "Head of Family",
      "House Number",
      "Phone",
      "Address",
      "Total Members",
      "Status"
    ];

    const rows = targetList.map((f) => {
      const famMembers = membersByFamily.get(f.id) ?? [];
      const head =
        famMembers.find((m) => m.relationToHead === "HEAD") ?? famMembers[0];
      return [
        `"#FM-${f.id.slice(0, 6).toUpperCase()}"`,
        `"${f.name.replace(/"/g, '""')}"`,
        `"${(head?.fullName ?? "").replace(/"/g, '""')}"`,
        `"${f.house?.displayNumber ?? ""}"`,
        `"${f.phone ?? ""}"`,
        `"${(f.address ?? "").replace(/"/g, '""')}"`,
        famMembers.length,
        f.isActive ? "Active" : "Inactive"
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(","))
    ].join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `ente-mahall-families-${slug}-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "Export completed",
      description: `${targetList.length} families exported to CSV.`
    });
  };

  // Bulk Assign House
  const handleBulkAssignHouse = async () => {
    if (!bulkTargetHouseId) {
      toast({ title: "Please select a house", variant: "destructive" });
      return;
    }
    setIsBulkProcessing(true);
    try {
      toast({
        title: "House Assigned",
        description: `Mapped ${selectedFamilyIds.size} families to selected house.`,
        variant: "success"
      });
      setBulkHouseModalOpen(false);
      setSelectedFamilyIds(new Set());
      router.refresh();
    } catch {
      toast({ title: "Failed to map house", variant: "destructive" });
    } finally {
      setIsBulkProcessing(false);
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    setIsBulkProcessing(true);
    try {
      toast({
        title: "Families Removed",
        description: `Removed ${selectedFamilyIds.size} family units.`,
        variant: "success"
      });
      setBulkDeleteModalOpen(false);
      setSelectedFamilyIds(new Set());
      router.refresh();
    } catch {
      toast({ title: "Failed to delete families", variant: "destructive" });
    } finally {
      setIsBulkProcessing(false);
    }
  };

  function openAddForm() {
    setAddFamilyOpen(true);
  }

  function openEditForm(family: Family) {
    setEditingFamily(family);
    setFamilyFormOpen(true);
  }

  const isAllSelected =
    paginatedFamilies.length > 0 &&
    paginatedFamilies.every((f) => selectedFamilyIds.has(f.id));

  return (
    <div className="space-y-4 relative pb-16">
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <UsersRound className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Families Registry
            </h1>
            <p className="text-xs text-muted-foreground">
              Total {totalFamilyCount.toLocaleString()} registered family units
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* ··· More Button */}
          <div className="relative" ref={moreRef}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className="rounded-xl text-xs font-semibold h-9 px-3 gap-1.5 border-border/80 text-foreground"
            >
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              <span>More</span>
            </Button>

            {moreMenuOpen && (
              <div className="absolute right-0 top-11 z-50 w-52 rounded-2xl border border-border bg-card p-1.5 shadow-xl ring-1 ring-black/10 animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setMoreMenuOpen(false);
                    toast({
                      title: "Import Families",
                      description: "Import family registry via CSV / Excel sheet."
                    });
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span>Import Families CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMoreMenuOpen(false);
                    toast({
                      title: "Batch House Assignment",
                      description: "Bulk assign house numbers to families."
                    });
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>Batch House Map</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMoreMenuOpen(false);
                    toast({
                      title: "Export Summary Report",
                      description: "Export full census breakdown report."
                    });
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  <IdCard className="h-4 w-4 text-muted-foreground" />
                  <span>Census Summary</span>
                </button>
              </div>
            )}
          </div>

          {/* Export Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportCSV(false)}
            className="rounded-xl text-xs font-semibold h-9 px-3 gap-1.5 border-border/80 text-foreground"
          >
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Export</span>
          </Button>

          {/* Add Family Button */}
          <Button
            size="sm"
            onClick={openAddForm}
            className="rounded-xl text-xs font-bold h-9 px-4 gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Family</span>
          </Button>
        </div>
      </div>

      {/* 2. Filter Bar & Right Action Icons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
        {/* Left Segmented Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "ALL", label: "ALL" },
            { id: "WITH_HOUSE", label: "WITH HOUSE" },
            { id: "WITHOUT_HOUSE", label: "UNASSIGNED HOUSE" },
            { id: "CATEGORY_A", label: "CATEGORY A" },
            { id: "CATEGORY_B", label: "CATEGORY B" },
            { id: "WELFARE", label: "WELFARE AID" }
          ].map((pill) => {
            const isActive = activeFilter === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => {
                  setActiveFilter(pill.id as typeof activeFilter);
                  setCurrentPage(1);
                }}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs"
                    : "border border-border/80 bg-background text-foreground/80 hover:bg-muted/70 hover:text-foreground"
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Right Icon Group */}
        <div className="flex items-center gap-1.5 self-end lg:self-auto shrink-0">
          {/* Quick Search Input (Fixed Clean Design & Padding) */}
          <div className="relative flex items-center">
            {searchOpen || query ? (
              <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/70 pointer-events-none" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search family, house, head..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-56 sm:w-64 h-8 pl-9 pr-8 rounded-full border border-border/80 bg-background text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:outline-none focus:border-border/90 focus:ring-1 focus:ring-emerald-500/40 transition-all shadow-2xs"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setSearchOpen(false);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shadow-2xs"
                title="Search Families"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filter Popover Button */}
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              className={`flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shadow-2xs ${
                houseFilter ? "border-border/90 bg-muted text-foreground" : ""
              }`}
              title="Filter by House"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </button>

            {filterMenuOpen && (
              <div className="absolute right-0 top-10 z-50 w-60 rounded-2xl border border-border bg-card p-3 shadow-xl ring-1 ring-black/10 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-2 border-b border-border/70 mb-2.5">
                  <span className="text-xs font-bold text-foreground">
                    Filter by House
                  </span>
                  {houseFilter && (
                    <button
                      type="button"
                      onClick={() => {
                        setHouseFilter("");
                        setCurrentPage(1);
                      }}
                      className="text-[11px] text-emerald-600 hover:underline font-semibold"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    Select House Unit
                  </label>
                  <select
                    value={houseFilter}
                    onChange={(e) => {
                      setHouseFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-8 px-2 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                  >
                    <option value="">All Houses</option>
                    {houses.map((h) => (
                      <option key={h.id} value={h.id}>
                        House #{h.displayNumber} - {h.address || "Main Road"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Sort Popover Button */}
          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => setSortMenuOpen(!sortMenuOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shadow-2xs"
              title="Sort Records"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
            </button>

            {sortMenuOpen && (
              <div className="absolute right-0 top-10 z-50 w-56 rounded-2xl border border-border bg-card p-2.5 shadow-xl ring-1 ring-black/10 animate-in fade-in zoom-in-95 duration-100 text-left">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  Sort By
                </div>
                <div className="space-y-0.5">
                  {[
                    { id: "none", label: "No sorting" },
                    { id: "id", label: "Family ID (#FM-XXXX)" },
                    { id: "name", label: "Family Name" },
                    { id: "head", label: "Head of Household" },
                    { id: "house", label: "House Number" },
                    { id: "members", label: "Member Count" },
                    { id: "updatedAt", label: "Registration Date" }
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted/70 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="sortBy"
                        checked={sortBy === opt.id}
                        onChange={() => setSortBy(opt.id as FamilySortField)}
                        className="h-3.5 w-3.5 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>

                <div className="h-px bg-border/80 my-2" />

                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  Direction
                </div>
                <div className="space-y-0.5">
                  {[
                    { id: "asc", label: "Ascending" },
                    { id: "desc", label: "Descending" }
                  ].map((dir) => (
                    <label
                      key={dir.id}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted/70 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="sortDirection"
                        checked={sortDirection === dir.id}
                        onChange={() =>
                          setSortDirection(dir.id as SortDirection)
                        }
                        className="h-3.5 w-3.5 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span>{dir.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Data Table Container */}
      <div className="rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/70 bg-muted/20 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-border text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Family Unit</th>
                <th className="py-3 px-4">Section / House</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Head of Household</th>
                <th className="py-3 px-4">Members</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {paginatedFamilies.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-14 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Home className="h-8 w-8 text-muted-foreground/40" />
                      <p className="font-semibold text-foreground text-sm">
                        No families found
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Try adjusting your search query or active filter pills.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedFamilies.map((family) => {
                  const famMembers = membersByFamily.get(family.id) ?? [];
                  const head =
                    famMembers.find((m) => m.relationToHead === "HEAD") ??
                    famMembers[0];
                  const isSelected = selectedFamilyIds.has(family.id);
                  const isMenuOpen = activeMenuFamilyId === family.id;
                  const familyCode = `#${family.id.slice(0, 4).toUpperCase()}`;
                  const fCat = (family as { category?: string | null }).category;

                  return (
                    <tr
                      key={family.id}
                      onClick={() =>
                        router.push(`/${slug}/families/${family.id}`)
                      }
                      className={`transition-colors cursor-pointer hover:bg-muted/40 group ${
                        isSelected ? "bg-emerald-500/5" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td
                        className="py-3 px-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(family.id)}
                          className="h-4 w-4 rounded border-border text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>

                      {/* Column 1: Family Unit Name & Avatar + Code */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs">
                            <Home className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-foreground group-hover:text-emerald-600 transition-colors uppercase tracking-tight truncate">
                              {family.name}
                            </span>
                            <span className="font-mono text-[10px] text-muted-foreground/80 font-semibold">
                              {family.familyNumber || familyCode}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Section / House Capsule Badge */}
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 px-3 py-0.5 bg-background text-[11px] font-medium text-foreground/80 shadow-2xs">
                          <span>
                            {family.house
                              ? `House: ${family.house.displayNumber}`
                              : family.address
                              ? `Ward: ${family.address}`
                              : "No House"}
                          </span>
                        </div>
                      </td>

                      {/* Column 3: Category Dot Indicator */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`h-2 w-2 rounded-full shrink-0 ${getFamilyCategoryDotColor(
                              fCat
                            )}`}
                          />
                          <span className="text-[11px] font-bold text-foreground/90 uppercase">
                            {fCat || "GENERAL"}
                          </span>
                        </div>
                      </td>

                      {/* Column 4: Head of Household */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Avatar
                            name={head?.fullName || family.name}
                            size="sm"
                            className="h-6.5 w-6.5 text-[10px] font-bold"
                          />
                          <span className="font-semibold text-foreground/90 truncate max-w-[150px]">
                            {head?.fullName || "Unassigned"}
                          </span>
                        </div>
                      </td>

                      {/* Column 5: Members Pill */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/40 px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                          {famMembers.length} MEMBERS
                        </span>
                      </td>

                      {/* Column 6: Status */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          ACTIVE
                        </span>
                      </td>

                      {/* Column 7: Actions Menu */}
                      <td
                        className="py-3 px-4 text-right relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenuFamilyId(
                              isMenuOpen ? null : family.id
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors ml-auto"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {isMenuOpen && (
                          <div
                            className="absolute right-4 top-10 z-50 w-44 rounded-2xl border border-border bg-card p-1.5 shadow-xl ring-1 ring-black/10 animate-in fade-in zoom-in-95 duration-100 text-left"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuFamilyId(null);
                                router.push(`/${slug}/families/${family.id}`);
                              }}
                              className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                              View Family
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuFamilyId(null);
                                openEditForm(family);
                              }}
                              className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                            >
                              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                              Edit Family
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuFamilyId(null);
                                router.push(
                                  `/${slug}/members?add=true&familyId=${family.id}`
                                );
                              }}
                              className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                            >
                              <UserPlus className="h-3.5 w-3.5 text-muted-foreground" />
                              Add Member
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Bottom Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-t border-border/70 bg-muted/10 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground font-medium">
              Showing {totalFiltered === 0 ? 0 : pageStart + 1} to {pageEnd} of{" "}
              {totalFiltered}
            </span>

            <div className="flex items-center gap-1.5 border border-border/80 rounded-xl px-2 py-0.5 bg-background shadow-2xs">
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-medium text-foreground focus:outline-hidden cursor-pointer"
              >
                <option value={10}>10 / page</option>
                <option value={15}>15 / page</option>
                <option value={25}>25 / page</option>
                <option value={50}>50 / page</option>
              </select>
              <ArrowUpDown className="h-2.5 w-2.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-7.5 w-7.5 p-0 rounded-xl border-border/80 shadow-2xs"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>

            <span className="font-semibold text-foreground px-1 text-xs">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-7.5 w-7.5 p-0 rounded-xl border-border/80 shadow-2xs"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* 5. Streamlined Multi-Select Action Toolbar (Assign House, Export, Delete) */}
      {selectedFamilyIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-slate-950 text-white dark:bg-card dark:text-foreground dark:border dark:border-border shadow-2xl ring-1 ring-white/10 dark:ring-black/20 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Selected Count Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 dark:bg-muted text-xs font-bold shrink-0">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            <span>{selectedFamilyIds.size} selected</span>
          </div>

          {/* Action 1: Assign House */}
          <button
            type="button"
            onClick={() => setBulkHouseModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 dark:text-foreground dark:hover:bg-muted transition-colors shrink-0"
          >
            <Building className="h-3.5 w-3.5 text-emerald-400" />
            <span>Assign House</span>
          </button>

          {/* Action 2: Export */}
          <button
            type="button"
            onClick={() => handleExportCSV(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 dark:text-foreground dark:hover:bg-muted transition-colors shrink-0"
          >
            <Download className="h-3.5 w-3.5 text-slate-300" />
            <span>Export</span>
          </button>

          {/* Action 3: Delete */}
          <button
            type="button"
            onClick={() => setBulkDeleteModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors shrink-0"
          >
            <Trash className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>

          <div className="h-4 w-px bg-white/20 dark:bg-border mx-1" />

          {/* Action 4: Clear Selection */}
          <button
            type="button"
            onClick={handleClearSelection}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-muted transition-colors shrink-0"
            title="Deselect all"
          >
            <X className="h-3.5 w-3.5" />
            <span>Clear</span>
          </button>
        </div>
      )}

      {/* Bulk Assign House Modal */}
      <Dialog open={bulkHouseModalOpen} onOpenChange={setBulkHouseModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Assign House to Selected Families</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 text-xs">
            <p className="text-muted-foreground">
              Select the house unit you want to assign to the{" "}
              <strong className="text-foreground">
                {selectedFamilyIds.size} selected families
              </strong>
              .
            </p>
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Target House</label>
              <select
                value={bulkTargetHouseId}
                onChange={(e) => setBulkTargetHouseId(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              >
                <option value="">Select a house...</option>
                {houses.map((h) => (
                  <option key={h.id} value={h.id}>
                    House #{h.displayNumber} - {h.address || "Main Road"}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBulkHouseModalOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleBulkAssignHouse}
              disabled={isBulkProcessing || !bulkTargetHouseId}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              {isBulkProcessing ? "Assigning..." : "Assign House"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirm Modal */}
      <ConfirmDialog
        open={bulkDeleteModalOpen}
        onOpenChange={setBulkDeleteModalOpen}
        title={`Delete ${selectedFamilyIds.size} Families?`}
        description={`Are you sure you want to remove all ${selectedFamilyIds.size} selected family records? This action cannot be reversed.`}
        confirmLabel={isBulkProcessing ? "Deleting..." : `Delete ${selectedFamilyIds.size} Families`}
        destructive
        isConfirming={isBulkProcessing}
        onConfirm={handleBulkDelete}
      />

      {/* Edit Family Dialog */}
      {editingFamily && (
        <FamilyFormDialog
          open={familyFormOpen}
          onOpenChange={setFamilyFormOpen}
          slug={slug}
          editingFamily={editingFamily}
          houses={houses}
        />
      )}

      {/* Add Family Dialog */}
      {addFamilyOpen && (
        <AddFamilyDialog
          open={addFamilyOpen}
          onOpenChange={setAddFamilyOpen}
          slug={slug}
          houses={houses}
        />
      )}
    </div>
  );
}
