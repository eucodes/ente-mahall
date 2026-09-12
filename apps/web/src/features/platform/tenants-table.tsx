"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Checkbox,
  ConfirmDialog,
  FormField,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { PlatformTenant } from "@/lib/platform";

const BULK_DELETE_CONFIRM_TEXT = "DELETE";

export function TenantsTable({ tenants }: { tenants: PlatformTenant[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const allSelected = tenants.length > 0 && selected.size === tenants.length;

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(tenants.map((t) => t.id)));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleBulkDelete() {
    setIsDeleting(true);
    try {
      const { deleted, skipped } = await apiClient.post<{ deleted: string[]; skipped: string[] }>(
        "/platform/tenants/bulk-delete",
        { tenantIds: Array.from(selected) }
      );
      toast({
        title: `Deleted ${deleted.length} Mahalle${deleted.length === 1 ? "" : "s"}`,
        description: skipped.length > 0 ? `${skipped.length} were already gone and were skipped.` : undefined,
        variant: "success"
      });
      setSelected(new Set());
      setConfirmOpen(false);
      setConfirmText("");
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong.";
      toast({ title: "Couldn't delete the selected Mahalles", description: message, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      {selected.size > 0 && (
        <div className="flex items-center justify-between rounded-md border border-destructive/30 bg-destructive/5 px-4 py-2">
          <p className="text-sm font-medium">
            {selected.size} Mahalle{selected.size === 1 ? "" : "s"} selected
          </p>
          <Button size="sm" variant="destructive" onClick={() => setConfirmOpen(true)}>
            Delete selected
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox checked={allSelected} onChange={toggleAll} aria-label="Select all Mahalles" />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map((tenant) => (
            <TableRow key={tenant.id}>
              <TableCell>
                <Checkbox
                  checked={selected.has(tenant.id)}
                  onChange={() => toggleOne(tenant.id)}
                  aria-label={`Select ${tenant.name}`}
                />
              </TableCell>
              <TableCell className="font-medium">{tenant.name}</TableCell>
              <TableCell className="text-muted-foreground">{tenant.slug}</TableCell>
              <TableCell>{tenant.memberCount}</TableCell>
              <TableCell>
                <Badge variant={tenant.isActive ? "success" : "outline"}>
                  {tenant.isActive ? "Active" : "Suspended"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/tenants/${tenant.id}`}
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Manage
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setConfirmText("");
        }}
        title={`Permanently delete ${selected.size} Mahalle${selected.size === 1 ? "" : "s"}?`}
        description={
          <div className="space-y-3">
            <p>
              This cascades to every member, family, event, announcement, program, and
              administrator in each selected Mahalle. This cannot be undone.
            </p>
            <FormField label={`Type "${BULK_DELETE_CONFIRM_TEXT}" to confirm`} htmlFor="bulk-delete-confirm">
              <Input
                id="bulk-delete-confirm"
                autoComplete="off"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </FormField>
          </div>
        }
        confirmLabel="Delete permanently"
        destructive
        isConfirming={isDeleting}
        confirmDisabled={confirmText !== BULK_DELETE_CONFIRM_TEXT}
        onConfirm={handleBulkDelete}
      />
    </div>
  );
}
