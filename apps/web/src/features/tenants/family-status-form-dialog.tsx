"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, FormField, Input, Textarea, Select, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { FamilyStatus } from "@/lib/structure";

interface FamilyStatusFormValues {
  name: string;
  code: string;
  color: string;
  description: string;
}

const EMPTY_FORM: FamilyStatusFormValues = { name: "", code: "", color: "emerald", description: "" };

const COLOR_OPTIONS = [
  { value: "emerald", label: "Emerald Green" },
  { value: "blue", label: "Ocean Blue" },
  { value: "amber", label: "Amber / Yellow" },
  { value: "purple", label: "Purple" },
  { value: "rose", label: "Rose Red" },
  { value: "slate", label: "Slate Gray" }
];

export function FamilyStatusFormDialog({
  slug,
  open,
  onOpenChange,
  editingStatus,
  statusTerm
}: {
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingStatus: FamilyStatus | null;
  statusTerm: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [values, setValues] = useState<FamilyStatusFormValues>(() =>
    editingStatus
      ? { name: editingStatus.name, code: editingStatus.code ?? "", color: editingStatus.color ?? "emerald", description: editingStatus.description ?? "" }
      : EMPTY_FORM
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const label = statusTerm || "Status";

  useEffect(() => {
    if (open) {
      setError(null);
      if (editingStatus) {
        setValues({
          name: editingStatus.name,
          code: editingStatus.code ?? "",
          color: editingStatus.color ?? "emerald",
          description: editingStatus.description ?? ""
        });
      } else {
        setValues(EMPTY_FORM);
      }
    }
  }, [open, editingStatus]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const payload = {
      name: values.name.trim(),
      code: values.code.trim() || undefined,
      color: values.color,
      description: values.description.trim() || undefined
    };
    try {
      if (editingStatus) {
        await apiClient.patch(`/tenants/${slug}/structure/family-statuses/${editingStatus.id}`, payload);
        toast({ title: `${label} updated successfully`, variant: "success" });
      } else {
        await apiClient.post(`/tenants/${slug}/structure/family-statuses`, payload);
        toast({ title: `${label} created successfully`, variant: "success" });
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
      <DialogContent className="w-[95vw] max-w-lg sm:w-[500px] flex flex-col p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="p-5 pb-3 border-b border-border bg-muted/20 shrink-0">
          <DialogTitle>{editingStatus ? `Edit ${label}` : `Add ${label}`}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1" noValidate>
          <div className="p-5 space-y-4">
            <FormField label="Status Name" htmlFor="status-name" required error={error ?? undefined}>
              <Input
                id="status-name"
                required
                placeholder="e.g. Category A, Welfare Eligible, Zakat"
                value={values.name}
                onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
              />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Code / Short Key" htmlFor="status-code">
                <Input
                  id="status-code"
                  placeholder="e.g. CAT_A"
                  value={values.code}
                  onChange={(e) => setValues((v) => ({ ...v, code: e.target.value.toUpperCase() }))}
                />
              </FormField>
              <FormField label="Badge Color" htmlFor="status-color">
                <Select
                  id="status-color"
                  value={values.color}
                  onChange={(e) => setValues((v) => ({ ...v, color: e.target.value }))}
                >
                  {COLOR_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>
            <FormField label="Description" htmlFor="status-description">
              <Textarea
                id="status-description"
                rows={2}
                placeholder="Optional criteria or notes for this status tier"
                value={values.description}
                onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
              />
            </FormField>
          </div>
          <DialogFooter className="p-4 border-t border-border bg-muted/10 gap-2 shrink-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !values.name.trim()}>
              {isSubmitting ? "Saving..." : editingStatus ? "Update Status" : "Save Status"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
