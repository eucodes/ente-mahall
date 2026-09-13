"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, FormField, Input, Select, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";

export function CreatePlanDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const { toast } = useToast();
  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [priceMinor, setPriceMinor] = useState("");
  const [billingPeriod, setBillingPeriod] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await apiClient.post("/platform/plans", {
        key,
        name,
        billingPeriod,
        priceMinor: priceMinor.trim() ? Math.round(parseFloat(priceMinor) * 100) : undefined
      });
      toast({ title: "Plan created", variant: "success" });
      setKey("");
      setName("");
      setPriceMinor("");
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
          <DialogTitle>New plan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Name" htmlFor="plan-name">
            <Input id="plan-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Growth" />
          </FormField>
          <FormField label="Key" htmlFor="plan-key" hint="Lowercase, hyphens only. Never changes once set.">
            <Input id="plan-key" required autoComplete="off" value={key} onChange={(e) => setKey(e.target.value)} placeholder="growth" />
          </FormField>
          <FormField label="Price (leave blank for custom/contact-us pricing)" htmlFor="plan-price">
            <Input
              id="plan-price"
              type="number"
              min={0}
              step="0.01"
              value={priceMinor}
              onChange={(e) => setPriceMinor(e.target.value)}
              placeholder="999.00"
            />
          </FormField>
          <FormField label="Billing period" htmlFor="plan-period">
            <Select id="plan-period" value={billingPeriod} onChange={(e) => setBillingPeriod(e.target.value as "MONTHLY" | "YEARLY")}>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </Select>
          </FormField>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" isLoading={isSubmitting}>
              Create plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
