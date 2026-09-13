"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, FormField, Input, Select, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { CommitteePost } from "@/lib/committee";
import type { Member } from "@/lib/members";

interface FormValues {
  memberId: string;
  designation: string;
  displayOrder: string;
  termStart: string;
  termEnd: string;
}

function toDateInputValue(iso: string | null): string {
  return iso ? iso.slice(0, 10) : "";
}

const EMPTY_FORM: FormValues = { memberId: "", designation: "", displayOrder: "0", termStart: "", termEnd: "" };

export function CommitteePostFormDialog({
  slug,
  open,
  onOpenChange,
  editingPost,
  members
}: {
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPost: CommitteePost | null;
  members: Member[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [values, setValues] = useState<FormValues>(() =>
    editingPost
      ? {
          memberId: editingPost.memberId,
          designation: editingPost.designation,
          displayOrder: String(editingPost.displayOrder),
          termStart: toDateInputValue(editingPost.termStart),
          termEnd: toDateInputValue(editingPost.termEnd)
        }
      : EMPTY_FORM
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setError(null);
      if (editingPost) {
        setValues({
          memberId: editingPost.memberId,
          designation: editingPost.designation,
          displayOrder: String(editingPost.displayOrder),
          termStart: toDateInputValue(editingPost.termStart),
          termEnd: toDateInputValue(editingPost.termEnd)
        });
      } else {
        setValues(EMPTY_FORM);
      }
    }
  }, [open, editingPost]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const payload = {
      memberId: values.memberId,
      designation: values.designation,
      displayOrder: values.displayOrder ? Number(values.displayOrder) : undefined,
      termStart: editingPost ? (values.termStart || null) : (values.termStart || undefined),
      termEnd: editingPost ? (values.termEnd || null) : (values.termEnd || undefined)
    };
    try {
      if (editingPost) {
        await apiClient.patch(`/tenants/${slug}/committee/members/${editingPost.id}`, payload);
        toast({ title: "Committee post updated", variant: "success" });
      } else {
        await apiClient.post(`/tenants/${slug}/committee/members`, payload);
        toast({ title: "Committee post added", variant: "success" });
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
          <DialogTitle>{editingPost ? "Edit committee post" : "Add a committee post"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormField
            label="Member"
            htmlFor="post-member"
            required
            error={error ?? undefined}
            hint={members.length === 0 ? "No members yet — add one from the Members page." : undefined}
          >
            <Select
              id="post-member"
              required
              value={values.memberId}
              onChange={(e) => setValues((v) => ({ ...v, memberId: e.target.value }))}
            >
              <option value="">Select a member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.fullName}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Designation" htmlFor="post-designation" required hint="e.g. President, Secretary, Treasurer">
            <Input
              id="post-designation"
              required
              value={values.designation}
              onChange={(e) => setValues((v) => ({ ...v, designation: e.target.value }))}
            />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Display order" htmlFor="post-order" hint="Lower numbers show first">
              <Input
                id="post-order"
                type="number"
                min={0}
                value={values.displayOrder}
                onChange={(e) => setValues((v) => ({ ...v, displayOrder: e.target.value }))}
              />
            </FormField>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Term start" htmlFor="post-term-start">
              <Input
                id="post-term-start"
                type="date"
                value={values.termStart}
                onChange={(e) => setValues((v) => ({ ...v, termStart: e.target.value }))}
              />
            </FormField>
            <FormField label="Term end" htmlFor="post-term-end">
              <Input
                id="post-term-end"
                type="date"
                value={values.termEnd}
                onChange={(e) => setValues((v) => ({ ...v, termEnd: e.target.value }))}
              />
            </FormField>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingPost ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
