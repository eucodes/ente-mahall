"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox, EmptyState, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { PlatformTenant } from "@/lib/platform";

export function FormAssignmentEditor({
  templateId,
  isPlatformWide,
  assignedTenantIds,
  tenants
}: {
  templateId: string;
  isPlatformWide: boolean;
  assignedTenantIds: string[];
  tenants: PlatformTenant[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [platformWide, setPlatformWide] = useState(isPlatformWide);
  const [selected, setSelected] = useState<Set<string>>(new Set(assignedTenantIds));
  const [isSaving, setIsSaving] = useState(false);

  function toggle(tenantId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(tenantId)) {
        next.delete(tenantId);
      } else {
        next.add(tenantId);
      }
      return next;
    });
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await apiClient.patch(`/platform/forms/${templateId}/assignment`, {
        isPlatformWide: platformWide,
        tenantIds: Array.from(selected)
      });
      toast({ title: "Assignment updated", variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong.";
      toast({ title: "Couldn't update assignment", description: message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={platformWide} onChange={() => setPlatformWide((v) => !v)} />
        Assign to every Mahalle (platform-wide)
      </label>

      {!platformWide && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Assigned Mahalles</p>
          {tenants.length === 0 ? (
            <EmptyState title="No Mahalles to assign yet" />
          ) : (
            <div className="grid max-h-64 gap-1.5 overflow-y-auto rounded-xl border border-border p-3 sm:grid-cols-2">
              {tenants.map((tenant) => (
                <label key={tenant.id} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={selected.has(tenant.id)} onChange={() => toggle(tenant.id)} />
                  {tenant.name}
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      <Button size="sm" isLoading={isSaving} onClick={handleSave}>
        Save assignment
      </Button>
    </div>
  );
}
