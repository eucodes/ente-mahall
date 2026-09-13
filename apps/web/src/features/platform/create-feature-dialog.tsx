"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, FormField, Input, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";

export function CreateFeatureDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const { toast } = useToast();
  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await apiClient.post("/platform/features", { key, name, category: category || undefined });
      toast({ title: "Feature added", variant: "success" });
      setKey("");
      setName("");
      setCategory("");
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
          <DialogTitle>New feature</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Name" htmlFor="feature-name">
            <Input id="feature-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Madrassa" />
          </FormField>
          <FormField label="Key" htmlFor="feature-key" hint="Lowercase, hyphens only. Never changes once set.">
            <Input id="feature-key" required autoComplete="off" value={key} onChange={(e) => setKey(e.target.value)} placeholder="madrassa" />
          </FormField>
          <FormField label="Category (optional)" htmlFor="feature-category">
            <Input id="feature-category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Registers" />
          </FormField>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" isLoading={isSubmitting}>
              Add feature
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
