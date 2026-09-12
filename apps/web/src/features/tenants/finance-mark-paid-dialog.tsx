"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, FormField, Input, Select, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Account } from "@/lib/finance";

export function FinanceMarkPaidDialog({
  slug,
  resource,
  id,
  open,
  onOpenChange,
  accounts,
  title
}: {
  slug: string;
  resource: "dues" | "salary";
  id: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: Account[];
  title: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [accountId, setAccountId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!id) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await apiClient.post(`/tenants/${slug}/finance/${resource}/${id}/pay`, { accountId, paymentMethod: paymentMethod || undefined });
      toast({ title: "Marked as paid", variant: "success" });
      setAccountId("");
      setPaymentMethod("");
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
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormField label="Account" htmlFor="pay-account" required error={error ?? undefined}>
            <Select id="pay-account" required value={accountId} onChange={(e) => setAccountId(e.target.value)}>
              <option value="">Select an account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Payment method" htmlFor="pay-method" hint="Optional — e.g. Cash, UPI, Cheque">
            <Input id="pay-method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} />
          </FormField>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Mark paid
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
