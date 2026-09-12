"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ConfirmDialog, FormField, Input, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";

interface TenantStatusActionsProps {
  tenantId: string;
  slug: string;
  isActive: boolean;
  /** Where to send the browser after a successful delete (the tenant no longer exists to show a detail page for). */
  afterDeleteHref: string;
}

/**
 * The platform's two most consequential tenant actions: suspend/reactivate
 * ("stop"/"start" a Mahalle — reversible) and permanent delete (irreversible
 * — requires typing the tenant's slug to confirm, on top of the API's own
 * SUPER_ADMIN-only guard, since there's no undo).
 */
export function TenantStatusActions({ tenantId, slug, isActive, afterDeleteHref }: TenantStatusActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleToggleStatus() {
    setIsTogglingStatus(true);
    try {
      await apiClient.patch(`/platform/tenants/${tenantId}/status`, { isActive: !isActive });
      toast({ title: isActive ? "Mahalle suspended" : "Mahalle reactivated", variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong.";
      toast({ title: "Couldn't change status", description: message, variant: "destructive" });
    } finally {
      setIsTogglingStatus(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await apiClient.delete(`/platform/tenants/${tenantId}`);
      toast({ title: "Mahalle deleted", variant: "success" });
      router.push(afterDeleteHref);
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong.";
      toast({ title: "Couldn't delete Mahalle", description: message, variant: "destructive" });
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" isLoading={isTogglingStatus} onClick={handleToggleStatus}>
        {isActive ? "Stop this Mahalle" : "Reactivate this Mahalle"}
      </Button>
      <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
        Delete permanently
      </Button>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setDeleteConfirmText("");
        }}
        title={`Permanently delete ${slug}?`}
        description={
          <div className="space-y-3">
            <p>
              This deletes the Mahalle and everything under it — members, families, events,
              announcements, programs, and administrator access. This cannot be undone.
            </p>
            <FormField label={`Type "${slug}" to confirm`} htmlFor="delete-confirm-slug">
              <Input
                id="delete-confirm-slug"
                autoComplete="off"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
              />
            </FormField>
          </div>
        }
        confirmLabel="Delete permanently"
        destructive
        isConfirming={isDeleting}
        confirmDisabled={deleteConfirmText !== slug}
        onConfirm={handleDelete}
      />
    </div>
  );
}
