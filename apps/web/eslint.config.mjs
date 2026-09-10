import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Native browser popups can't be styled and block the JS thread — use
      // useConfirm() (components/common/confirm-dialog.tsx) for confirmations
      // and the alert helper (lib/alert.ts) for messages instead.
      "no-restricted-globals": [
        "error",
        { name: "alert", message: "Use the `alert` helper from '@/lib/alert' instead." },
        { name: "confirm", message: "Use `useConfirm()` from '@/components/common/confirm-dialog' instead." },
        { name: "prompt", message: "Use a custom dialog component instead of window.prompt." },
      ],
      "no-restricted-properties": [
        "error",
        { object: "window", property: "alert", message: "Use the `alert` helper from '@/lib/alert' instead." },
        { object: "window", property: "confirm", message: "Use `useConfirm()` from '@/components/common/confirm-dialog' instead." },
        { object: "window", property: "prompt", message: "Use a custom dialog component instead of window.prompt." },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
