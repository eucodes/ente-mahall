"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, Select, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { PlanSummary, SubscriptionSummary } from "@/lib/billing";

const STATUSES = ["TRIAL", "ACTIVE", "PAST_DUE", "SUSPENDED", "CANCELLED", "EXPIRED"] as const;

const STATUS_TONE: Record<(typeof STATUSES)[number], "success" | "outline" | "destructive"> = {
  TRIAL: "outline",
  ACTIVE: "success",
  PAST_DUE: "destructive",
  SUSPENDED: "destructive",
  CANCELLED: "outline",
  EXPIRED: "outline"
};

export function TenantSubscriptionEditor({
  tenantId,
  subscription,
  plans
}: {
  tenantId: string;
  subscription: SubscriptionSummary | null;
  plans: PlanSummary[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [planId, setPlanId] = useState(subscription?.plan.id ?? plans[0]?.id ?? "");
  const [isAssigning, setIsAssigning] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  useEffect(() => {
    setPlanId(subscription?.plan.id ?? plans[0]?.id ?? "");
  }, [subscription?.plan.id, plans]);

  async function handleAssignPlan() {
    if (!planId) return;
    setIsAssigning(true);
    try {
      await apiClient.patch(`/platform/tenants/${tenantId}/billing/subscription`, { planId });
      toast({ title: subscription ? "Plan changed" : "Plan assigned", variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong.";
      toast({ title: "Couldn't assign plan", description: message, variant: "destructive" });
    } finally {
      setIsAssigning(false);
    }
  }

  async function handleStatusChange(status: string) {
    setIsChangingStatus(true);
    try {
      await apiClient.patch(`/platform/tenants/${tenantId}/billing/subscription/status`, { status });
      toast({ title: "Subscription status updated", variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong.";
      toast({ title: "Couldn't update status", description: message, variant: "destructive" });
    } finally {
      setIsChangingStatus(false);
    }
  }

  if (plans.length === 0) {
    return <p className="text-sm text-muted-foreground">Create a plan first before assigning a subscription.</p>;
  }

  return (
    <div className="space-y-4">
      {subscription && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Subscription status:</span>
          <Badge variant={STATUS_TONE[subscription.status as (typeof STATUSES)[number]] ?? "outline"}>
            {subscription.status.replace("_", " ")}
          </Badge>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-48">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Plan</label>
          <Select value={planId} onChange={(e) => setPlanId(e.target.value)}>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
          </Select>
        </div>
        <Button size="sm" isLoading={isAssigning} onClick={handleAssignPlan}>
          {subscription ? "Change plan" : "Assign plan"}
        </Button>
      </div>

      {subscription && (
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-48">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Status</label>
            <Select value={subscription.status} disabled={isChangingStatus} onChange={(e) => handleStatusChange(e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
