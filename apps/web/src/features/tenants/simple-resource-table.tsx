"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  ConfirmDialog,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";

/** One row's already-rendered cells, in the same order as `headers`. */
export interface ResourceRow<T> {
  item: T;
  /** Used in the "Remove {label}?" confirmation — precomputed since it names an item, not a column. */
  label: string;
  cells: ReactNode[];
}

interface SimpleResourceTableProps<T extends { id: string }> {
  slug: string;
  /** URL segment, e.g. "families" — DELETE goes to /tenants/:slug/{resource}/:id */
  resource: string;
  headers: string[];
  rows: ResourceRow<T>[];
}

/**
 * Shared list+delete UI for the simpler business resources (families,
 * events, announcements, programs). Each page renders its own cells and
 * builds `rows` itself (formatting differs too much per entity to share
 * that part) — this component only owns the table chrome and the
 * delete-with-ConfirmDialog flow, which are identical everywhere.
 *
 * Cells arrive pre-rendered (ReactNode), not as render functions: this is a
 * Client Component, and a Server Component caller can't pass it a function
 * prop — only serializable data and already-rendered JSX cross that
 * boundary.
 */
export function SimpleResourceTable<T extends { id: string }>({
  slug,
  resource,
  headers,
  rows
}: SimpleResourceTableProps<T>) {
  const router = useRouter();
  const { toast } = useToast();
  const [removeTarget, setRemoveTarget] = useState<ResourceRow<T> | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  async function handleRemove() {
    if (!removeTarget) return;
    setIsRemoving(true);
    try {
      await apiClient.delete(`/tenants/${slug}/${resource}/${removeTarget.item.id}`);
      toast({ title: "Removed", variant: "success" });
      setRemoveTarget(null);
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong.";
      toast({ title: "Couldn't remove that", description: message, variant: "destructive" });
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.item.id}>
              {row.cells.map((cell, index) => (
                <TableCell key={index}>{cell}</TableCell>
              ))}
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => setRemoveTarget(row)}>
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title={`Remove ${removeTarget?.label ?? "this"}?`}
        description="This action cannot be undone from here."
        confirmLabel="Remove"
        destructive
        isConfirming={isRemoving}
        onConfirm={handleRemove}
      />
    </>
  );
}
