"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ConfirmDialog, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";

export function PublishVersionButton({ versionId, fieldCount }: { versionId: string; fieldCount: number }) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  async function handlePublish() {
    setIsPublishing(true);
    try {
      await apiClient.post(`/platform/forms/versions/${versionId}/publish`, {});
      toast({ title: "Version published", variant: "success" });
      setOpen(false);
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong.";
      toast({ title: "Couldn't publish", description: message, variant: "destructive" });
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <>
      <Button size="sm" disabled={fieldCount === 0} onClick={() => setOpen(true)}>
        Publish
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Publish this version?"
        description="Once published, this version's fields are frozen forever. To make further changes you'll open a new draft version."
        confirmLabel="Publish"
        isConfirming={isPublishing}
        onConfirm={handlePublish}
      />
    </>
  );
}

export function NewDraftVersionButton({ templateId }: { templateId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreate() {
    setIsCreating(true);
    try {
      await apiClient.post(`/platform/forms/${templateId}/versions`, {});
      toast({ title: "New draft version opened", variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong.";
      toast({ title: "Couldn't open a new draft", description: message, variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <Button size="sm" variant="outline" isLoading={isCreating} onClick={handleCreate}>
      Open new draft version
    </Button>
  );
}
