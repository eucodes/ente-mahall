"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";

export function CommitteeDecisionForm({ slug, meetingId }: { slug: string; meetingId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!description.trim()) return;
    setIsSubmitting(true);
    try {
      await apiClient.post(`/tenants/${slug}/committee/meetings/${meetingId}/decisions`, { description });
      setDescription("");
      toast({ title: "Decision recorded", variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't record that decision.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder="Record a decision…"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" size="sm" isLoading={isSubmitting}>
        Add
      </Button>
    </form>
  );
}
