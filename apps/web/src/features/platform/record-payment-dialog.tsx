"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, FormField, Input, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";

export function RecordPaymentDialog({ tenantId, open, onOpenChange }: { tenantId: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [reference, setReference] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await apiClient.post(`/platform/tenants/${tenantId}/billing/payments`, {
        amountMinor: Math.round(parseFloat(amount) * 100),
        method,
        reference: reference || undefined
      });
      toast({ title: "Payment recorded", variant: "success" });
      setAmount("");
      setMethod("");
      setReference("");
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
          <DialogTitle>Record payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Amount" htmlFor="payment-amount">
            <Input id="payment-amount" type="number" required min={0.01} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="999.00" />
          </FormField>
          <FormField label="Method" htmlFor="payment-method" hint="e.g. bank transfer, cash, cheque.">
            <Input id="payment-method" required value={method} onChange={(e) => setMethod(e.target.value)} placeholder="Bank transfer" />
          </FormField>
          <FormField label="Reference (optional)" htmlFor="payment-reference">
            <Input id="payment-reference" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="UTR / cheque no." />
          </FormField>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" isLoading={isSubmitting}>
              Record payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
