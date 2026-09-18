"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  FormField,
  Input,
  Pagination,
  PasswordInput,
  Select,
  StatCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToast,
  AlertTriangle,
  Building,
  CheckCircle2,
  KeyRound,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
  UserX,
  X
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { StatewideUser, PlatformTenant } from "@/lib/platform";

interface UsersManagementViewProps {
  initialUsers: StatewideUser[];
  tenants: PlatformTenant[];
}

export function UsersManagementView({ initialUsers, tenants }: UsersManagementViewProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("all");
  const [selectedTenantFilter, setSelectedTenantFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");

  // Selection state
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<StatewideUser | null>(null);
  const [roleUser, setRoleUser] = useState<StatewideUser | null>(null);
  const [membershipsUser, setMembershipsUser] = useState<StatewideUser | null>(null);
  const [passwordUser, setPasswordUser] = useState<StatewideUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<StatewideUser | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  // Form states for Create User
  const [createForm, setCreateForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    platformRole: "",
    tenantId: "",
    tenantRoleKey: "ADMIN"
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Form states for Edit User Profile
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: ""
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Form states for Platform Role
  const [platformRoleValue, setPlatformRoleValue] = useState<string>("");
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // Form states for Tenant Membership
  const [addTenantId, setAddTenantId] = useState("");
  const [addTenantRole, setAddTenantRole] = useState("ADMIN");
  const [isAddingMembership, setIsAddingMembership] = useState(false);
  const [removingTenantId, setRemovingTenantId] = useState<string | null>(null);

  // Form states for Password Reset
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terminateSessionsOnReset, setTerminateSessionsOnReset] = useState(true);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Deletion loading states
  const [isDeletingSingle, setIsDeletingSingle] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Action loading states
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedUserIds(new Set());
  }, [searchQuery, selectedRoleFilter, selectedTenantFilter, selectedStatusFilter]);

  // Filtered users calculation
  const filteredUsers = useMemo(() => {
    return initialUsers.filter((user) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = user.fullName.toLowerCase().includes(q);
        const matchEmail = user.email.toLowerCase().includes(q);
        const matchPhone = user.phone ? user.phone.toLowerCase().includes(q) : false;
        if (!matchName && !matchEmail && !matchPhone) return false;
      }

      // Status
      if (selectedStatusFilter === "active" && !user.isActive) return false;
      if (selectedStatusFilter === "inactive" && user.isActive) return false;

      // Tenant
      if (selectedTenantFilter !== "all") {
        const hasTenant = user.tenants.some((tm) => tm.id === selectedTenantFilter);
        if (!hasTenant) return false;
      }

      // Role filter
      if (selectedRoleFilter !== "all") {
        if (selectedRoleFilter === "superadmin") {
          if (user.platformRole !== "SUPER_ADMIN") return false;
        } else if (selectedRoleFilter === "staff") {
          if (
            user.platformRole !== "PLATFORM_STAFF" &&
            user.platformRole !== "PLATFORM_SUPPORT"
          ) {
            return false;
          }
        } else if (selectedRoleFilter === "owner") {
          const isOwner = user.tenants.some((tm) => tm.roleKey === "OWNER");
          if (!isOwner) return false;
        } else if (selectedRoleFilter === "admin") {
          const isAdmin = user.tenants.some(
            (tm) => tm.roleKey === "ADMIN" || tm.roleKey === "OWNER"
          );
          if (!isAdmin) return false;
        } else if (selectedRoleFilter === "member") {
          const isMember = user.tenants.some(
            (tm) => tm.roleKey !== "ADMIN" && tm.roleKey !== "OWNER"
          );
          if (!isMember) return false;
        }
      }

      return true;
    });
  }, [initialUsers, searchQuery, selectedRoleFilter, selectedTenantFilter, selectedStatusFilter]);

  // Paginated users
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Multiselect helper checks
  const isAllCurrentPageSelected = useMemo(() => {
    if (paginatedUsers.length === 0) return false;
    return paginatedUsers.every((u) => selectedUserIds.has(u.id));
  }, [paginatedUsers, selectedUserIds]);

  function handleToggleSelectAll() {
    const next = new Set(selectedUserIds);
    if (isAllCurrentPageSelected) {
      paginatedUsers.forEach((u) => next.delete(u.id));
    } else {
      paginatedUsers.forEach((u) => next.add(u.id));
    }
    setSelectedUserIds(next);
  }

  function handleToggleSelectUser(userId: string) {
    const next = new Set(selectedUserIds);
    if (next.has(userId)) {
      next.delete(userId);
    } else {
      next.add(userId);
    }
    setSelectedUserIds(next);
  }

  // Summary counts
  const stats = useMemo(() => {
    const total = initialUsers.length;
    const active = initialUsers.filter((u) => u.isActive).length;
    const superadmins = initialUsers.filter((u) => u.platformRole === "SUPER_ADMIN").length;
    const mahalAdmins = initialUsers.filter((u) =>
      u.tenants.some((tm) => tm.roleKey === "OWNER" || tm.roleKey === "ADMIN")
    ).length;
    const suspended = total - active;

    return { total, active, superadmins, mahalAdmins, suspended };
  }, [initialUsers]);

  // Handler: Create User
  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);
    setIsCreating(true);

    try {
      await apiClient.post("/platform/all-users", {
        fullName: createForm.fullName,
        email: createForm.email,
        password: createForm.password,
        phone: createForm.phone || undefined,
        platformRole: createForm.platformRole || undefined,
        tenantId: createForm.tenantId || undefined,
        tenantRoleKey: createForm.tenantId ? createForm.tenantRoleKey : undefined
      });

      toast({ title: "User created successfully", variant: "success" });
      setIsCreateOpen(false);
      setCreateForm({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        platformRole: "",
        tenantId: "",
        tenantRoleKey: "ADMIN"
      });
      router.refresh();
    } catch (err) {
      setCreateError(err instanceof ApiError ? err.message : "Failed to create user");
    } finally {
      setIsCreating(false);
    }
  }

  // Handler: Open Edit Profile Dialog
  function openEditModal(user: StatewideUser) {
    setEditingUser(user);
    setEditForm({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || ""
    });
    setEditError(null);
  }

  // Handler: Save Edit Profile
  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!editingUser) return;
    setEditError(null);
    setIsUpdating(true);

    try {
      await apiClient.patch(`/platform/all-users/${editingUser.id}`, {
        fullName: editForm.fullName,
        email: editForm.email,
        phone: editForm.phone || null
      });

      toast({ title: "User profile updated", variant: "success" });
      setEditingUser(null);
      router.refresh();
    } catch (err) {
      setEditError(err instanceof ApiError ? err.message : "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  }

  // Handler: Open Platform Role Dialog
  function openRoleModal(user: StatewideUser) {
    setRoleUser(user);
    setPlatformRoleValue(user.platformRole || "NONE");
  }

  // Handler: Save Platform Role
  async function handleSavePlatformRole() {
    if (!roleUser) return;
    setIsUpdatingRole(true);
    try {
      const roleToSend = platformRoleValue === "NONE" ? null : platformRoleValue;
      await apiClient.post(`/platform/all-users/${roleUser.id}/platform-role`, {
        role: roleToSend
      });

      toast({ title: "Platform access role updated", variant: "success" });
      setRoleUser(null);
      router.refresh();
    } catch (err) {
      toast({
        title: "Role update failed",
        description: err instanceof ApiError ? err.message : "Could not update platform role",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingRole(false);
    }
  }

  // Handler: Add Tenant Membership
  async function handleAddTenantMembership() {
    if (!membershipsUser || !addTenantId) return;
    setIsAddingMembership(true);
    try {
      await apiClient.post(`/platform/all-users/${membershipsUser.id}/tenants`, {
        tenantId: addTenantId,
        roleKey: addTenantRole
      });

      toast({ title: "Assigned to Mahalle", variant: "success" });
      setAddTenantId("");
      setMembershipsUser(null);
      router.refresh();
    } catch (err) {
      toast({
        title: "Assignment failed",
        description: err instanceof ApiError ? err.message : "Could not assign Mahalle",
        variant: "destructive"
      });
    } finally {
      setIsAddingMembership(false);
    }
  }

  // Handler: Remove Tenant Membership
  async function handleRemoveTenantMembership(tenantId: string) {
    if (!membershipsUser) return;
    setRemovingTenantId(tenantId);
    try {
      await apiClient.delete(`/platform/all-users/${membershipsUser.id}/tenants/${tenantId}`);
      toast({ title: "Mahalle membership revoked", variant: "success" });
      setMembershipsUser(null);
      router.refresh();
    } catch (err) {
      toast({
        title: "Revocation failed",
        description: err instanceof ApiError ? err.message : "Could not revoke Mahalle membership",
        variant: "destructive"
      });
    } finally {
      setRemovingTenantId(null);
    }
  }

  // Handler: Reset Password
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordUser) return;
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setIsResettingPassword(true);
    try {
      await apiClient.post(`/platform/all-users/${passwordUser.id}/reset-password`, {
        newPassword,
        terminateSessions: terminateSessionsOnReset
      });

      toast({ title: "Password has been successfully reset", variant: "success" });
      setPasswordUser(null);
      setNewPassword("");
      setConfirmPassword("");
      router.refresh();
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : "Failed to reset password");
    } finally {
      setIsResettingPassword(false);
    }
  }

  // Handler: Toggle User Status (Suspend/Activate)
  async function handleToggleStatus(user: StatewideUser) {
    setActionLoadingId(user.id);
    try {
      const nextStatus = !user.isActive;
      await apiClient.patch(`/platform/all-users/${user.id}/status`, {
        isActive: nextStatus
      });

      toast({
        title: nextStatus ? "User activated" : "User suspended",
        description: `${user.fullName} is now ${nextStatus ? "active" : "suspended"}.`,
        variant: nextStatus ? "success" : "default"
      });
      router.refresh();
    } catch (err) {
      toast({
        title: "Status change failed",
        description: err instanceof ApiError ? err.message : "Could not update user status",
        variant: "destructive"
      });
    } finally {
      setActionLoadingId(null);
    }
  }

  // Handler: Terminate All Sessions
  async function handleTerminateSessions(user: StatewideUser) {
    setActionLoadingId(user.id);
    try {
      await apiClient.post(`/platform/all-users/${user.id}/terminate-sessions`, {});
      toast({
        title: "Sessions revoked",
        description: `All active sessions for ${user.fullName} have been terminated.`,
        variant: "success"
      });
      router.refresh();
    } catch (err) {
      toast({
        title: "Termination failed",
        description: err instanceof ApiError ? err.message : "Could not terminate sessions",
        variant: "destructive"
      });
    } finally {
      setActionLoadingId(null);
    }
  }

  // Handler: Delete Single User
  async function handleDeleteSingleUser() {
    if (!deletingUser) return;
    setIsDeletingSingle(true);
    try {
      await apiClient.delete(`/platform/all-users/${deletingUser.id}`);
      toast({
        title: "User permanently deleted",
        description: `${deletingUser.fullName} and associated memberships were removed.`,
        variant: "success"
      });
      const nextSelected = new Set(selectedUserIds);
      nextSelected.delete(deletingUser.id);
      setSelectedUserIds(nextSelected);
      setDeletingUser(null);
      router.refresh();
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err instanceof ApiError ? err.message : "Could not delete user account",
        variant: "destructive"
      });
    } finally {
      setIsDeletingSingle(false);
    }
  }

  // Handler: Bulk Delete Selected Users
  async function handleBulkDeleteUsers() {
    if (selectedUserIds.size === 0) return;
    setIsBulkDeleting(true);
    try {
      const ids = Array.from(selectedUserIds);
      const res = await apiClient.post<{ deletedCount: number }>("/platform/all-users/bulk-delete", {
        userIds: ids
      });

      toast({
        title: "Users deleted",
        description: `Successfully removed ${res.deletedCount || ids.length} user account(s).`,
        variant: "success"
      });
      setSelectedUserIds(new Set());
      setIsBulkDeleteOpen(false);
      router.refresh();
    } catch (err) {
      toast({
        title: "Bulk delete failed",
        description: err instanceof ApiError ? err.message : "Could not complete bulk deletion",
        variant: "destructive"
      });
    } finally {
      setIsBulkDeleting(false);
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Access & Accounts</h1>
          <p className="text-sm text-muted-foreground">
            Universal identity directory across all Mahalles, administrators, and platform operators.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsCreateOpen(true)} className="gap-1.5 shadow-sm">
            <UserPlus className="h-4 w-4" />
            Create User
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          label="Total Directory"
          value={stats.total}
          hint="Total accounts in database"
          icon={<Users className="h-4 w-4" />}
          tone="default"
        />
        <StatCard
          label="Mahalle Admins / Owners"
          value={stats.mahalAdmins}
          hint="Tenant level administrators"
          icon={<Building className="h-4 w-4" />}
          tone="green"
        />
        <StatCard
          label="Superadmins & Staff"
          value={stats.superadmins}
          hint="Root platform operators"
          icon={<ShieldCheck className="h-4 w-4" />}
          tone="violet"
        />
        <StatCard
          label="Active Accounts"
          value={stats.active}
          hint="Can access login services"
          icon={<UserCheck className="h-4 w-4" />}
          tone="blue"
        />
        <StatCard
          label="Suspended"
          value={stats.suspended}
          hint="Blocked from signing in"
          icon={<UserX className="h-4 w-4" />}
          tone="rose"
        />
      </div>

      {/* Action and Filter Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or phone number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <Select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="sm:w-40 text-xs"
          >
            <option value="all">All Roles</option>
            <option value="superadmin">Superadmins</option>
            <option value="staff">Platform Staff</option>
            <option value="owner">Mahall Owners</option>
            <option value="admin">Mahall Admins</option>
            <option value="member">Regular Members</option>
          </Select>

          <Select
            value={selectedTenantFilter}
            onChange={(e) => setSelectedTenantFilter(e.target.value)}
            className="sm:w-44 text-xs"
          >
            <option value="all">All Mahalles</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>

          <Select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="sm:w-36 text-xs"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Suspended</option>
          </Select>

          {(searchQuery || selectedRoleFilter !== "all" || selectedTenantFilter !== "all" || selectedStatusFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedRoleFilter("all");
                setSelectedTenantFilter("all");
                setSelectedStatusFilter("all");
              }}
              className="h-10 px-3 text-xs text-muted-foreground hover:text-foreground shrink-0"
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Action Sticky Bar */}
      {selectedUserIds.size > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-2.5 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-destructive">
              {selectedUserIds.size} user{selectedUserIds.size === 1 ? "" : "s"} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsBulkDeleteOpen(true)}
              className="h-8 gap-1.5 text-xs shadow-sm"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Selected
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedUserIds(new Set())}
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Users Table Container */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden min-h-[340px] flex flex-col justify-between">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-[48px] text-center">
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={isAllCurrentPageSelected}
                    onChange={handleToggleSelectAll}
                    aria-label="Select all on this page"
                  />
                </div>
              </TableHead>
              <TableHead className="w-[280px]">User</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Platform Role</TableHead>
              <TableHead>Mahalle Access & Roles</TableHead>
              <TableHead className="text-center">Active Sessions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-44 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <Users className="h-8 w-8 text-muted-foreground/40" />
                    <p className="font-semibold text-sm text-foreground">No users found</p>
                    <p className="text-xs text-muted-foreground">Try adjusting your search criteria or role filters.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user, index) => {
                const isSelected = selectedUserIds.has(user.id);
                const isSuperAdmin = user.platformRole === "SUPER_ADMIN";
                const isPlatformStaff =
                  user.platformRole === "PLATFORM_STAFF" ||
                  user.platformRole === "PLATFORM_SUPPORT";

                // Auto open direction up if near bottom to prevent clipping
                const dropdownDirection = index >= paginatedUsers.length - 2 && paginatedUsers.length > 2 ? "up" : "down";

                return (
                  <TableRow
                    key={user.id}
                    className={`transition-colors hover:bg-muted/30 ${
                      isSelected ? "bg-primary/5 dark:bg-primary/10" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleToggleSelectUser(user.id)}
                          aria-label={`Select user ${user.fullName}`}
                        />
                      </div>
                    </TableCell>

                    {/* User Profile */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={user.fullName} className="h-9 w-9 shrink-0 text-xs font-semibold" />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-sm text-foreground">{user.fullName}</p>
                          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Contact */}
                    <TableCell>
                      <span className="text-xs text-muted-foreground font-mono">
                        {user.phone || "—"}
                      </span>
                    </TableCell>

                    {/* Platform Role */}
                    <TableCell>
                      {isSuperAdmin ? (
                        <Badge variant="destructive" className="gap-1 font-mono text-[10px]">
                          <ShieldAlert className="h-3 w-3" />
                          SUPER ADMIN
                        </Badge>
                      ) : isPlatformStaff ? (
                        <Badge variant="secondary" className="gap-1 font-mono text-[10px] text-purple-700 bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300">
                          <ShieldCheck className="h-3 w-3" />
                          {user.platformRole}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </TableCell>

                    {/* Mahalle Access */}
                    <TableCell>
                      {user.tenants.length === 0 ? (
                        <span className="text-xs text-muted-foreground">No Mahalle assigned</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5 max-w-sm">
                          {user.tenants.map((tm) => (
                            <Badge
                              key={tm.id}
                              variant="outline"
                              className="text-[11px] py-0.5 px-2 bg-background/80 border-border flex items-center gap-1 font-normal"
                            >
                              <Building className="h-3 w-3 text-muted-foreground" />
                              <span className="font-semibold text-foreground">{tm.name}</span>
                              <span className="text-muted-foreground">({tm.roleName || tm.roleKey})</span>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </TableCell>

                    {/* Active Sessions */}
                    <TableCell className="text-center">
                      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium text-muted-foreground bg-muted/60">
                        {user.activeSessionsCount} active
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      {user.isActive ? (
                        <Badge variant="success" className="gap-1 text-[11px]">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1 text-[11px]">
                          <UserX className="h-3 w-3" /> Suspended
                        </Badge>
                      )}
                    </TableCell>

                    {/* Actions Menu */}
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <DropdownMenu
                          align="right"
                          direction={dropdownDirection}
                          trigger={
                            <button
                              type="button"
                              disabled={actionLoadingId === user.id}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                              title="User actions"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          }
                          items={[
                            {
                              label: "Edit Profile",
                              icon: <UserCog className="h-4 w-4" />,
                              onClick: () => openEditModal(user)
                            },
                            {
                              label: "Platform Role",
                              icon: <Shield className="h-4 w-4" />,
                              onClick: () => openRoleModal(user)
                            },
                            {
                              label: "Mahalle Access",
                              icon: <Building className="h-4 w-4" />,
                              onClick: () => setMembershipsUser(user)
                            },
                            {
                              label: "Reset Password",
                              icon: <KeyRound className="h-4 w-4" />,
                              onClick: () => setPasswordUser(user)
                            },
                            {
                              label: "Revoke All Sessions",
                              icon: <RefreshCw className="h-4 w-4" />,
                              onClick: () => handleTerminateSessions(user)
                            },
                            {
                              label: user.isActive ? "Suspend Account" : "Activate Account",
                              icon: user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />,
                              variant: user.isActive ? "destructive" : "default",
                              onClick: () => handleToggleStatus(user)
                            },
                            {
                              label: "Delete User",
                              icon: <Trash2 className="h-4 w-4" />,
                              variant: "destructive",
                              onClick: () => setDeletingUser(user)
                            }
                          ]}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Table Footer with Pagination & Page Size */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border bg-card">
          <p className="text-xs text-muted-foreground">
            Showing {filteredUsers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length} user
            {filteredUsers.length === 1 ? "" : "s"}
          </p>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={filteredUsers.length}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. CREATE USER MODAL */}
      {/* ========================================================================= */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="w-[95vw] max-w-xl sm:w-[600px] h-[640px] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl">
          <div className="p-6 border-b border-border shrink-0">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Create New User Account</DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Provision a new user with platform permissions and/or specific Mahalle access.
              </p>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <form id="create-user-form" onSubmit={handleCreateUser} className="space-y-4">
              <FormField label="Full Name" htmlFor="create-fullName" required>
                <Input
                  id="create-fullName"
                  required
                  placeholder="e.g. Muhammed Ali"
                  value={createForm.fullName}
                  onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                />
              </FormField>

              <FormField label="Email Address" htmlFor="create-email" required>
                <Input
                  id="create-email"
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                />
              </FormField>

              <FormField label="Initial Password" htmlFor="create-password" required hint="At least 8 characters">
                <PasswordInput
                  id="create-password"
                  required
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  placeholder="••••••••"
                />
              </FormField>

              <FormField label="Phone Number" htmlFor="create-phone" hint="Optional">
                <Input
                  id="create-phone"
                  placeholder="+91 9876543210"
                  value={createForm.phone}
                  onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                />
              </FormField>

              <div className="border-t border-border pt-4 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Initial Access & Role Permissions
                </h4>

                <FormField label="Platform Superadmin / Staff Role" htmlFor="create-platformRole" hint="Grant system-wide administrative control">
                  <Select
                    id="create-platformRole"
                    value={createForm.platformRole}
                    onChange={(e) => setCreateForm({ ...createForm, platformRole: e.target.value })}
                  >
                    <option value="">None (Standard User)</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN (Full Platform Control)</option>
                    <option value="PLATFORM_STAFF">PLATFORM_STAFF</option>
                    <option value="PLATFORM_SUPPORT">PLATFORM_SUPPORT</option>
                  </Select>
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Assign Initial Mahalle" htmlFor="create-tenantId" hint="Optional">
                    <Select
                      id="create-tenantId"
                      value={createForm.tenantId}
                      onChange={(e) => setCreateForm({ ...createForm, tenantId: e.target.value })}
                    >
                      <option value="">None</option>
                      {tenants.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </Select>
                  </FormField>

                  {createForm.tenantId && (
                    <FormField label="Mahalle Role" htmlFor="create-tenantRoleKey" required>
                      <Select
                        id="create-tenantRoleKey"
                        value={createForm.tenantRoleKey}
                        onChange={(e) => setCreateForm({ ...createForm, tenantRoleKey: e.target.value })}
                      >
                        <option value="OWNER">Owner</option>
                        <option value="ADMIN">Admin</option>
                        <option value="STAFF">Staff</option>
                        <option value="MEMBER">Member</option>
                      </Select>
                    </FormField>
                  )}
                </div>
              </div>

              {createError && (
                <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                  {createError}
                </div>
              )}
            </form>
          </div>

          <div className="p-4 border-t border-border bg-muted/20 shrink-0 flex items-center justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="create-user-form" isLoading={isCreating}>
              Create Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 2. EDIT PROFILE MODAL */}
      {/* ========================================================================= */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="w-[95vw] max-w-lg sm:w-[500px] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl">
          <div className="p-6 border-b border-border shrink-0">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Edit Profile</DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Update account details for {editingUser?.fullName}.
              </p>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <form id="edit-user-form" onSubmit={handleUpdateProfile} className="space-y-4">
              <FormField label="Full Name" htmlFor="edit-fullName" required>
                <Input
                  id="edit-fullName"
                  required
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                />
              </FormField>

              <FormField label="Email Address" htmlFor="edit-email" required>
                <Input
                  id="edit-email"
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </FormField>

              <FormField label="Phone Number" htmlFor="edit-phone">
                <Input
                  id="edit-phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </FormField>

              {editError && (
                <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                  {editError}
                </div>
              )}
            </form>
          </div>

          <div className="p-4 border-t border-border bg-muted/20 shrink-0 flex items-center justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
            <Button type="submit" form="edit-user-form" isLoading={isUpdating}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 3. MANAGE PLATFORM ROLE MODAL */}
      {/* ========================================================================= */}
      <Dialog open={!!roleUser} onOpenChange={(open) => !open && setRoleUser(null)}>
        <DialogContent className="w-[95vw] max-w-lg sm:w-[500px] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl">
          <div className="p-6 border-b border-border shrink-0">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Platform Access & Role</DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Configure global system operator permissions for {roleUser?.fullName}.
              </p>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <FormField label="System Platform Role" htmlFor="platform-role-select">
              <Select
                id="platform-role-select"
                value={platformRoleValue}
                onChange={(e) => setPlatformRoleValue(e.target.value)}
              >
                <option value="NONE">None (Regular user / Tenant admin only)</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN (Full Root Access)</option>
                <option value="PLATFORM_STAFF">PLATFORM_STAFF (Operator Access)</option>
                <option value="PLATFORM_SUPPORT">PLATFORM_SUPPORT (Support Mode Only)</option>
              </Select>
            </FormField>

            <div className="rounded-xl border border-muted bg-muted/30 p-4 text-xs text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground">Role Permissions Summary:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li><span className="font-semibold text-foreground">SUPER_ADMIN:</span> Unrestricted access across all Mahalles, billing, feature management, and user controls.</li>
                <li><span className="font-semibold text-foreground">PLATFORM_STAFF:</span> Operational fleet monitoring and configuration access.</li>
                <li><span className="font-semibold text-foreground">NONE:</span> User cannot access control panel; limited to assigned Mahalle panels.</li>
              </ul>
            </div>
          </div>

          <div className="p-4 border-t border-border bg-muted/20 shrink-0 flex items-center justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setRoleUser(null)}>
              Cancel
            </Button>
            <Button onClick={handleSavePlatformRole} isLoading={isUpdatingRole}>
              Update Role
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 4. MANAGE MAHALLE MEMBERSHIPS MODAL */}
      {/* ========================================================================= */}
      <Dialog open={!!membershipsUser} onOpenChange={(open) => !open && setMembershipsUser(null)}>
        <DialogContent className="w-[95vw] max-w-xl sm:w-[600px] h-[640px] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl">
          <div className="p-6 border-b border-border shrink-0">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Mahalle Memberships</DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Manage Mahalle workspace associations and role assignments for {membershipsUser?.fullName}.
              </p>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Active Memberships List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Current Assigned Mahalles ({membershipsUser?.tenants.length || 0})
              </h4>

              {membershipsUser?.tenants.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                  User is not currently assigned to any Mahalle.
                </div>
              ) : (
                <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                  {membershipsUser?.tenants.map((tm) => (
                    <div key={tm.id} className="flex items-center justify-between p-3 bg-card hover:bg-muted/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <Building className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm font-semibold leading-tight">{tm.name}</p>
                          <p className="text-xs text-muted-foreground">{tm.slug}.mahalle.test</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs font-mono">
                          {tm.roleName || tm.roleKey}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveTenantMembership(tm.id)}
                          disabled={removingTenantId === tm.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Membership Form */}
            <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Assign To New Mahalle
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Mahalle" htmlFor="assign-tenantId">
                  <Select
                    id="assign-tenantId"
                    value={addTenantId}
                    onChange={(e) => setAddTenantId(e.target.value)}
                  >
                    <option value="">Select Mahalle...</option>
                    {tenants
                      .filter((t) => !membershipsUser?.tenants.some((tm) => tm.id === t.id))
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                  </Select>
                </FormField>

                <FormField label="Role Assignment" htmlFor="assign-roleKey">
                  <Select
                    id="assign-roleKey"
                    value={addTenantRole}
                    onChange={(e) => setAddTenantRole(e.target.value)}
                  >
                    <option value="OWNER">Owner</option>
                    <option value="ADMIN">Admin</option>
                    <option value="STAFF">Staff</option>
                    <option value="MEMBER">Member</option>
                  </Select>
                </FormField>
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  size="sm"
                  onClick={handleAddTenantMembership}
                  disabled={!addTenantId}
                  isLoading={isAddingMembership}
                  className="gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Assign Mahalle
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border bg-muted/20 shrink-0 flex items-center justify-end">
            <Button variant="outline" onClick={() => setMembershipsUser(null)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 5. RESET PASSWORD MODAL */}
      {/* ========================================================================= */}
      <Dialog open={!!passwordUser} onOpenChange={(open) => !open && setPasswordUser(null)}>
        <DialogContent className="w-[95vw] max-w-lg sm:w-[500px] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl">
          <div className="p-6 border-b border-border shrink-0">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Direct Password Reset</DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Set a new password directly for {passwordUser?.fullName}.
              </p>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <form id="reset-password-form" onSubmit={handleResetPassword} className="space-y-4">
              <FormField label="New Password" htmlFor="reset-newPassword" required hint="Minimum 8 characters">
                <PasswordInput
                  id="reset-newPassword"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </FormField>

              <FormField label="Confirm New Password" htmlFor="reset-confirmPassword" required>
                <PasswordInput
                  id="reset-confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </FormField>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="terminate-sessions-check"
                  checked={terminateSessionsOnReset}
                  onChange={(e) => setTerminateSessionsOnReset(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="terminate-sessions-check" className="text-xs text-foreground font-medium cursor-pointer">
                  Revoke all active device sessions upon password change
                </label>
              </div>

              {passwordError && (
                <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                  {passwordError}
                </div>
              )}
            </form>
          </div>

          <div className="p-4 border-t border-border bg-muted/20 shrink-0 flex items-center justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setPasswordUser(null)}>
              Cancel
            </Button>
            <Button type="submit" form="reset-password-form" isLoading={isResettingPassword}>
              Reset Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 6. SINGLE USER DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      <Dialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <DialogContent className="w-[95vw] max-w-md sm:w-[460px] p-6 rounded-2xl">
          <DialogHeader className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-lg font-bold">Delete User Account</DialogTitle>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to permanently delete the user account for{" "}
              <span className="font-semibold text-foreground">{deletingUser?.fullName}</span> (
              <span className="font-mono text-foreground">{deletingUser?.email}</span>)?
            </p>
          </DialogHeader>

          <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive space-y-1">
            <p className="font-semibold">⚠️ Irreversible Action</p>
            <p>
              This will permanently remove the user, all active authentication sessions, platform access rights, and all Mahalle memberships.
            </p>
          </div>

          <DialogFooter className="mt-6 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setDeletingUser(null)}
              disabled={isDeletingSingle}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSingleUser}
              isLoading={isDeletingSingle}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 7. BULK DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      <Dialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <DialogContent className="w-[95vw] max-w-md sm:w-[460px] p-6 rounded-2xl">
          <DialogHeader className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-lg font-bold">Bulk Delete Users</DialogTitle>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You are about to permanently delete{" "}
              <span className="font-bold text-foreground">{selectedUserIds.size}</span> selected user accounts.
            </p>
          </DialogHeader>

          <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive space-y-1">
            <p className="font-semibold">⚠️ Irreversible Bulk Deletion</p>
            <p>
              All selected accounts, their platform permissions, and all Mahalle memberships will be permanently deleted.
            </p>
          </div>

          <DialogFooter className="mt-6 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsBulkDeleteOpen(false)}
              disabled={isBulkDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDeleteUsers}
              isLoading={isBulkDeleting}
            >
              Delete {selectedUserIds.size} Users
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
