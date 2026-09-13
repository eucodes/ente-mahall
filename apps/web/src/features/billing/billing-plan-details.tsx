"use client";

import React, { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CreditCard,
  RefreshCw,
  Sparkles,
  Check,
  CheckCircle2,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@mahalle/ui";

interface BillingPlanDetailsProps {
  slug: string;
  tenantName: string;
}

interface PlanLimitRow {
  id: string;
  label: string;
  value: string | number;
}

export function BillingPlanDetails({ slug, tenantName }: BillingPlanDetailsProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<"growth" | "enterprise">("growth");
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleConfirmUpgrade = () => {
    setUpgradeSuccess(true);
    setTimeout(() => {
      setUpgradeModalOpen(false);
      setUpgradeSuccess(false);
    }, 1200);
  };

  const planLimits: PlanLimitRow[] = [
    { id: "divisions", label: "Wards / Sub-divisions", value: "1" },
    { id: "members", label: "Members capacity", value: "500" },
    { id: "families", label: "Families & Houses", value: "150" },
    { id: "registers", label: "Official Registers (Nikah, Death, NOC)", value: "Included" },
    { id: "storage", label: "Cloud document storage", value: "2,048 MB" },
    { id: "users", label: "Admin operators", value: "3" },
    { id: "whatsapp", label: "SMS & WhatsApp alerts / month", value: "1,000" },
    { id: "views_month", label: "Website views / month", value: "10,000" },
    { id: "views_day", label: "Website views / day", value: "1,000" }
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CreditCard className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Billing
          </h1>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleRefresh}
          className="rounded-xl text-xs font-semibold gap-1.5 h-9 px-3.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Top Card: Plan Overview */}
      <Card className="rounded-3xl border-border/80 bg-card shadow-xs">
        <CardContent className="p-6 flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-bold text-foreground">Community Basic</span>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Renews at 10/01/2026
            </p>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setUpgradeModalOpen(true)}
            className="rounded-xl text-xs font-semibold gap-1.5 h-9 px-4 shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            <span>Upgrade</span>
          </Button>
        </CardContent>
      </Card>

      {/* Bottom Card: PLAN LIMITS Table */}
      <Card className="rounded-3xl border-border/80 bg-card shadow-xs overflow-hidden">
        <CardHeader className="border-b border-border/60 px-6 py-4">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Plan Limits
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/60">
            {planLimits.map((row) => (
              <div
                key={row.id}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-muted/20 transition-colors text-sm"
              >
                <span className="text-foreground/90 font-medium">
                  {row.label}
                </span>
                <span className="font-bold text-foreground font-mono">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Plan Modal */}
      <Dialog open={upgradeModalOpen} onOpenChange={setUpgradeModalOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 border-border/80">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              Upgrade Subscription Plan
            </DialogTitle>
          </DialogHeader>

          <div className="py-3 space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setSelectedTier("growth")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedTier === "growth"
                    ? "border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/20"
                    : "border-border/70 hover:bg-muted/30"
                }`}
              >
                <span className="font-bold text-sm text-foreground block">Growth Mahall</span>
                <span className="text-xs font-mono text-emerald-600 font-semibold">₹999 / mo</span>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Up to 2,500 members & custom domain
                </p>
              </div>

              <div
                onClick={() => setSelectedTier("enterprise")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedTier === "enterprise"
                    ? "border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/20"
                    : "border-border/70 hover:bg-muted/30"
                }`}
              >
                <span className="font-bold text-sm text-foreground block">Juma Enterprise</span>
                <span className="text-xs font-mono text-emerald-600 font-semibold">₹2,499 / mo</span>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Unlimited members & 100 GB storage
                </p>
              </div>
            </div>

            {upgradeSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Upgrade request activated!</span>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-row justify-end gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setUpgradeModalOpen(false)}
              className="rounded-xl text-xs font-semibold h-9 px-4"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              disabled={upgradeSuccess}
              onClick={handleConfirmUpgrade}
              className="rounded-xl text-xs font-semibold h-9 px-5"
            >
              Confirm Upgrade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
