# Working conventions — Ente Mahall

Read [DECISIONS.md](./DECISIONS.md) first for *why* the architecture looks the way it does. This
file is standing conventions for how code gets written in this repo going forward — apply these
without being asked again.

## Shared/common components, not one-off UI

Before building a new piece of UI, check whether it belongs in the shared layer instead of the
page/feature that needs it first:

- **Web** (`apps/web`): `src/components/ui/` is vendored shadcn primitives — don't hand-edit these
  beyond what `shadcn add` generates. `src/components/common/` is for your own composed, reusable
  components built on top of `ui/` (the confirm-dialog provider lives here; add things like a
  `PageHeader`, `EmptyState`, `DataTable` wrapper, etc. here as they're needed by more than one
  screen — not per-feature).
- **Mobile** (`mobile/core`): anything used by both `mobile/client` and `mobile/admin` — API
  client, models, and shared widgets — lives in this package, not duplicated in each app.

Don't build a second version of something that already exists in `common/`/`mobile/core` because
it was faster than importing it.

## Never use native browser/OS popups — always the custom components

- **Web**: `window.alert`, `window.confirm`, and `window.prompt` are banned by ESLint
  (`no-restricted-globals` / `no-restricted-properties` in `apps/web/eslint.config.mjs`) —
  `pnpm --filter web lint` fails if you use them. Use instead:
  - **Messages** (success/error/info/warning, non-blocking): the `alert` helper from
    `@/lib/alert` — e.g. `alert.success("Member added")`. This wraps sonner's `toast()`; don't
    call `toast()` directly, go through this helper so the API stays consistent if the underlying
    toast library ever changes.
  - **Confirmations** (yes/no before a destructive or important action): `useConfirm()` from
    `@/components/common/confirm-dialog` — e.g.
    `const ok = await confirm({ title: "Delete this member?", destructive: true })`. It's already
    mounted once in `app/providers.tsx`; just call the hook wherever you need it.
  - Anything that needs more than a title/description/confirm-cancel (a form inside a modal, for
    instance) — build it with `@/components/ui/dialog`, not `alert-dialog`.
- **Mobile** (`mobile/core`): don't call `showDialog`/`ScaffoldMessenger.of(context).showSnackBar`
  directly in `mobile/client` or `mobile/admin`. Use instead:
  - `showAppSnackBar(context, message: "...", type: AppSnackBarType.success)` for messages
  - `showAppConfirmDialog(context, title: "...", destructive: true)` (returns `Future<bool>`) for
    confirmations
  - `showAppAlertDialog(context, title: "...")` for a single-button informational dialog

Both `mobile/client/lib/main.dart` and `mobile/admin/lib/main.dart` have a working reference call
to these — look there for the pattern before writing a new screen.
