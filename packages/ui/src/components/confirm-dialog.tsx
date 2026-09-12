import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "./dialog";
import { Button } from "./button";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Renders the confirm button as destructive (red) — use for delete/revoke/irreversible actions. */
  destructive?: boolean;
  isConfirming?: boolean;
  /** Disables the confirm button independent of isConfirming — e.g. until the caller has typed a required confirmation phrase. */
  confirmDisabled?: boolean;
  onConfirm: () => void | Promise<void>;
}

/**
 * The only sanctioned way to ask "are you sure?" in this app.
 * Never use window.confirm() — it is not stylable, not accessible in a
 * consistent way across browsers, and blocks the JS event loop.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  isConfirming = false,
  confirmDisabled = false,
  onConfirm
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent role="alertdialog" aria-describedby={description ? "confirm-dialog-description" : undefined}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription id="confirm-dialog-description">{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isConfirming}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? "destructive" : "primary"}
            isLoading={isConfirming}
            disabled={confirmDisabled}
            onClick={() => onConfirm()}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
