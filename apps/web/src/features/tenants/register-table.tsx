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
  Trash,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { RegisterColumnConfig, RegisterFieldConfig, RegisterRecord } from "./register-types";
import { RegisterFormDialog } from "./register-form-dialog";

function formatCell(value: unknown, format: RegisterColumnConfig["format"]): string {
  if (value === null || value === undefined || value === "") return "—";
  if (format === "date") return new Date(String(value)).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  return String(value);
}

export interface RegisterTableProps {
  slug: string;
  resource: string;
  records: RegisterRecord[];
  columns: RegisterColumnConfig[];
  fields: RegisterFieldConfig[];
  labelKey: string;
  dialogTitle: { create: string; edit: string };
  emptyTitle: string;
  emptyDescription: string;
  certificated?: boolean;
}

export function RegisterTable({
  slug,
  resource,
  records,
  columns,
  fields,
  labelKey,
  dialogTitle,
  emptyTitle,
  emptyDescription,
  certificated
}: RegisterTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RegisterRecord | null>(null);
  const [removeTarget, setRemoveTarget] = useState<RegisterRecord | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [issuingId, setIssuingId] = useState<string | null>(null);

  function openAddForm() {
    setEditingRecord(null);
    setFormOpen(true);
  }

  function openEditForm(record: RegisterRecord) {
    setEditingRecord(record);
    setFormOpen(true);
  }

  async function handleRemove() {
    if (!removeTarget) return;
    setIsRemoving(true);
    try {
      await apiClient.delete(`/tenants/${slug}/${resource}/${removeTarget.id}`);
      toast({ title: "Removed", variant: "success" });
      setRemoveTarget(null);
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't remove that record.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIsRemoving(false);
    }
  }

  async function handleIssueCertificate(record: RegisterRecord) {
    setIssuingId(record.id);
    try {
      const response = await apiClient.post<{ record: RegisterRecord }>(`/tenants/${slug}/${resource}/${record.id}/certificate`, {});
      toast({ title: `Certificate issued: ${response.record.certificateNumber}`, variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't issue a certificate.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIssuingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {records.length} record{records.length === 1 ? "" : "s"}
        </p>
        <Button onClick={openAddForm}>Add record</Button>
      </div>

      {records.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key}>{column.header}</TableHead>
                ))}
                {certificated && <TableHead>Certificate</TableHead>}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.key === columns[0]?.key ? "font-medium" : "text-muted-foreground"}>
                      {formatCell(record[column.key], column.format)}
                    </TableCell>
                  ))}
                  {certificated && (
                    <TableCell>
                      {record.certificateNumber ? (
                        <Badge variant="secondary">{String(record.certificateNumber)}</Badge>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          isLoading={issuingId === record.id}
                          onClick={() => handleIssueCertificate(record)}
                        >
                          Issue
                        </Button>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditForm(record)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setRemoveTarget(record)}>
                        <Trash className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <RegisterFormDialog slug={slug} resource={resource} open={formOpen} onOpenChange={setFormOpen} editingRecord={editingRecord} fields={fields} title={dialogTitle} />

      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title={`Remove ${removeTarget ? String(removeTarget[labelKey] ?? "this record") : "this record"}?`}
        description="This action cannot be undone from here."
        confirmLabel="Remove"
        destructive
        isConfirming={isRemoving}
        onConfirm={handleRemove}
      />
    </div>
  );
}
