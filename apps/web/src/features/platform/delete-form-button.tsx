"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ConfirmDialog, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";

export function DeleteFormButton({ templateId, name }: { templateId: string; name: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await apiClient.delete(`/platform/forms/${templateId}`);
      toast({ title: "Form deleted", variant: "success" });
      router.push("/forms");
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong.";
      toast({ title: "Couldn't delete form", description: message, variant: "destructive" });
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Button size="sm" variant="destructive" onClick={() => setOpen(true)}>
        Delete form
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`Delete "${name}"?`}
        description="This is only possible because it has never been published. This cannot be undone."
        confirmLabel="Delete"
        destructive
        isConfirming={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
