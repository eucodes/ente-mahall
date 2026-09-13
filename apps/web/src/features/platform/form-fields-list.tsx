"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  ConfirmDialog,
  EmptyState,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { FormFieldSummary } from "@/lib/forms";
import { FormFieldDialog } from "./form-field-dialog";

function DeleteFieldButton({ fieldId, label }: { fieldId: string; label: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await apiClient.delete(`/platform/forms/fields/${fieldId}`);
      toast({ title: "Field removed", variant: "success" });
      setOpen(false);
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong.";
      toast({ title: "Couldn't remove field", description: message, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Remove
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`Remove "${label}"?`}
        description="This only affects the current draft version."
        confirmLabel="Remove"
        destructive
        isConfirming={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}

export function FormFieldsList({
  versionId,
  fields,
  editable
}: {
  versionId: string;
  fields: FormFieldSummary[];
  editable: boolean;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<FormFieldSummary | null>(null);

  function openAdd() {
    setEditingField(null);
    setDialogOpen(true);
  }

  function openEdit(field: FormFieldSummary) {
    setEditingField(field);
    setDialogOpen(true);
  }

  return (
    <div className="space-y-4">
      {editable && (
        <div className="flex justify-end">
          <Button size="sm" onClick={openAdd}>
            Add field
          </Button>
        </div>
      )}

      {fields.length === 0 ? (
        <EmptyState title="No fields yet" description={editable ? "Add the first field to this form." : undefined} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Required</TableHead>
              {editable && <TableHead />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field) => (
              <TableRow key={field.id}>
                <TableCell className="text-muted-foreground">{field.order}</TableCell>
                <TableCell className="font-medium">{field.label}</TableCell>
                <TableCell className="text-muted-foreground">{field.key}</TableCell>
                <TableCell>
                  <Badge variant="outline">{field.type}</Badge>
                </TableCell>
                <TableCell>{field.required ? "Yes" : "—"}</TableCell>
                {editable && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(field)}>
                        Edit
                      </Button>
                      <DeleteFieldButton fieldId={field.id} label={field.label} />
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {editable && (
        <FormFieldDialog
          versionId={versionId}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          editingField={editingField}
          nextOrder={fields.length}
        />
      )}
    </div>
  );
}
