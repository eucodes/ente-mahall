"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
  Select,
  StatCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  useToast,
  Check,
  CheckCircle2,
  Lock,
  Plus,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Users,
  X
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { PlatformRolesMatrixResponse, StatewideUser } from "@/lib/platform";

interface RolesPermissionsViewProps {
  matrix: PlatformRolesMatrixResponse;
  allUsers: StatewideUser[];
}

export function RolesPermissionsView({ matrix, allUsers }: RolesPermissionsViewProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<string>("matrix");
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("PLATFORM_STAFF");
  const [isAssigning, setIsAssigning] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [revokingMembershipId, setRevokingMembershipId] = useState<string | null>(null);

  // Filter non-platform users for assignment picker
  const eligibleUsers = allUsers.filter((u) => !u.platformRole || u.platformRole === "NONE");

  async function handleAssignRole(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUserId) return;
    setIsAssigning(true);
    try {
      await apiClient.post(`/platform/all-users/${selectedUserId}/platform-role`, {
        role: selectedRole
      });

      toast({
        title: "Platform role granted",
        description: `User has been granted ${selectedRole} privileges.`,
        variant: "success"
      });
      setIsAssignOpen(false);
      setSelectedUserId("");
      router.refresh();
    } catch (err) {
      toast({
        title: "Assignment failed",
        description: err instanceof ApiError ? err.message : "Failed to assign platform role",
        variant: "destructive"
      });
    } finally {
      setIsAssigning(false);
    }
  }

  async function handleRevokeRole(userId: string) {
    setRevokingMembershipId(userId);
    try {
      await apiClient.post(`/platform/all-users/${userId}/platform-role`, {
        role: null
      });

      toast({
        title: "Platform role revoked",
        description: "User no longer has control plane access.",
        variant: "success"
      });
      router.refresh();
    } catch (err) {
      toast({
        title: "Revocation failed",
        description: err instanceof ApiError ? err.message : "Failed to revoke platform role",
        variant: "destructive"
      });
    } finally {
      setRevokingMembershipId(null);
    }
  }

  function hasPermission(roleKey: string, permissionKey: string) {
    const permissions = matrix.rolePermissions[roleKey];
    if (permissions === "*") return true;
    if (Array.isArray(permissions)) {
      return permissions.includes(permissionKey);
    }
    return false;
  }

  const superAdminRole = matrix.roles.find((r) => r.key === "SUPER_ADMIN");
  const staffRole = matrix.roles.find((r) => r.key === "PLATFORM_STAFF");
  const supportRole = matrix.roles.find((r) => r.key === "PLATFORM_SUPPORT");

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Platform Roles & Permissions</h1>
          <p className="text-sm text-muted-foreground">
            Control plane access management, operator role matrix, and security permissions for Superadmins.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsAssignOpen(true)} className="gap-1.5 shadow-sm">
            <Plus className="h-4 w-4" />
            Assign Role
          </Button>
        </div>
      </div>

      {/* Role Overview Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Super Administrator"
          value={superAdminRole?.membersCount ?? 0}
          hint="Full root control across all Mahalles & platform"
          icon={<ShieldAlert className="h-4 w-4" />}
          tone="rose"
        />
        <StatCard
          label="Platform Staff"
          value={staffRole?.membersCount ?? 0}
          hint="Fleet management, feature flags & billing"
          icon={<ShieldCheck className="h-4 w-4" />}
          tone="violet"
        />
        <StatCard
          label="Platform Support"
          value={supportRole?.membersCount ?? 0}
          hint="Audited support mode & diagnostics viewer"
          icon={<Shield className="h-4 w-4" />}
          tone="blue"
        />
      </div>

      {/* Main Tabs */}
      <Tabs
        tabs={[
          {
            id: "matrix",
            label: "Permissions Matrix",
            icon: <Lock className="h-3.5 w-3.5" />
          },
          {
            id: "operators",
            label: "Platform Operators",
            icon: <Users className="h-3.5 w-3.5" />,
            count: matrix.roles.reduce((acc, r) => acc + r.membersCount, 0)
          }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* TAB 1: PERMISSION MATRIX */}
      {activeTab === "matrix" && (
        <div className="space-y-6">
          {matrix.categories.map((cat) => (
            <Card key={cat.category} className="overflow-hidden shadow-sm">
              <div className="border-b border-border bg-muted/40 px-5 py-3 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  {cat.category}
                </h3>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {cat.permissions.length} actions
                </Badge>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20">
                    <TableHead className="w-[320px]">Permission</TableHead>
                    <TableHead>Identifier Key</TableHead>
                    <TableHead className="text-center w-[140px]">
                      <span className="text-rose-600 dark:text-rose-400 font-bold">SUPER_ADMIN</span>
                    </TableHead>
                    <TableHead className="text-center w-[140px]">
                      <span className="text-purple-600 dark:text-purple-400 font-bold">PLATFORM_STAFF</span>
                    </TableHead>
                    <TableHead className="text-center w-[140px]">
                      <span className="text-blue-600 dark:text-blue-400 font-bold">PLATFORM_SUPPORT</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cat.permissions.map((p) => {
                    const hasSuper = hasPermission("SUPER_ADMIN", p.key);
                    const hasStaff = hasPermission("PLATFORM_STAFF", p.key);
                    const hasSupport = hasPermission("PLATFORM_SUPPORT", p.key);

                    return (
                      <TableRow key={p.key} className="hover:bg-muted/10 transition-colors">
                        <TableCell>
                          <div>
                            <p className="font-semibold text-xs text-foreground">{p.name}</p>
                            <p className="text-[11px] text-muted-foreground leading-tight">{p.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-[11px] font-mono bg-muted/50 px-1.5 py-0.5 rounded text-muted-foreground">
                            {p.key}
                          </code>
                        </TableCell>
                        <TableCell className="text-center">
                          {hasSuper ? (
                            <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                              <Check className="h-3.5 w-3.5 stroke-[3]" />
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {hasStaff ? (
                            <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                              <Check className="h-3.5 w-3.5 stroke-[3]" />
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {hasSupport ? (
                            <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                              <Check className="h-3.5 w-3.5 stroke-[3]" />
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 2: OPERATORS DIRECTORY */}
      {activeTab === "operators" && (
        <div className="space-y-6">
          {matrix.roles.map((role) => (
            <Card key={role.key} className="overflow-hidden shadow-sm">
              <div className="border-b border-border bg-muted/30 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-foreground">{role.name}</h3>
                    <Badge
                      variant={
                        role.key === "SUPER_ADMIN"
                          ? "destructive"
                          : role.key === "PLATFORM_STAFF"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-[10px] font-mono"
                    >
                      {role.key}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{role.description}</p>
                </div>
                <Badge variant="outline" className="self-start sm:self-auto font-mono text-xs">
                  {role.members.length} {role.members.length === 1 ? "operator" : "operators"}
                </Badge>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/10">
                    <TableHead className="w-[280px]">Operator</TableHead>
                    <TableHead>Contact Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Account Status</TableHead>
                    <TableHead className="w-[80px] text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {role.members.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-20 text-center text-xs text-muted-foreground">
                        No operators currently assigned to this role.
                      </TableCell>
                    </TableRow>
                  ) : (
                    role.members.map((member) => (
                      <TableRow key={member.id} className="hover:bg-muted/10 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar name={member.fullName} className="h-8 w-8 text-xs" />
                            <span className="font-semibold text-xs text-foreground">{member.fullName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {member.email}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {member.phone || "—"}
                        </TableCell>
                        <TableCell>
                          {member.isActive ? (
                            <Badge variant="success" className="gap-1 text-[10px]">
                              <CheckCircle2 className="h-3 w-3" /> Active
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-[10px]">
                              Suspended
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                            onClick={() => handleRevokeRole(member.id)}
                            disabled={revokingMembershipId === member.id}
                            title="Revoke platform role"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          ))}
        </div>
      )}

      {/* ASSIGN ROLE DIALOG */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="w-[95vw] max-w-md sm:w-[480px] p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Assign Platform Role</DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Grant system-wide administrative control to a registered platform user.
            </p>
          </DialogHeader>

          <form onSubmit={handleAssignRole} className="space-y-4 mt-4">
            <FormField label="Select User" htmlFor="assign-user-select" required>
              <Select
                id="assign-user-select"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                required
              >
                <option value="">Choose a user...</option>
                {eligibleUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName} ({u.email})
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Platform Role" htmlFor="assign-role-select" required>
              <Select
                id="assign-role-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                required
              >
                <option value="SUPER_ADMIN">SUPER_ADMIN (Full Root Privileges)</option>
                <option value="PLATFORM_STAFF">PLATFORM_STAFF (Operations & Billing)</option>
                <option value="PLATFORM_SUPPORT">PLATFORM_SUPPORT (Support Mode Only)</option>
              </Select>
            </FormField>

            <div className="rounded-xl border border-muted bg-muted/20 p-3 text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Security Reminder:</p>
              <p>Platform operators have elevated visibility across Mahalles and multi-tenant data. Grant only to authorized staff.</p>
            </div>

            <DialogFooter className="mt-6 flex items-center justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setIsAssignOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isAssigning} disabled={!selectedUserId}>
                Grant Platform Access
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
