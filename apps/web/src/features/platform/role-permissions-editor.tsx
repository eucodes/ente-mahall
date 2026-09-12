"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardHeader, CardTitle, Checkbox, useToast } from "@mahalle/ui";
import { PERMISSIONS, type Permission } from "@mahalle/types";
import { apiClient, ApiError } from "@/lib/api-client";
import type { TenantRoleWithPermissions } from "@/lib/platform";

/** Groups "members.view" / "members.create" / ... under a "members" heading. */
function groupPermissionsByCategory(): Record<string, Permission[]> {
  const groups: Record<string, Permission[]> = {};
  for (const permission of PERMISSIONS) {
    const category = permission.split(".")[0] ?? "other";
    (groups[category] ??= []).push(permission);
  }
  return groups;
}

const PERMISSION_GROUPS = groupPermissionsByCategory();

function RoleCard({ tenantId, role }: { tenantId: string; role: TenantRoleWithPermissions }) {
  const router = useRouter();
  const { toast } = useToast();
  const [selected, setSelected] = useState<Set<string>>(new Set(role.permissions));
  const [isSaving, setIsSaving] = useState(false);

  function toggle(permission: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(permission)) {
        next.delete(permission);
      } else {
        next.add(permission);
      }
      return next;
    });
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await apiClient.patch(`/platform/tenants/${tenantId}/roles/${role.id}/permissions`, {
        permissions: Array.from(selected)
      });
      toast({ title: `${role.name} permissions updated`, variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong.";
      toast({ title: "Couldn't update permissions", description: message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">{role.name}</CardTitle>
        <Button size="sm" isLoading={isSaving} onClick={handleSave}>
          Save
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(PERMISSION_GROUPS).map(([category, permissions]) => (
          <div key={category} className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{category}</p>
            <div className="space-y-1.5">
              {permissions.map((permission) => (
                <label key={permission} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={selected.has(permission)} onChange={() => toggle(permission)} />
                  {permission}
                </label>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * The platform deciding what a Mahalle's roles (its ADMIN included) are
 * permitted to do — overriding whatever the tenant's own OWNER set up. Each
 * role saves independently since they're logically separate decisions.
 */
export function RolePermissionsEditor({ tenantId, roles }: { tenantId: string; roles: TenantRoleWithPermissions[] }) {
  return (
    <div className="space-y-4">
      {roles.map((role) => (
        <RoleCard key={role.id} tenantId={tenantId} role={role} />
      ))}
    </div>
  );
}
