"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, FormField, Input, Textarea, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Division } from "@/lib/structure";

interface DivisionFormValues {
  name: string;
  code: string;
  description: string;
}

const EMPTY_FORM: DivisionFormValues = { name: "", code: "", description: "" };

export function DivisionFormDialog({
  slug,
  open,
  onOpenChange,
  editingDivision,
  divisionTerm
}: {
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingDivision: Division | null;
  divisionTerm: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [values, setValues] = useState<DivisionFormValues>(() =>
    editingDivision
      ? { name: editingDivision.name, code: editingDivision.code ?? "", description: editingDivision.description ?? "" }
      : EMPTY_FORM
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const label = divisionTerm || "division";

  useEffect(() => {
    if (open) {
      setError(null);
      if (editingDivision) {
        setValues({
          name: editingDivision.name,
          code: editingDivision.code ?? "",
          description: editingDivision.description ?? ""
        });
      } else {
        setValues(EMPTY_FORM);
      }
    }
  }, [open, editingDivision]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const payload = {
      name: values.name,
      code: editingDivision ? (values.code || null) : (values.code || undefined),
      description: editingDivision ? (values.description || null) : (values.description || undefined)
    };
    try {
      if (editingDivision) {
        await apiClient.patch(`/tenants/${slug}/structure/divisions/${editingDivision.id}`, payload);
        toast({ title: `${label[0].toUpperCase()}${label.slice(1)} updated`, variant: "success" });
      } else {
        await apiClient.post(`/tenants/${slug}/structure/divisions`, payload);
        toast({ title: `${label[0].toUpperCase()}${label.slice(1)} added`, variant: "success" });
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
      <DialogContent className="w-[95vw] max-w-lg sm:w-[520px] flex flex-col p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="p-5 pb-3 border-b border-border bg-muted/20 shrink-0">
          <DialogTitle>{editingDivision ? `Edit ${label}` : `Add a ${label}`}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1" noValidate>
          <div className="p-5 space-y-4">
            <FormField label="Name" htmlFor="division-name" required error={error ?? undefined}>
              <Input
                id="division-name"
                required
                invalid={Boolean(error)}
                value={values.name}
                onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
              />
            </FormField>
            <FormField
              label={`${label} Code / House Number Prefix`}
              htmlFor="division-code"
              hint={`Prefix code for house numbers in this ${label.toLowerCase()} (e.g. KBD for Kambalakkad → KBD01)`}
            >
              <Input
                id="division-code"
                placeholder="e.g. KBD"
                value={values.code}
                onChange={(e) => setValues((v) => ({ ...v, code: e.target.value.toUpperCase() }))}
                className="font-mono uppercase"
              />
            </FormField>
            <FormField label="Description" htmlFor="division-description" hint="Optional">
              <Textarea
                id="division-description"
                value={values.description}
                onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
              />
            </FormField>
          </div>
          <DialogFooter className="p-4 px-5 border-t border-border bg-muted/20 flex items-center justify-end gap-2 shrink-0">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              {editingDivision ? "Save Changes" : `Add ${label}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
