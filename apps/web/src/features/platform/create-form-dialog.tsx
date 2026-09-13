"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";

export function CreateFormDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const { toast } = useToast();
  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [isPlatformWide, setIsPlatformWide] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const { form } = await apiClient.post<{ form: { id: string } }>("/platform/forms", {
        key,
        name,
        category: category || undefined,
        isPlatformWide
      });
      toast({ title: "Form created", variant: "success" });
      onOpenChange(false);
      router.push(`/forms/${form.id}`);
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
          <DialogTitle>New form</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Name" htmlFor="form-name">
            <Input id="form-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Marriage NOC Request" />
          </FormField>
          <FormField label="Key" htmlFor="form-key" hint="Lowercase, hyphens only. Never changes once set.">
            <Input
              id="form-key"
              required
              autoComplete="off"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="marriage-noc"
            />
          </FormField>
          <FormField label="Category (optional)" htmlFor="form-category">
            <Input id="form-category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Certificates" />
          </FormField>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={isPlatformWide} onChange={() => setIsPlatformWide((v) => !v)} />
            Assign to every Mahalle by default
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" isLoading={isSubmitting}>
              Create form
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
