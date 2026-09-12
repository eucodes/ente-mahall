"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, FormField, Input, Select, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Family } from "@/lib/business-resources";
import type { House } from "@/lib/houses";

interface FamilyFormValues {
  name: string;
  address: string;
  phone: string;
  houseId: string;
}

const EMPTY_FORM: FamilyFormValues = { name: "", address: "", phone: "", houseId: "" };

export function FamilyFormDialog({
  slug,
  open,
  onOpenChange,
  editingFamily,
  houses
}: {
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingFamily: Family | null;
  houses: House[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [values, setValues] = useState<FamilyFormValues>(
    editingFamily
      ? {
          name: editingFamily.name,
          address: editingFamily.address ?? "",
          phone: editingFamily.phone ?? "",
          houseId: editingFamily.houseId ?? ""
        }
      : EMPTY_FORM
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const payload = {
      name: values.name,
      address: values.address || undefined,
      phone: values.phone || undefined,
      houseId: values.houseId || undefined
    };
    try {
      if (editingFamily) {
        await apiClient.patch(`/tenants/${slug}/families/${editingFamily.id}`, payload);
        toast({ title: "Family updated", variant: "success" });
      } else {
        await apiClient.post(`/tenants/${slug}/families`, payload);
        toast({ title: "Family added", variant: "success" });
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
          <DialogTitle>{editingFamily ? "Edit family" : "Add a family"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormField label="Family name" htmlFor="family-name" required error={error ?? undefined}>
            <Input
              id="family-name"
              required
              invalid={Boolean(error)}
              value={values.name}
              onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            />
          </FormField>
          <FormField label="Address" htmlFor="family-address">
            <Input
              id="family-address"
              value={values.address}
              onChange={(e) => setValues((v) => ({ ...v, address: e.target.value }))}
            />
          </FormField>
          <FormField label="Phone" htmlFor="family-phone">
            <Input
              id="family-phone"
              value={values.phone}
              onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
            />
          </FormField>
          <FormField
            label="House"
            htmlFor="family-house"
            hint={houses.length === 0 ? "No houses yet — add one from the Houses page." : undefined}
          >
            <Select id="family-house" value={values.houseId} onChange={(e) => setValues((v) => ({ ...v, houseId: e.target.value }))}>
              <option value="">No house linked</option>
              {houses.map((house) => (
                <option key={house.id} value={house.id}>
                  {house.displayNumber}
                  {house.division ? ` — ${house.division.name}` : ""}
                </option>
              ))}
            </Select>
          </FormField>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingFamily ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
