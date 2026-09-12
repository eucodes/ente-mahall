"use client";

import { useState, type FormEvent } from "react";
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
  const [values, setValues] = useState<DivisionFormValues>(
    editingDivision
      ? { name: editingDivision.name, code: editingDivision.code ?? "", description: editingDivision.description ?? "" }
      : EMPTY_FORM
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const label = divisionTerm || "division";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const payload = {
      name: values.name,
      code: values.code || undefined,
      description: values.description || undefined
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingDivision ? `Edit ${label}` : `Add a ${label}`}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormField label="Name" htmlFor="division-name" required error={error ?? undefined}>
            <Input
              id="division-name"
              required
              invalid={Boolean(error)}
              value={values.name}
              onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            />
          </FormField>
          <FormField label="Code" htmlFor="division-code" hint="Optional">
            <Input id="division-code" value={values.code} onChange={(e) => setValues((v) => ({ ...v, code: e.target.value }))} />
          </FormField>
          <FormField label="Description" htmlFor="division-description" hint="Optional">
            <Textarea
              id="division-description"
              value={values.description}
              onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
            />
          </FormField>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingDivision ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
