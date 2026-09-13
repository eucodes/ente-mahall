"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, FormField, Input, Select, Textarea, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { House } from "@/lib/houses";
import type { Division } from "@/lib/structure";

interface HouseFormValues {
  displayNumber: string;
  name: string;
  divisionId: string;
  address: string;
  notes: string;
}

function emptyForm(suggested?: string): HouseFormValues {
  return { displayNumber: suggested ?? "", name: "", divisionId: "", address: "", notes: "" };
}

export function HouseFormDialog({
  slug,
  open,
  onOpenChange,
  editingHouse,
  divisions,
  suggestedNumber
}: {
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingHouse: House | null;
  divisions: Division[];
  suggestedNumber?: string | null;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [values, setValues] = useState<HouseFormValues>(() =>
    editingHouse
      ? {
          displayNumber: editingHouse.displayNumber,
          name: editingHouse.name ?? "",
          divisionId: editingHouse.divisionId ?? "",
          address: editingHouse.address ?? "",
          notes: editingHouse.notes ?? ""
        }
      : emptyForm(suggestedNumber ?? undefined)
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setError(null);
      if (editingHouse) {
        setValues({
          displayNumber: editingHouse.displayNumber,
          name: editingHouse.name ?? "",
          divisionId: editingHouse.divisionId ?? "",
          address: editingHouse.address ?? "",
          notes: editingHouse.notes ?? ""
        });
      } else {
        setValues(emptyForm(suggestedNumber ?? undefined));
      }
    }
  }, [open, editingHouse, suggestedNumber]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const payload = {
      displayNumber: values.displayNumber,
      name: editingHouse ? (values.name || null) : (values.name || undefined),
      divisionId: editingHouse ? (values.divisionId || null) : (values.divisionId || undefined),
      address: editingHouse ? (values.address || null) : (values.address || undefined),
      notes: editingHouse ? (values.notes || null) : (values.notes || undefined)
    };
    try {
      if (editingHouse) {
        await apiClient.patch(`/tenants/${slug}/houses/${editingHouse.id}`, payload);
        toast({ title: "House updated", variant: "success" });
      } else {
        await apiClient.post(`/tenants/${slug}/houses`, payload);
        toast({ title: "House added", variant: "success" });
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
      <DialogContent className="w-[95vw] max-w-lg sm:w-[540px] flex flex-col p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="p-5 pb-3 border-b border-border bg-muted/20 shrink-0">
          <DialogTitle>{editingHouse ? "Edit house" : "Add a house"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1" noValidate>
          <div className="p-5 space-y-4">
            <FormField
              label="House number"
              htmlFor="house-number"
              required
              error={error ?? undefined}
              hint={!editingHouse && suggestedNumber ? `Suggested next number: ${suggestedNumber}` : undefined}
            >
              <Input
                id="house-number"
                required
                invalid={Boolean(error)}
                placeholder="e.g. 14/A"
                value={values.displayNumber}
                onChange={(e) => setValues((v) => ({ ...v, displayNumber: e.target.value }))}
              />
            </FormField>
            <FormField label="House name" htmlFor="house-name" hint="Optional — e.g. Green Villa">
              <Input id="house-name" value={values.name} onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} />
            </FormField>
            {divisions.length > 0 && (
              <FormField label="Division" htmlFor="house-division" hint="Optional">
                <Select
                  id="house-division"
                  value={values.divisionId}
                  onChange={(e) => setValues((v) => ({ ...v, divisionId: e.target.value }))}
                >
                  <option value="">No division</option>
                  {divisions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </Select>
              </FormField>
            )}
            <FormField label="Address" htmlFor="house-address" hint="Optional">
              <Input
                id="house-address"
                value={values.address}
                onChange={(e) => setValues((v) => ({ ...v, address: e.target.value }))}
              />
            </FormField>
            <FormField label="Notes" htmlFor="house-notes" hint="Optional">
              <Textarea id="house-notes" value={values.notes} onChange={(e) => setValues((v) => ({ ...v, notes: e.target.value }))} />
            </FormField>
          </div>
          <DialogFooter className="p-4 px-5 border-t border-border bg-muted/20 flex items-center justify-end gap-2 shrink-0">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              {editingHouse ? "Save Changes" : "Add House"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
