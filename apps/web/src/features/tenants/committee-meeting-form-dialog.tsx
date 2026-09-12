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
  Select,
  Textarea,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { CommitteeMeeting, CommitteeMeetingStatus, CommitteePost } from "@/lib/committee";

interface FormValues {
  title: string;
  meetingDate: string;
  location: string;
  agenda: string;
  minutes: string;
  status: CommitteeMeetingStatus;
  attendeeIds: string[];
}

function toDateInputValue(iso: string): string {
  return iso.slice(0, 10);
}

export function CommitteeMeetingFormDialog({
  slug,
  open,
  onOpenChange,
  editingMeeting,
  posts
}: {
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingMeeting: CommitteeMeeting | null;
  posts: CommitteePost[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [values, setValues] = useState<FormValues>(
    editingMeeting
      ? {
          title: editingMeeting.title,
          meetingDate: toDateInputValue(editingMeeting.meetingDate),
          location: editingMeeting.location ?? "",
          agenda: editingMeeting.agenda ?? "",
          minutes: editingMeeting.minutes ?? "",
          status: editingMeeting.status,
          attendeeIds: editingMeeting.attendees.map((a) => a.id)
        }
      : { title: "", meetingDate: "", location: "", agenda: "", minutes: "", status: "SCHEDULED", attendeeIds: [] }
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleAttendee(id: string) {
    setValues((v) => ({
      ...v,
      attendeeIds: v.attendeeIds.includes(id) ? v.attendeeIds.filter((a) => a !== id) : [...v.attendeeIds, id]
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const payload = {
      title: values.title,
      meetingDate: values.meetingDate,
      location: values.location || undefined,
      agenda: values.agenda || undefined,
      minutes: values.minutes || undefined,
      status: values.status,
      attendeeIds: values.attendeeIds
    };
    try {
      if (editingMeeting) {
        await apiClient.patch(`/tenants/${slug}/committee/meetings/${editingMeeting.id}`, payload);
        toast({ title: "Meeting updated", variant: "success" });
      } else {
        await apiClient.post(`/tenants/${slug}/committee/meetings`, payload);
        toast({ title: "Meeting added", variant: "success" });
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
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingMeeting ? "Edit meeting" : "Schedule a meeting"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormField label="Title" htmlFor="meeting-title" required error={error ?? undefined}>
            <Input
              id="meeting-title"
              required
              invalid={Boolean(error)}
              value={values.title}
              onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
            />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Date" htmlFor="meeting-date" required>
              <Input
                id="meeting-date"
                type="date"
                required
                value={values.meetingDate}
                onChange={(e) => setValues((v) => ({ ...v, meetingDate: e.target.value }))}
              />
            </FormField>
            <FormField label="Status" htmlFor="meeting-status">
              <Select
                id="meeting-status"
                value={values.status}
                onChange={(e) => setValues((v) => ({ ...v, status: e.target.value as CommitteeMeetingStatus }))}
              >
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </Select>
            </FormField>
          </div>
          <FormField label="Location" htmlFor="meeting-location">
            <Input id="meeting-location" value={values.location} onChange={(e) => setValues((v) => ({ ...v, location: e.target.value }))} />
          </FormField>
          <FormField label="Agenda" htmlFor="meeting-agenda">
            <Textarea id="meeting-agenda" value={values.agenda} onChange={(e) => setValues((v) => ({ ...v, agenda: e.target.value }))} />
          </FormField>
          <FormField label="Minutes" htmlFor="meeting-minutes" hint="Summary of what was discussed and decided">
            <Textarea id="meeting-minutes" value={values.minutes} onChange={(e) => setValues((v) => ({ ...v, minutes: e.target.value }))} />
          </FormField>
          <FormField
            label="Attendees"
            htmlFor="meeting-attendees"
            hint={posts.length === 0 ? "No committee posts yet — add one from the roster first." : undefined}
          >
            <div id="meeting-attendees" className="space-y-2 rounded-lg border border-border p-3">
              {posts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No committee posts to choose from.</p>
              ) : (
                posts.map((post) => (
                  <label key={post.id} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={values.attendeeIds.includes(post.id)} onChange={() => toggleAttendee(post.id)} />
                    {post.member.fullName} <span className="text-muted-foreground">— {post.designation}</span>
                  </label>
                ))
              )}
            </div>
          </FormField>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingMeeting ? "Save" : "Schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
