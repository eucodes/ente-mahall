import * as React from "react";
import { cn } from "../lib/cn";

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  /**
   * When true (default), pressing Enter in text/number/date fields moves focus to the next field.
   * On the last field or on submit buttons, Enter submits the form normally.
   * Multi-line textareas and dropdown menus are preserved without interference.
   */
  enterKeyNavigation?: boolean;
}

const FOCUSABLE_SELECTOR = [
  'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([disabled]):not([readonly])',
  "select:not([disabled]):not([readonly])",
  "textarea:not([disabled]):not([readonly])",
  '[tabindex]:not([tabindex="-1"]):not([disabled])'
].join(", ");

export function useFormEnterNavigation(enabled = true) {
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (!enabled || e.defaultPrevented || e.key !== "Enter") {
        return;
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Do not intercept Enter if inside textarea (allows newlines)
      if (target instanceof HTMLTextAreaElement) {
        return;
      }

      // Do not intercept Enter if target is explicitly a submit/button control
      if (
        target instanceof HTMLButtonElement ||
        (target instanceof HTMLInputElement && target.type === "submit")
      ) {
        return;
      }

      // Do not intercept if element or an ancestor has data-skip-enter-nav
      if (target.closest("[data-skip-enter-nav='true']")) {
        return;
      }

      // Do not intercept if target has aria-expanded="true" or is handling a custom dropdown/combobox
      if (
        target.getAttribute("aria-expanded") === "true" ||
        target.closest("[role='listbox']") ||
        target.closest("[data-radix-popper-content-wrapper]")
      ) {
        return;
      }

      const form = e.currentTarget;
      const allFocusable = Array.from(
        form.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => {
        // Only include visible elements that don't have tabIndex < 0
        return (
          el.tabIndex >= 0 &&
          (el.offsetWidth > 0 ||
            el.offsetHeight > 0 ||
            el.getClientRects().length > 0)
        );
      });

      const currentIndex = allFocusable.indexOf(target);
      if (currentIndex === -1) {
        return;
      }

      // If user pressed Shift+Enter, move to the previous field if possible
      if (e.shiftKey) {
        if (currentIndex > 0) {
          e.preventDefault();
          const prev = allFocusable[currentIndex - 1];
          if (prev) {
            prev.focus();
            if (prev instanceof HTMLInputElement && typeof prev.select === "function") {
              prev.select();
            }
          }
        }
        return;
      }

      // If this is NOT the last focusable field in the form, move focus to the next field
      if (currentIndex < allFocusable.length - 1) {
        e.preventDefault();
        const next = allFocusable[currentIndex + 1];
        if (next) {
          next.focus();
          if (next instanceof HTMLInputElement && typeof next.select === "function") {
            next.select();
          }
        }
      }
      // If it IS the last focusable element, let the browser trigger the standard form submit!
    },
    [enabled]
  );

  return { handleKeyDown };
}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, enterKeyNavigation = true, onKeyDown, children, ...props }, ref) => {
    const { handleKeyDown } = useFormEnterNavigation(enterKeyNavigation);

    const onFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      handleKeyDown(e);
      if (onKeyDown) {
        onKeyDown(e);
      }
    };

    return (
      <form
        ref={ref}
        className={cn("space-y-4", className)}
        onKeyDown={onFormKeyDown}
        {...props}
      >
        {children}
      </form>
    );
  }
);
Form.displayName = "Form";
