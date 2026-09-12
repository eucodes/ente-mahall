"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, FormField, Input, Select, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { House } from "@/lib/houses";
import type { Division } from "@/lib/structure";

interface HouseFormValues {
  displayNumber: string;
  divisionId: string;
  address: string;
}

const EMPTY_FORM: HouseFormValues = { displayNumber: "", divisionId: "", address: "" };

export function HouseFormDialog({
  slug,
  open,
  onOpenChange,
  editingHouse,
  divisions
}: {
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingHouse: House | null;
  divisions: Division[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [values, setValues] = useState<HouseFormValues>(
    editingHouse
      ? { displayNumber: editingHouse.displayNumber, divisionId: editingHouse.divisionId ?? "", address: editingHouse.address ?? "" }
      : EMPTY_FORM
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const payload = {
      displayNumber: values.displayNumber,
      divisionId: values.divisionId || undefined,
      address: values.address || undefined
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingHouse ? "Edit house" : "Add a house"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormField label="House number" htmlFor="house-number" required error={error ?? undefined}>
            <Input
              id="house-number"
              required
              invalid={Boolean(error)}
              placeholder="e.g. 14/A"
              value={values.displayNumber}
              onChange={(e) => setValues((v) => ({ ...v, displayNumber: e.target.value }))}
            />
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingHouse ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
