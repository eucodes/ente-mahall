"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, FormField, Input, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";

export function CreateInvoiceDialog({ tenantId, open, onOpenChange }: { tenantId: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await apiClient.post(`/platform/tenants/${tenantId}/billing/invoices`, {
        amountMinor: Math.round(parseFloat(amount) * 100),
        description: description || undefined,
        dueAt: dueAt || undefined
      });
      toast({ title: "Invoice issued", variant: "success" });
      setAmount("");
      setDescription("");
      setDueAt("");
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
          <DialogTitle>Issue invoice</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Amount" htmlFor="invoice-amount">
            <Input id="invoice-amount" type="number" required min={0.01} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="999.00" />
          </FormField>
          <FormField label="Description (optional)" htmlFor="invoice-description">
            <Input id="invoice-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Growth plan — September" />
          </FormField>
          <FormField label="Due date (optional)" htmlFor="invoice-due">
            <Input id="invoice-due" type="date" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
          </FormField>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" isLoading={isSubmitting}>
              Issue invoice
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
