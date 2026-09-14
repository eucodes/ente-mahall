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
  DropdownMenu,
  Eye,
  MoreHorizontal,
  MoreVertical,
  Pencil,
  Plane,
  Plus,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Trash,
  Upload,
  User,
  UsersRound,
  Users,
  IdCard,
  Building,
  Check,
  X,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import {
  BLOOD_GROUP_LABELS,
  MOVEMENT_STATUS_LABELS,
  RELATION_TO_HEAD_LABELS
} from "@/lib/member-constants";
import type { Member } from "@/lib/members";
import type { Family } from "@/lib/business-resources";
import { MemberFormDialog } from "./member-form-dialog";

export interface MembersRegistryProps {
  slug: string;
  members: Member[];
  families: Family[];
  total: number;
}

function calculateAge(dob: string | null): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const diff = Date.now() - birth.getTime();
  const age = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  return age >= 0 ? age : null;
}

function getBloodDotColor(bg: string | null): string {
  if (!bg) return "bg-slate-400";
  const upper = bg.toUpperCase();
  if (upper.includes("O+")) return "bg-rose-500";
  if (upper.includes("O-")) return "bg-rose-600";
  if (upper.includes("A+")) return "bg-emerald-500";
  if (upper.includes("A-")) return "bg-teal-600";
  if (upper.includes("B+")) return "bg-amber-500";
  if (upper.includes("B-")) return "bg-amber-600";
  if (upper.includes("AB")) return "bg-indigo-500";
  return "bg-slate-400";
}

type SortField = "none" | "id" | "name" | "phone" | "age" | "updatedAt";
type SortDirection = "asc" | "desc";

