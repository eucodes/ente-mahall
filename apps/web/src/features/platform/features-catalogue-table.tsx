"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, ConfirmDialog, EmptyState, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { FeatureSummary } from "@/lib/features";
import { CreateFeatureDialog } from "./create-feature-dialog";

function GlobalToggleButton({ featureId, isEnabledGlobally, name }: { featureId: string; isEnabledGlobally: boolean; name: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleToggle() {
    setIsSaving(true);
    try {
      await apiClient.patch(`/platform/features/${featureId}`, { isEnabledGlobally: !isEnabledGlobally });
      toast({ title: isEnabledGlobally ? "Feature disabled platform-wide" : "Feature enabled platform-wide", variant: "success" });
      setConfirmOpen(false);
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong.";
      toast({ title: "Couldn't update feature", description: message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setConfirmOpen(true)}>
        {isEnabledGlobally ? "Disable" : "Enable"}
      </Button>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={isEnabledGlobally ? `Disable "${name}" platform-wide?` : `Enable "${name}" platform-wide?`}
        description={
          isEnabledGlobally
            ? "No Mahalle will be able to use this feature, regardless of any per-Mahalle override, until it's re-enabled here."
            : "Every Mahalle gets this feature unless they have an override turning it off."
        }
        confirmLabel={isEnabledGlobally ? "Disable" : "Enable"}
        destructive={isEnabledGlobally}
        isConfirming={isSaving}
        onConfirm={handleToggle}
      />
    </>
  );
}

function DeleteFeatureButton({ featureId, name }: { featureId: string; name: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await apiClient.delete(`/platform/features/${featureId}`);
      toast({ title: "Feature removed", variant: "success" });
      setOpen(false);
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong.";
      toast({ title: "Couldn't remove feature", description: message, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Button size="sm" variant="destructive" onClick={() => setOpen(true)}>
        Remove
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`Remove "${name}" from the catalogue?`}
        description="Any per-Mahalle overrides for this feature are removed too. This cannot be undone."
        confirmLabel="Remove"
        destructive
        isConfirming={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}

export function FeaturesCatalogueTable({ features }: { features: FeatureSummary[] }) {
  const [createOpen, setCreateOpen] = useState(false);

  const grouped = features.reduce<Record<string, FeatureSummary[]>>((acc, f) => {
    const category = f.category ?? "Other";
    (acc[category] ??= []).push(f);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          New feature
        </Button>
      </div>

      {features.length === 0 ? (
        <EmptyState title="No features in the catalogue yet" />
      ) : (
        Object.entries(grouped).map(([category, categoryFeatures]) => (
          <div key={category} className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{category}</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Platform default</TableHead>
                  <TableHead>Overrides</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryFeatures.map((feature) => (
                  <TableRow key={feature.id}>
                    <TableCell className="font-medium">{feature.name}</TableCell>
                    <TableCell className="text-muted-foreground">{feature.key}</TableCell>
                    <TableCell>
                      <Badge variant={feature.isEnabledGlobally ? "success" : "outline"}>
                        {feature.isEnabledGlobally ? "Enabled" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{feature.overrideCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <GlobalToggleButton featureId={feature.id} isEnabledGlobally={feature.isEnabledGlobally} name={feature.name} />
                        <DeleteFeatureButton featureId={feature.id} name={feature.name} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))
      )}

      <CreateFeatureDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
