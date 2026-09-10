import { toast } from "sonner";

/**
 * App-wide replacement for native `window.alert` and for calling `toast()`
 * directly — every non-blocking message goes through this so the wording/tone
 * (and, later, styling) stays consistent. For anything requiring a yes/no
 * decision, use `useConfirm()` (components/common/confirm-dialog.tsx) instead.
 */
export const alert = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast.info(message),
  warning: (message: string) => toast.warning(message),
};
