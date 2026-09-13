"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  ConfirmDialog,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  EmptyState,
  FormField,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
  Trash,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { ServiceRequest, ServiceRequestStatus } from "@/lib/services";

const STATUS_LABELS: Record<ServiceRequestStatus, string> = {
  SUBMITTED: "Submitted",
  IN_REVIEW: "In review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  COMPLETED: "Completed"
};

const STATUS_TONE: Record<ServiceRequestStatus, "outline" | "secondary" | "destructive"> = {
  SUBMITTED: "outline",
  IN_REVIEW: "outline",
  APPROVED: "secondary",
  REJECTED: "destructive",
  COMPLETED: "secondary"
};

export function ServiceRequestsTable({ slug, requests }: { slug: string; requests: ServiceRequest[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<ServiceRequestStatus | "">("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [removeTarget, setRemoveTarget] = useState<ServiceRequest | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const selected = selectedId ? (requests.find((r) => r.id === selectedId) ?? null) : null;
  const filtered = useMemo(() => (statusFilter ? requests.filter((r) => r.status === statusFilter) : requests), [requests, statusFilter]);

  useEffect(() => {
    setNotes(selected?.resolutionNotes ?? "");
  }, [selectedId, selected?.resolutionNotes]);

  async function updateStatus(id: string, status: ServiceRequestStatus, resolutionNotes?: string) {
    setIsUpdating(true);
    try {
      await apiClient.patch(`/tenants/${slug}/services/${id}`, { status, resolutionNotes });
      toast({ title: `Marked ${STATUS_LABELS[status].toLowerCase()}`, variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't update that request.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleRemove() {
    if (!removeTarget) return;
    setIsRemoving(true);
    try {
      await apiClient.delete(`/tenants/${slug}/services/${removeTarget.id}`);
      toast({ title: "Removed", variant: "success" });
      setRemoveTarget(null);
      setSelectedId(null);
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't remove that request.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <div className="space-y-4">
      <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ServiceRequestStatus | "")} className="max-w-[200px]">
        <option value="">All statuses</option>
        {(Object.entries(STATUS_LABELS) as [ServiceRequestStatus, string][]).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>

      {filtered.length === 0 ? (
        <EmptyState title="No requests" description="Requests will appear here once submitted." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((request) => (
                <TableRow key={request.id} className="cursor-pointer" onClick={() => setSelectedId(request.id)}>
                  <TableCell className="font-medium">{request.requestType}</TableCell>
                  <TableCell>{request.requesterName}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">{request.subject}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_TONE[request.status]}>{STATUS_LABELS[request.status]}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{new Date(request.createdAt).toLocaleDateString("en-IN")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Drawer open={selected !== null} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DrawerContent>
          {selected && (
            <>
              <DrawerHeader>
                <DrawerTitle className="truncate">{selected.subject}</DrawerTitle>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Badge variant={STATUS_TONE[selected.status]}>{STATUS_LABELS[selected.status]}</Badge>
                  <Badge variant="outline">{selected.requestType}</Badge>
                </div>
              </DrawerHeader>
              <DrawerBody>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">Requester:</span> {selected.requesterName}
                  </p>
                  {selected.requesterPhone && (
                    <p>
                      <span className="text-muted-foreground">Phone:</span> {selected.requesterPhone}
                    </p>
                  )}
                  {selected.description && (
                    <p>
                      <span className="text-muted-foreground">Description:</span> {selected.description}
                    </p>
                  )}
                  {selected.registerType && (
                    <p>
                      <span className="text-muted-foreground">Relates to:</span> {selected.registerType} register
                    </p>
                  )}
                  {selected.event && (
                    <p>
                      <span className="text-muted-foreground">Event:</span> {selected.event.title}
                    </p>
                  )}
                </div>

                <FormField label="Resolution notes" htmlFor="request-notes">
                  <Textarea id="request-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={selected.resolutionNotes ?? ""} />
                </FormField>
              </DrawerBody>
              <DrawerFooter className="flex-wrap">
                {selected.status !== "REJECTED" && selected.status !== "COMPLETED" && (
                  <Button variant="outline" isLoading={isUpdating} onClick={() => updateStatus(selected.id, "REJECTED", notes || undefined)}>
                    Reject
                  </Button>
                )}
                {selected.status === "SUBMITTED" && (
                  <Button variant="outline" isLoading={isUpdating} onClick={() => updateStatus(selected.id, "IN_REVIEW")}>
                    Start review
                  </Button>
                )}
                {(selected.status === "SUBMITTED" || selected.status === "IN_REVIEW") && (
                  <Button isLoading={isUpdating} onClick={() => updateStatus(selected.id, "APPROVED")}>
                    Approve
                  </Button>
                )}
                {selected.status === "APPROVED" && (
                  <Button isLoading={isUpdating} onClick={() => updateStatus(selected.id, "COMPLETED", notes || undefined)}>
                    Mark completed
                  </Button>
                )}
                <Button variant="ghost" onClick={() => setRemoveTarget(selected)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>

      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title={`Remove this request?`}
        description="This action cannot be undone from here."
        confirmLabel="Remove"
        destructive
        isConfirming={isRemoving}
        onConfirm={handleRemove}
      />
    </div>
  );
}
