import type { ModuleAdoption } from "@/lib/analytics";

export function ModuleAdoptionList({ modules }: { modules: ModuleAdoption[] }) {
  if (modules.length === 0) {
    return <p className="text-sm text-muted-foreground">No features in the catalogue yet.</p>;
  }

  return (
    <div className="space-y-3">
      {modules.map((m) => (
        <div key={m.featureId} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{m.name}</span>
            <span className="text-muted-foreground">
              {m.tenantsEnabled} / {m.totalTenants} Mahalles ({m.adoptionPct}%)
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary/80" style={{ width: `${m.adoptionPct}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
