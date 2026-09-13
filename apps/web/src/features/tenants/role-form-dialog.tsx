"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, FormField, Input, PermissionMatrix, Textarea, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { PermissionCategory, RoleSummary } from "@/lib/roles";

export function RoleFormDialog({
  slug,
  open,
  onOpenChange,
  editingRole,
  categories
}: {
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRole: RoleSummary | null;
  categories: PermissionCategory[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState(editingRole?.name ?? "");
  const [description, setDescription] = useState(editingRole?.description ?? "");
  const [permissionKeys, setPermissionKeys] = useState<string[]>(editingRole?.permissionKeys ?? []);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSystem = editingRole?.isSystem ?? false;

  useEffect(() => {
    if (open) {
      setError(null);
      if (editingRole) {
        setName(editingRole.name);
        setDescription(editingRole.description ?? "");
        setPermissionKeys(editingRole.permissionKeys ?? []);
      } else {
        setName("");
        setDescription("");
        setPermissionKeys([]);
      }
    }
  }, [open, editingRole]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (editingRole) {
        await apiClient.patch(`/tenants/${slug}/roles/${editingRole.id}`, {
          name,
          description: description || null,
          permissionKeys
        });
        toast({ title: "Role updated", variant: "success" });
      } else {
        await apiClient.post(`/tenants/${slug}/roles`, {
          name,
          description: description || undefined,
          permissionKeys
        });
        toast({ title: "Role created", variant: "success" });
      }
      onOpenChange(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-3xl sm:w-[780px] h-[680px] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="p-5 pb-3 border-b border-border bg-muted/20 shrink-0">
          <DialogTitle>{editingRole ? `Edit ${editingRole.name}` : "Create a role"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0" noValidate>
          <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
            {isSystem && (
              <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                This is a system role — its name and permissions are fixed to keep the app&apos;s built-in access levels predictable.
                Duplicate it to create a customizable copy.
              </p>
            )}
            <FormField label="Role name" htmlFor="role-name" required error={error ?? undefined}>
              <Input id="role-name" required disabled={isSystem} invalid={Boolean(error)} value={name} onChange={(e) => setName(e.target.value)} />
            </FormField>
            <FormField label="Description" htmlFor="role-description" hint="Optional">
              <Textarea id="role-description" disabled={isSystem} value={description} onChange={(e) => setDescription(e.target.value)} />
            </FormField>
            <FormField label="Permissions" htmlFor="role-permissions">
              <PermissionMatrix categories={categories} selected={permissionKeys} onChange={setPermissionKeys} disabled={isSystem} />
            </FormField>
          </div>
          <DialogFooter className="p-4 px-6 border-t border-border bg-muted/20 flex items-center justify-end gap-2 shrink-0">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {!isSystem && (
              <Button type="submit" size="sm" isLoading={isSubmitting}>
                {editingRole ? "Save Changes" : "Create role"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
