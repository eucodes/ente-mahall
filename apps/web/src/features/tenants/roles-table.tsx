"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  ConfirmDialog,
  EmptyState,
  Pencil,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { PermissionCategory, RoleSummary } from "@/lib/roles";
import { RoleFormDialog } from "./role-form-dialog";

export function RolesTable({ slug, roles, categories }: { slug: string; roles: RoleSummary[]; categories: PermissionCategory[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleSummary | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<RoleSummary | null>(null);
  const [isBusy, setIsBusy] = useState<string | null>(null);

  function openCreate() {
    setEditingRole(null);
    setFormOpen(true);
  }

  function openEdit(role: RoleSummary) {
    setEditingRole(role);
    setFormOpen(true);
  }

  async function handleDuplicate(role: RoleSummary) {
    setIsBusy(role.id);
    try {
      await apiClient.post(`/tenants/${slug}/roles/${role.id}/duplicate`, {});
      toast({ title: `${role.name} duplicated`, variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't duplicate that role.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIsBusy(null);
    }
  }

  async function handleDeactivate() {
    if (!deactivateTarget) return;
    setIsBusy(deactivateTarget.id);
    try {
      await apiClient.patch(`/tenants/${slug}/roles/${deactivateTarget.id}/deactivate`, {});
      toast({ title: `${deactivateTarget.name} deactivated`, variant: "success" });
      setDeactivateTarget(null);
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't deactivate that role.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIsBusy(null);
    }
  }

  async function handleReactivate(role: RoleSummary) {
    setIsBusy(role.id);
    try {
      await apiClient.patch(`/tenants/${slug}/roles/${role.id}/reactivate`, {});
      toast({ title: `${role.name} reactivated`, variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't reactivate that role.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIsBusy(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{roles.length} role{roles.length === 1 ? "" : "s"}</p>
        <Button onClick={openCreate}>Create role</Button>
      </div>

      {roles.length === 0 ? (
        <EmptyState title="No custom roles yet" description="Create a role to grant a tailored set of permissions." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <p className="font-medium">{role.name}</p>
                    {role.description && <p className="text-xs text-muted-foreground">{role.description}</p>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={role.isSystem ? "outline" : "secondary"}>{role.isSystem ? "System" : "Custom"}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {role.permissionKeys.length === 0 ? "None" : role.permissionKeys.length}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{role.memberCount}</TableCell>
                  <TableCell>
                    <Badge variant={role.isActive ? "secondary" : "outline"}>{role.isActive ? "Active" : "Inactive"}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(role)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" isLoading={isBusy === role.id} onClick={() => handleDuplicate(role)}>
                        Duplicate
                      </Button>
                      {!role.isSystem &&
                        (role.isActive ? (
                          <Button variant="ghost" size="sm" onClick={() => setDeactivateTarget(role)}>
                            Deactivate
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" isLoading={isBusy === role.id} onClick={() => handleReactivate(role)}>
                            Reactivate
                          </Button>
                        ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <RoleFormDialog slug={slug} open={formOpen} onOpenChange={setFormOpen} editingRole={editingRole} categories={categories} />

      <ConfirmDialog
        open={deactivateTarget !== null}
        onOpenChange={(open) => !open && setDeactivateTarget(null)}
        title={`Deactivate ${deactivateTarget?.name ?? "this role"}?`}
        description={
          deactivateTarget && deactivateTarget.memberCount > 0
            ? `${deactivateTarget.memberCount} member(s) still hold this role — reassign them first from Users.`
            : "It will no longer be assignable, but can be reactivated later."
        }
        confirmLabel="Deactivate"
        destructive
        isConfirming={isBusy === deactivateTarget?.id}
        onConfirm={handleDeactivate}
      />
    </div>
  );
}
