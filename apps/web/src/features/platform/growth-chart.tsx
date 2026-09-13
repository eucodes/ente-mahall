import type { MonthBucket } from "@/lib/analytics";

function formatMonth(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

export function GrowthChart({ buckets }: { buckets: MonthBucket[] }) {
  const max = Math.max(1, ...buckets.map((b) => b.count));

  return (
    <div className="flex h-40 items-end gap-2">
      {buckets.map((bucket) => (
        <div key={bucket.month} className="flex flex-1 flex-col items-center gap-1.5">
          <span className="text-xs font-semibold text-foreground">{bucket.count}</span>
          <div
            className="w-full rounded-t-md bg-primary/80 transition-all"
            style={{ height: `${Math.max(4, (bucket.count / max) * 100)}px` }}
          />
          <span className="text-[10px] text-muted-foreground">{formatMonth(bucket.month)}</span>
        </div>
      ))}
    </div>
  );
}
