"use client";

import { useEffect, useState } from "react";
import { Button, EmptyState, Receipt, RefreshCw, Skeleton, cn } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import { formatCurrency, formatDate } from "./record-utils";
import { RecordPanel } from "./record-layout";

interface CollectionRecord {
  id: string;
  receiptNumber?: string | null;
  date: string;
  amount: string | number;
  paymentMethod?: string | null;
  description?: string | null;
  category?: { name: string } | null;
}

interface HistoryData {
  records: CollectionRecord[];
  totalPaid: number;
  outstanding: number | null;
  totalCount: number;
}

const MEMBER_PAGE_SIZE = 20;

async function fetchHistory(slug: string, kind: "member" | "family", id: string): Promise<HistoryData> {
  if (kind === "family") {
    const res = await apiClient.get<{ totalPaid: string; outstandingAmount: string; collections: CollectionRecord[] }>(
      `/tenants/${slug}/finance/collections/family/${id}`
    );
    const records = res?.collections ?? [];
    return {
      records,
      totalPaid: Number(res?.totalPaid ?? 0),
      outstanding: Number(res?.outstandingAmount ?? 0),
      totalCount: records.length
    };
  }
  const res = await apiClient.get<{ collections: CollectionRecord[]; total: number }>(
    `/tenants/${slug}/finance/collections?memberId=${id}&page=1&pageSize=${MEMBER_PAGE_SIZE}`
  );
  const records = res?.collections ?? [];
  return {
    records,
    totalPaid: records.reduce((sum, rec) => sum + Number(rec.amount), 0),
    outstanding: null,
    totalCount: res?.total ?? records.length
  };
}

export interface ContributionHistoryProps {
  slug: string;
  kind: "member" | "family";
  id: string;
}

export function ContributionHistory({ slug, kind, id }: ContributionHistoryProps) {
  const [data, setData] = useState<HistoryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchHistory(slug, kind, id)
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Couldn't load contribution history.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, kind, id, reloadKey]);

  function reload() {
    setLoading(true);
    setReloadKey((key) => key + 1);
  }

  const latestDate = data?.records.reduce<string | null>((latest, rec) => (!latest || rec.date > latest ? rec.date : latest), null);
  // The member endpoint is paged, so the sum only covers the receipts we fetched.
  const isPartial = data ? data.totalCount > data.records.length : false;

  return (
    <RecordPanel
      title="Contributions"
      icon={<Receipt />}
      flush
      action={
        <Button variant="ghost" size="icon-sm" onClick={reload} disabled={loading} aria-label="Refresh contributions">
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
        </Button>
      }
    >
      {loading && !data ? (
        <div className="space-y-3 p-5">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-start gap-3 p-5">
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button size="sm" variant="outline" onClick={reload}>
            Try again
          </Button>
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 divide-y divide-border/60 border-b border-border/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <SummaryTile
              label={isPartial ? `Latest ${data.records.length} receipts` : "Total contributed"}
              value={formatCurrency(data.totalPaid)}
              tone="positive"
            />
            <SummaryTile label="Receipts" value={String(data.totalCount)} />
            {kind === "family" ? (
              <SummaryTile
                label="Outstanding dues"
                value={formatCurrency(data.outstanding ?? 0)}
                tone={(data.outstanding ?? 0) > 0 ? "negative" : undefined}
              />
            ) : (
              <SummaryTile label="Last payment" value={formatDate(latestDate) ?? "—"} />
            )}
          </div>

          {data.records.length === 0 ? (
            <EmptyState
              title="No contributions yet"
              description={`Collections recorded against this ${kind === "family" ? "household" : "member"} will appear here.`}
            />
          ) : (
            <ul className="divide-y divide-border/60">
              {data.records.map((rec) => (
                <li key={rec.id} className="flex items-center justify-between gap-4 px-5 py-3 transition-colors hover:bg-muted/30">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {rec.category?.name || "Collection"}
                      {rec.description && <span className="font-normal text-muted-foreground"> · {rec.description}</span>}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
                      {rec.receiptNumber ? `#${rec.receiptNumber}` : rec.id.slice(0, 8).toUpperCase()}
                      {formatDate(rec.date) && ` · ${formatDate(rec.date)}`}
                      {rec.paymentMethod && ` · ${rec.paymentMethod}`}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">{formatCurrency(rec.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}
    </RecordPanel>
  );
}

function SummaryTile({ label, value, tone }: { label: string; value: string; tone?: "positive" | "negative" }) {
  return (
    <div className="px-5 py-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 text-lg font-bold tabular-nums text-foreground",
          tone === "positive" && "text-emerald-600 dark:text-emerald-400",
          tone === "negative" && "text-rose-600 dark:text-rose-400"
        )}
      >
        {value}
      </p>
    </div>
  );
}
