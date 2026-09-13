"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { FeatureSummary } from "@/lib/features";

export function PlanFeaturesDialog({
  planId,
  planName,
  currentFeatureIds,
  features,
  open,
  onOpenChange
}: {
  planId: string;
  planName: string;
  currentFeatureIds: string[];
  features: FeatureSummary[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [selected, setSelected] = useState<Set<string>>(new Set(currentFeatureIds));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setSelected(new Set(currentFeatureIds));
    }
  }, [open, currentFeatureIds]);

  function toggle(featureId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(featureId)) {
        next.delete(featureId);
      } else {
        next.add(featureId);
      }
      return next;
    });
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await apiClient.patch(`/platform/plans/${planId}/features`, { featureIds: Array.from(selected) });
      toast({ title: "Plan entitlements updated", variant: "success" });
      onOpenChange(false);
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong.";
      toast({ title: "Couldn't update entitlements", description: message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  const grouped = features.reduce<Record<string, FeatureSummary[]>>((acc, f) => {
    const category = f.category ?? "Other";
    (acc[category] ??= []).push(f);
    return acc;
  }, {});

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{planName} — included features</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.entries(grouped).map(([category, categoryFeatures]) => (
            <div key={category} className="space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{category}</p>
              {categoryFeatures.map((feature) => (
                <label key={feature.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={selected.has(feature.id)}
                    onChange={() => toggle(feature.id)}
                    disabled={!feature.isEnabledGlobally}
                  />
                  <span className={!feature.isEnabledGlobally ? "text-muted-foreground" : undefined}>
                    {feature.name}
                    {!feature.isEnabledGlobally && " (platform-disabled)"}
                  </span>
                </label>
              ))}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button isLoading={isSaving} onClick={handleSave}>
            Save entitlements
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
