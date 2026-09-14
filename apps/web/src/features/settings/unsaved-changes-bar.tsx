"use client";

import { Button } from "@mahalle/ui";

export interface UnsavedChangesBarProps {
  visible: boolean;
  saving: boolean;
  disabled?: boolean;
  onDiscard: () => void;
  onSave: () => void;
}

export function UnsavedChangesBar({ visible, saving, disabled = false, onDiscard, onSave }: UnsavedChangesBarProps) {
  if (!visible) return null;
  return (
    <div className="sticky bottom-4 z-20" role="region" aria-label="Unsaved changes">
      <div className="mx-auto flex max-w-xl flex-col gap-3 rounded-2xl border border-border/80 bg-card/95 px-4 py-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-foreground">You have unsaved changes</p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onDiscard} disabled={saving}>
            Discard
          </Button>
          <Button size="sm" onClick={onSave} isLoading={saving} disabled={disabled}>
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
