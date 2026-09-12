"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Calendar,
  ConfirmDialog,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  EmptyState,
  MapPin,
  Pencil,
  Trash,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { CommitteeMeeting, CommitteeMeetingStatus, CommitteePost } from "@/lib/committee";
import { CommitteeMeetingFormDialog } from "./committee-meeting-form-dialog";
import { CommitteeDecisionForm } from "./committee-decision-form";

const STATUS_TONE: Record<CommitteeMeetingStatus, "secondary" | "outline" | "destructive"> = {
  SCHEDULED: "outline",
  COMPLETED: "secondary",
  CANCELLED: "destructive"
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

export function CommitteeMeetings({ slug, meetings, posts }: { slug: string; meetings: CommitteeMeeting[]; posts: CommitteePost[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<CommitteeMeeting | null>(null);
  const [removeTarget, setRemoveTarget] = useState<CommitteeMeeting | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  // Derived from the latest `meetings` prop (by id) rather than stored directly, so
  // an open drawer picks up fresh decisions/attendees after a router.refresh().
  const selected = selectedId ? (meetings.find((m) => m.id === selectedId) ?? null) : null;

  function openAddForm() {
    setEditingMeeting(null);
    setFormOpen(true);
  }

  function openEditForm(meeting: CommitteeMeeting) {
    setEditingMeeting(meeting);
    setFormOpen(true);
  }

  async function handleRemove() {
    if (!removeTarget) return;
    setIsRemoving(true);
    try {
      await apiClient.delete(`/tenants/${slug}/committee/meetings/${removeTarget.id}`);
      toast({ title: `Removed ${removeTarget.title}`, variant: "success" });
      setRemoveTarget(null);
      setSelectedId(null);
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't remove that meeting.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {meetings.length} meeting{meetings.length === 1 ? "" : "s"}
        </p>
        <Button onClick={openAddForm}>Schedule meeting</Button>
      </div>

      {meetings.length === 0 ? (
        <EmptyState title="No meetings recorded yet" description="Schedule the first one above." />
      ) : (
        <ul className="space-y-2">
          {meetings.map((meeting) => (
            <li key={meeting.id}>
              <button
                type="button"
                onClick={() => setSelectedId(meeting.id)}
                className="flex w-full flex-col gap-1 rounded-xl border border-border bg-card p-4 text-left shadow-xs transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{meeting.title}</p>
                  <p className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {formatDate(meeting.meetingDate)}
                    </span>
                    {meeting.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {meeting.location}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant={STATUS_TONE[meeting.status]}>{meeting.status[0] + meeting.status.slice(1).toLowerCase()}</Badge>
                  {meeting.decisions.length > 0 && <Badge variant="secondary">{meeting.decisions.length} decision{meeting.decisions.length === 1 ? "" : "s"}</Badge>}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <CommitteeMeetingFormDialog slug={slug} open={formOpen} onOpenChange={setFormOpen} editingMeeting={editingMeeting} posts={posts} />

      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title={`Remove ${removeTarget?.title ?? "this meeting"}?`}
        description="This also removes its recorded decisions. This action cannot be undone from here."
        confirmLabel="Remove"
        destructive
        isConfirming={isRemoving}
        onConfirm={handleRemove}
      />

      <Drawer open={selected !== null} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DrawerContent>
          {selected && (
            <>
              <DrawerHeader>
                <DrawerTitle className="truncate">{selected.title}</DrawerTitle>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge variant={STATUS_TONE[selected.status]}>{selected.status[0] + selected.status.slice(1).toLowerCase()}</Badge>
                  <span className="text-xs text-muted-foreground">{formatDate(selected.meetingDate)}</span>
                  {selected.location && <span className="text-xs text-muted-foreground">· {selected.location}</span>}
                </div>
              </DrawerHeader>
              <DrawerBody>
                {selected.agenda && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Agenda</p>
                    <p className="text-sm whitespace-pre-wrap">{selected.agenda}</p>
                  </div>
                )}

                {selected.minutes && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Minutes</p>
                    <p className="text-sm whitespace-pre-wrap">{selected.minutes}</p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Attendees ({selected.attendees.length})
                  </p>
                  {selected.attendees.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No attendance recorded.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {selected.attendees.map((a) => (
                        <Badge key={a.id} variant="outline">
                          {a.member.fullName} — {a.designation}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Decisions</p>
                  {selected.decisions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No decisions recorded yet.</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {selected.decisions.map((d) => (
                        <li key={d.id} className="rounded-lg border border-border bg-muted/40 p-2.5 text-sm">
                          {d.description}
                        </li>
                      ))}
                    </ul>
                  )}
                  <CommitteeDecisionForm slug={slug} meetingId={selected.id} />
                </div>
              </DrawerBody>
              <DrawerFooter>
                <Button variant="outline" className="flex-1" onClick={() => setRemoveTarget(selected)}>
                  <Trash className="h-4 w-4" /> Remove
                </Button>
                <Button className="flex-1" onClick={() => openEditForm(selected)}>
                  <Pencil className="h-4 w-4" /> Edit
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
