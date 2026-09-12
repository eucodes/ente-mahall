import { Card, CardContent, CardHeader, CardTitle, Check } from "@mahalle/ui";

const COMPLETED_ITEMS = ["Create Mahallu", "Administrator account", "Mahallu profile", "Mahallu structure"];
const REMAINING_ITEMS = [
  "Add committee members",
  "Register families",
  "Add staff",
  "Configure collections",
  "Configure certificates",
  "Complete other administrative settings"
];

/**
 * Shown only for Mahalles created through the full onboarding wizard (see
 * TenantAdminHomePage — gated on `tenant.country`, which only the wizard's
 * Location step ever sets). Purely informational: it never blocks or gates
 * any part of the dashboard.
 */
export function SetupChecklist() {
  const total = COMPLETED_ITEMS.length + REMAINING_ITEMS.length;
  const percent = Math.round((COMPLETED_ITEMS.length / total) * 100);

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Complete your Mahallu setup</CardTitle>
          <span className="text-sm font-medium text-muted-foreground">{percent}% complete</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Completed</p>
          <ul className="space-y-1.5">
            {COMPLETED_ITEMS.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm">
                <Check className="h-3.5 w-3.5 shrink-0 text-success" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Remaining</p>
          <ul className="space-y-1.5">
            {REMAINING_ITEMS.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm">
                <span aria-hidden className="h-3.5 w-3.5 shrink-0 rounded-full border border-muted-foreground/40" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
