# UI Component System

All reusable UI lives in [`packages/ui`](../packages/ui) and is consumed by
`apps/web` (and, eventually, any other web surface). No application defines
its own one-off button, dialog, or table — if a pattern repeats, it becomes a
component here.

## Design tokens

CSS custom properties defined in `packages/ui/src/styles/globals.css`
(`--background`, `--primary`, `--radius`, etc.), with light and `.dark` value
sets. `packages/config/tailwind.preset.js` maps those variables into Tailwind
theme colors/radius/shadows, and every consuming app extends that one preset
(see `apps/web/tailwind.config.ts`) — token values are defined exactly once.

## Shipped

Phase 1: `Button`, `Input`, `Label`, `FormField`, `Card` (+ Header/Title/
Description/Content/Footer), `Badge`, `Alert`, `Spinner`, `Skeleton`,
`LoadingState`, `EmptyState`, `ErrorState`, `Dialog` primitives,
`ConfirmDialog`, and the `Toast` system (`ToastHost` + `useToast`).

Phases 4–7 (as the admin/control-plane/members screens needed them):
`Select` (native `<select>`, styled to match `Input` — fully accessible for
free), `Table`/`TableHeader`/`TableBody`/`TableRow`/`TableHead`/`TableCell`,
`Pagination`, `Textarea`.

## Added as later phases need them

`MultiSelect`, `Checkbox`, `RadioGroup`, `Switch`, `FormError`, `Avatar`,
`Tabs`, `Breadcrumb`, `Dropdown`, `Menu`, `Drawer`, `Sheet`, `Tooltip`,
`Popover`, `DatePicker`, `Calendar`, `FileUploader`, `SearchInput`,
`NotificationCenter`, `Progress`, `PageHeader`, `SectionHeader`, `Sidebar`,
`Navbar`, `UserMenu`. Each is added in the phase whose pages first need it,
following the same pattern already established (a `cva`-driven variant API,
`cn()` for class merging, tokens for color/spacing, accessible by default via
Radix primitives where relevant).

## No native browser dialogs — ever

`alert()`, `confirm()`, and `prompt()` are prohibited everywhere in this
codebase. Use:

- `useToast()` for success/error/warning/info notifications.
- `<ConfirmDialog />` for "are you sure?" and destructive-action confirmations.

Both are accessible (built on Radix Toast/Dialog primitives — keyboard
navigation, focus management, ARIA roles) and stylable, unlike native dialogs.

## Accessibility

Built into the components, not bolted on per-page: semantic HTML, visible
focus states (`focus-visible:ring-2`), `aria-invalid`/`aria-busy` where
relevant, `role="alert"` on form errors and destructive alerts, and Radix
primitives for anything requiring focus trapping (dialogs) or live-region
behavior (toasts).

## Forms

`FormField` pairs a `Label`, the input, an optional hint, and a validation
error into one consistent layout. Validation schemas live in
`packages/validation` (Zod) and run on both the client (UX) and the server
(security/integrity, via NestJS DTOs) — the frontend schema is never the only
line of defense.