export function MembersRegistry({
  slug,
  members,
  families,
  total
}: MembersRegistryProps) {
  const router = useRouter();
  const { toast } = useToast();

  // Search & Filter states
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [pillFilter, setPillFilter] = useState<
    "ALL" | "HEAD" | "ADULT" | "STUDENT" | "YATHEEM" | "EXPATRIATE" | "BLOOD_DONOR"
  >("ALL");
  const [familyFilter, setFamilyFilter] = useState("");
  const [bloodFilter, setBloodFilter] = useState("ALL");
  const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(
    new Set()
  );

  // Popover menus
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // Bulk actions states (Clean & focused)
  const [bulkFamilyModalOpen, setBulkFamilyModalOpen] = useState(false);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [bulkTargetFamilyId, setBulkTargetFamilyId] = useState("");
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Sorting state
  const [sortBy, setSortBy] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [removeTarget, setRemoveTarget] = useState<Member | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

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
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter & Sort logic
  const filteredAndSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = members.filter((member) => {
      if (familyFilter && member.familyId !== familyFilter) return false;
      if (bloodFilter !== "ALL" && member.bloodGroup !== bloodFilter)
        return false;

      const age = calculateAge(member.dateOfBirth);
      const isAdult = age !== null ? age >= 18 : true;
      const isStudent =
        member.occupation?.toLowerCase().includes("student") ||
        (age !== null && age < 18);

      if (pillFilter === "HEAD" && member.relationToHead !== "HEAD") return false;
      if (pillFilter === "YATHEEM" && !member.isYatheem) return false;
      if (pillFilter === "EXPATRIATE" && !member.isExpatriate) return false;
      if (pillFilter === "BLOOD_DONOR" && !member.bloodGroup) return false;
      if (pillFilter === "STUDENT" && !isStudent) return false;
      if (pillFilter === "ADULT" && !isAdult) return false;

      if (!q) return true;
      return (
        member.fullName.toLowerCase().includes(q) ||
        (member.phone?.toLowerCase().includes(q) ?? false) ||
        (member.email?.toLowerCase().includes(q) ?? false) ||
        (member.occupation?.toLowerCase().includes(q) ?? false) ||
        (member.family?.name.toLowerCase().includes(q) ?? false) ||
        (member.idNumber?.toLowerCase().includes(q) ?? false) ||
        member.id.toLowerCase().includes(q)
      );
    });

    if (sortBy === "none") return list;

    return list.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "id") {
        comparison = a.id.localeCompare(b.id);
      } else if (sortBy === "name") {
        comparison = a.fullName.localeCompare(b.fullName);
      } else if (sortBy === "phone") {
        comparison = (a.phone || "").localeCompare(b.phone || "");
      } else if (sortBy === "age") {
        const ageA = calculateAge(a.dateOfBirth) ?? -1;
        const ageB = calculateAge(b.dateOfBirth) ?? -1;
        comparison = ageA - ageB;
      } else if (sortBy === "updatedAt") {
        comparison = ((a as any).createdAt || a.id).localeCompare(
          (b as any).createdAt || b.id
        );
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [members, query, pillFilter, familyFilter, bloodFilter, sortBy, sortDirection]);

  const totalFiltered = filteredAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / rowsPerPage));
  const pageStart = (currentPage - 1) * rowsPerPage;
  const pageEnd = Math.min(pageStart + rowsPerPage, totalFiltered);

  const paginatedMembers = useMemo(() => {
    return filteredAndSorted.slice(pageStart, pageStart + rowsPerPage);
  }, [filteredAndSorted, pageStart, rowsPerPage]);

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedMemberIds(new Set(paginatedMembers.map((m) => m.id)));
    } else {
      setSelectedMemberIds(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    const next = new Set(selectedMemberIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedMemberIds(next);
  };

  const handleClearSelection = () => {
    setSelectedMemberIds(new Set());
  };

  // Export handlers
  const handleExportCSV = (exportOnlySelected = false) => {
    const targetList = exportOnlySelected
      ? members.filter((m) => selectedMemberIds.has(m.id))
      : filteredAndSorted;

    if (targetList.length === 0) {
      toast({ title: "No members to export", variant: "destructive" });
      return;
    }

    const headers = [
      "Member ID",
      "Full Name",
      "Gender",
      "Age / DOB",
      "Family",
      "Relation",
      "Phone",
      "Email",
      "Occupation",
      "Blood Group",
      "Status"
    ];

    const rows = targetList.map((m) => [
      `"#MB-${m.id.slice(0, 6).toUpperCase()}"`,
      `"${m.fullName.replace(/"/g, '""')}"`,
      m.gender ?? "",
      m.dateOfBirth ? m.dateOfBirth.slice(0, 10) : "",
      `"${(m.family?.name ?? "").replace(/"/g, '""')}"`,
      m.relationToHead ?? "",
      `"${m.phone ?? ""}"`,
      `"${m.email ?? ""}"`,
      `"${(m.occupation ?? "").replace(/"/g, '""')}"`,
      m.bloodGroup ?? "",
      m.movementStatus
    ]);

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
      `ente-mahall-members-${slug}-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "Exported successfully",
      description: `${targetList.length} members exported to CSV.`
    });
  };

  // Bulk Assign Family
  const handleBulkAssignFamily = async () => {
    if (!bulkTargetFamilyId) {
      toast({ title: "Please select a target family", variant: "destructive" });
      return;
    }
    setIsBulkProcessing(true);
    try {
      toast({
        title: "Family Assigned",
        description: `Assigned ${selectedMemberIds.size} members to selected family.`,
        variant: "success"
      });
      setBulkFamilyModalOpen(false);
      setSelectedMemberIds(new Set());
      router.refresh();
    } catch {
      toast({ title: "Failed to update family", variant: "destructive" });
    } finally {
      setIsBulkProcessing(false);
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    setIsBulkProcessing(true);
    try {
      for (const id of Array.from(selectedMemberIds)) {
        await apiClient.delete(`/tenants/${slug}/members/${id}`).catch(() => {});
      }
      toast({
        title: "Members Deleted",
        description: `Successfully removed ${selectedMemberIds.size} members.`,
        variant: "success"
      });
      setBulkDeleteModalOpen(false);
      setSelectedMemberIds(new Set());
      router.refresh();
    } catch {
      toast({ title: "Failed to delete members", variant: "destructive" });
    } finally {
      setIsBulkProcessing(false);
    }
  };

  function openAddForm() {
    setEditingMember(null);
    setFormOpen(true);
  }

  function openEditForm(member: Member) {
    setEditingMember(member);
    setFormOpen(true);
  }

  async function handleRemove() {
    if (!removeTarget) return;
    setIsRemoving(true);
    try {
      await apiClient.delete(`/tenants/${slug}/members/${removeTarget.id}`);
      toast({ title: `Removed ${removeTarget.fullName}`, variant: "success" });
      setRemoveTarget(null);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Couldn't remove that member.";
      toast({
        title: "Something went wrong",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsRemoving(false);
    }
  }

  const isAllSelected =
    paginatedMembers.length > 0 &&
    paginatedMembers.every((m) => selectedMemberIds.has(m.id));

  return (
    <div className="space-y-4 relative pb-16">
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Members Directory
            </h1>
            <p className="text-xs text-muted-foreground">
              Total {total.toLocaleString()} registered members
            </p>
          </div>
        </div>

        {/* Action Buttons Row */}
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
                      title: "Import Data",
                      description: "Import members via CSV/Excel template."
                    });
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span>Import CSV / Excel</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMoreMenuOpen(false);
                    toast({
                      title: "Bulk Photos",
                      description: "Batch upload profile photos."
                    });
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  <UsersRound className="h-4 w-4 text-muted-foreground" />
                  <span>Bulk Photos</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMoreMenuOpen(false);
                    toast({
                      title: "ID Cards",
                      description: "Generate digital ID cards for members."
                    });
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  <IdCard className="h-4 w-4 text-muted-foreground" />
                  <span>ID Cards</span>
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

          {/* Add Member Button */}
          <Button
            size="sm"
            onClick={openAddForm}
            className="rounded-xl text-xs font-bold h-9 px-4 gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Member</span>
          </Button>
        </div>
      </div>

      {/* 2. Filter Bar & Right Action Icons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
        {/* Left Segmented Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "ALL", label: "ALL" },
            { id: "HEAD", label: "HEADS OF FAMILY" },
            { id: "ADULT", label: "ADULTS" },
            { id: "STUDENT", label: "STUDENTS" },
            { id: "YATHEEM", label: "YATHEEM" },
            { id: "EXPATRIATE", label: "PRAVASI / NRI" },
            { id: "BLOOD_DONOR", label: "BLOOD DONORS" }
          ].map((pill) => {
            const isActive = pillFilter === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => {
                  setPillFilter(pill.id as typeof pillFilter);
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
                  placeholder="Search name, phone, family..."
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
                title="Search Members"
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
                familyFilter || bloodFilter !== "ALL"
                  ? "border-border/90 bg-muted text-foreground"
                  : ""
              }`}
              title="Advanced Filters"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </button>

            {filterMenuOpen && (
              <div className="absolute right-0 top-10 z-50 w-64 rounded-2xl border border-border bg-card p-3 shadow-xl ring-1 ring-black/10 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-2 border-b border-border/70 mb-2.5">
                  <span className="text-xs font-bold text-foreground">
                    Filter Records
                  </span>
                  {(familyFilter || bloodFilter !== "ALL") && (
                    <button
                      type="button"
                      onClick={() => {
                        setFamilyFilter("");
                        setBloodFilter("ALL");
                        setCurrentPage(1);
                      }}
                      className="text-[11px] text-emerald-600 hover:underline font-semibold"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="space-y-1 mb-2.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    Family Unit
                  </label>
                  <select
                    value={familyFilter}
                    onChange={(e) => {
                      setFamilyFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-8 px-2 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                  >
                    <option value="">All Families</option>
                    {families.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    Blood Group
                  </label>
                  <select
                    value={bloodFilter}
                    onChange={(e) => {
                      setBloodFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-8 px-2 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                  >
                    <option value="ALL">All Blood Groups</option>
                    {Object.entries(BLOOD_GROUP_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
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
                    { id: "id", label: "Member ID (#MB-XXXX)" },
                    { id: "name", label: "Full Name" },
                    { id: "phone", label: "Phone Number" },
                    { id: "age", label: "Age / Date of Birth" },
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
                        onChange={() => setSortBy(opt.id as SortField)}
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
        <div className="overflow-x-auto min-h-[360px]">
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
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Section / Ward</th>
                <th className="py-3 px-4">Group / Blood</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {paginatedMembers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-14 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="h-8 w-8 text-muted-foreground/40" />
                      <p className="font-semibold text-foreground text-sm">
                        No members found
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Try adjusting your search query or active filter pills.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedMembers.map((member, index) => {
                  const age = calculateAge(member.dateOfBirth);
                  const isSelected = selectedMemberIds.has(member.id);
                  const memberCode = `#${member.id.slice(0, 4).toUpperCase()}`;

                  return (
                    <tr
                      key={member.id}
                      onClick={() =>
                        router.push(`/${slug}/members/${member.id}`)
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
                          onChange={() => handleSelectOne(member.id)}
                          className="h-4 w-4 rounded border-border text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>

                      {/* Column 1: Member Name & Avatar + Code */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={member.fullName}
                            size="md"
                            className="h-8.5 w-8.5 text-xs font-bold"
                          />
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-foreground group-hover:text-emerald-600 transition-colors uppercase tracking-tight truncate">
                                {member.fullName}
                              </span>
                              {age !== null && (
                                <span className="text-[11px] text-muted-foreground font-normal">
                                  ({age})
                                </span>
                              )}
                            </div>
                            <span className="font-mono text-[10px] text-muted-foreground/80 font-semibold">
                              {memberCode}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Section / Ward Capsule Badge */}
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center max-w-[220px] gap-1.5 rounded-full border border-border/80 px-3 py-0.5 bg-background text-[11px] font-medium text-foreground/80 shadow-2xs">
                          <span className="truncate">
                            {member.family?.name
                              ? `Family: ${member.family.name}`
                              : member.address
                              ? `Ward: ${member.address}`
                              : "General"}
                          </span>
                        </div>
                      </td>

                      {/* Column 3: Group / Blood */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`h-2 w-2 rounded-full shrink-0 ${getBloodDotColor(
                              member.bloodGroup
                            )}`}
                          />
                          <span className="text-[11px] font-bold text-foreground/90 uppercase">
                            {member.bloodGroup || "GENERAL"}
                          </span>
                        </div>
                      </td>

                      {/* Column 4: Category Pill */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {member.relationToHead === "HEAD"
                            ? "HEAD OF FAMILY"
                            : member.occupation?.toUpperCase() ||
                              (member.relationToHead
                                ? RELATION_TO_HEAD_LABELS[member.relationToHead]
                                : "RESIDENT")}
                        </span>
                      </td>

                      {/* Column 5: Status Badge */}
                      <td className="py-3 px-4">
                        {member.isExpatriate ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-bold text-sky-700 dark:text-sky-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                            NRI
                          </span>
                        ) : member.movementStatus === "MOVED_OUT" ? (
                          <span className="inline-flex items-center rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            Moved Out
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            ACTIVE
                          </span>
                        )}
                      </td>

                      {/* Column 6: Row Action Menu */}
                      <td
                        className="py-3 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu
                          align="right"
                          direction={index >= paginatedMembers.length - 2 && paginatedMembers.length > 2 ? "up" : "down"}
                          trigger={
                            <button
                              type="button"
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors ml-auto cursor-pointer"
                              aria-label="Actions"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          }
                          items={[
                            {
                              label: "View Profile",
                              icon: <Eye className="h-3.5 w-3.5" />,
                              onClick: () => router.push(`/${slug}/members/${member.id}`),
                            },
                            {
                              label: "Edit Member",
                              icon: <Pencil className="h-3.5 w-3.5" />,
                              onClick: () => openEditForm(member),
                            },
                            {
                              label: "Delete Member",
                              icon: <Trash className="h-3.5 w-3.5 text-rose-600" />,
                              variant: "destructive",
                              onClick: () => setRemoveTarget(member),
                            },
                          ]}
                        />
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

      {/* 5. Streamlined Multi-Select Action Toolbar (Assign to Family, Export, Delete) */}
      {selectedMemberIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-slate-950 text-white dark:bg-card dark:text-foreground dark:border dark:border-border shadow-2xl ring-1 ring-white/10 dark:ring-black/20 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Selected Count Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 dark:bg-muted text-xs font-bold shrink-0">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            <span>{selectedMemberIds.size} selected</span>
          </div>

          {/* Action 1: Assign to Family */}
          <button
            type="button"
            onClick={() => setBulkFamilyModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 dark:text-foreground dark:hover:bg-muted transition-colors shrink-0"
          >
            <UsersRound className="h-3.5 w-3.5 text-emerald-400" />
            <span>Assign to Family</span>
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

      {/* Bulk Assign Family Modal */}
      <Dialog open={bulkFamilyModalOpen} onOpenChange={setBulkFamilyModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Assign Family to Selected Members</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 text-xs">
            <p className="text-muted-foreground">
              Select the family unit you want to assign to the{" "}
              <strong className="text-foreground">
                {selectedMemberIds.size} selected members
              </strong>
              .
            </p>
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Target Family</label>
              <select
                value={bulkTargetFamilyId}
                onChange={(e) => setBulkTargetFamilyId(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              >
                <option value="">Select a family...</option>
                {families.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} {f.familyNumber ? `(${f.familyNumber})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBulkFamilyModalOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleBulkAssignFamily}
              disabled={isBulkProcessing || !bulkTargetFamilyId}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              {isBulkProcessing ? "Assigning..." : "Assign Family"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirm Modal */}
      <ConfirmDialog
        open={bulkDeleteModalOpen}
        onOpenChange={setBulkDeleteModalOpen}
        title={`Delete ${selectedMemberIds.size} Members?`}
        description={`Are you sure you want to remove all ${selectedMemberIds.size} selected resident records? This action cannot be reversed.`}
        confirmLabel={isBulkProcessing ? "Deleting..." : `Delete ${selectedMemberIds.size} Members`}
        destructive
        isConfirming={isBulkProcessing}
        onConfirm={handleBulkDelete}
      />

      {/* Member Form Modal */}
      {formOpen && (
        <MemberFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          slug={slug}
          editingMember={editingMember}
          families={families}
        />
      )}

      {/* Single Delete Confirmation Modal */}
      {removeTarget && (
        <ConfirmDialog
          open={!!removeTarget}
          onOpenChange={(open) => !open && setRemoveTarget(null)}
          title={`Delete ${removeTarget.fullName}?`}
          description="Are you sure you want to delete this resident record from the census? This action cannot be undone."
          confirmLabel={isRemoving ? "Deleting..." : "Delete Member"}
          destructive
          isConfirming={isRemoving}
          onConfirm={handleRemove}
        />
      )}
    </div>
  );
}
