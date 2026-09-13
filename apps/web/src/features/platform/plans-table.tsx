"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, ConfirmDialog, EmptyState, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { PlanSummary } from "@/lib/billing";
import type { FeatureSummary } from "@/lib/features";
import { CreatePlanDialog } from "./create-plan-dialog";
import { PlanFeaturesDialog } from "./plan-features-dialog";

function formatPrice(plan: PlanSummary) {
  if (plan.priceMinor === null) return "Custom";
  const amount = (plan.priceMinor / 100).toLocaleString("en-IN", { style: "currency", currency: plan.currency });
  return `${amount} / ${plan.billingPeriod === "MONTHLY" ? "mo" : "yr"}`;
}

function DeletePlanButton({ planId, name, subscriberCount }: { planId: string; name: string; subscriberCount: number }) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await apiClient.delete(`/platform/plans/${planId}`);
      toast({ title: "Plan removed", variant: "success" });
      setOpen(false);
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong.";
      toast({ title: "Couldn't remove plan", description: message, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Button size="sm" variant="destructive" disabled={subscriberCount > 0} onClick={() => setOpen(true)}>
        Remove
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`Remove "${name}"?`}
        description="This cannot be undone."
        confirmLabel="Remove"
        destructive
        isConfirming={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}

export function PlansTable({ plans, features }: { plans: PlanSummary[]; features: FeatureSummary[] }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [entitlementsPlan, setEntitlementsPlan] = useState<PlanSummary | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          New plan
        </Button>
      </div>

      {plans.length === 0 ? (
        <EmptyState title="No plans yet" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Limits</TableHead>
              <TableHead>Features</TableHead>
              <TableHead>Subscribers</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell className="text-muted-foreground">{plan.key}</TableCell>
                <TableCell>{formatPrice(plan)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {plan.userLimit ?? "∞"} users · {plan.memberLimit ?? "∞"} members
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{plan.featureIds.length}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{plan.subscriberCount}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEntitlementsPlan(plan)}>
                      Features
                    </Button>
                    <DeletePlanButton planId={plan.id} name={plan.name} subscriberCount={plan.subscriberCount} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <CreatePlanDialog open={createOpen} onOpenChange={setCreateOpen} />

      {entitlementsPlan && (
        <PlanFeaturesDialog
          planId={entitlementsPlan.id}
          planName={entitlementsPlan.name}
          currentFeatureIds={entitlementsPlan.featureIds}
          features={features}
          open={!!entitlementsPlan}
          onOpenChange={(open) => !open && setEntitlementsPlan(null)}
        />
      )}
    </div>
  );
}
