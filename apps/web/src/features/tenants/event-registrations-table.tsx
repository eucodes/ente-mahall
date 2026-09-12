"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Checkbox,
  ConfirmDialog,
  EmptyState,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Trash,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { EventRegistration } from "@/lib/event-detail";

export function EventRegistrationsTable({ slug, eventId, registrations }: { slug: string; eventId: string; registrations: EventRegistration[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<EventRegistration | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  async function handleAdd(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await apiClient.post(`/tenants/${slug}/events/${eventId}/registrations`, { participantName: name, participantPhone: phone || undefined });
      setName("");
      setPhone("");
      toast({ title: "Participant registered", variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't register that participant.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function toggleAttended(registration: EventRegistration) {
    try {
      await apiClient.patch(`/tenants/${slug}/events/${eventId}/registrations/${registration.id}`, { attended: !registration.attended });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't update attendance.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    }
  }

  async function handleRemove() {
    if (!removeTarget) return;
    setIsRemoving(true);
    try {
      await apiClient.delete(`/tenants/${slug}/events/${eventId}/registrations/${removeTarget.id}`);
      toast({ title: "Removed", variant: "success" });
      setRemoveTarget(null);
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't remove that registration.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIsRemoving(false);
    }
  }

  const attendedCount = registrations.filter((r) => r.attended).length;

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="flex flex-col gap-2 sm:flex-row">
        <Input placeholder="Participant name" value={name} onChange={(e) => setName(e.target.value)} className="flex-1" />
        <Input placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} className="sm:max-w-[200px]" />
        <Button type="submit" isLoading={isSubmitting}>
          Register
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        {registrations.length} registered · {attendedCount} attended
      </p>

      {registrations.length === 0 ? (
        <EmptyState title="No registrations yet" description="Register the first participant above." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participant</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Attended</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((registration) => (
                <TableRow key={registration.id}>
                  <TableCell className="font-medium">{registration.participantName}</TableCell>
                  <TableCell className="text-muted-foreground">{registration.participantPhone ?? "—"}</TableCell>
                  <TableCell>
                    <label className="flex items-center gap-2">
                      <Checkbox checked={registration.attended} onChange={() => toggleAttended(registration)} />
                      {registration.attended && <Badge variant="secondary">Attended</Badge>}
                    </label>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setRemoveTarget(registration)}>
                      <Trash className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title={`Remove ${removeTarget?.participantName ?? "this registration"}?`}
        description="This action cannot be undone from here."
        confirmLabel="Remove"
        destructive
        isConfirming={isRemoving}
        onConfirm={handleRemove}
      />
    </div>
  );
}
