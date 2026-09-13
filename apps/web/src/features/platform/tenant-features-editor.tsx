"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Select, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { TenantFeatureStatus } from "@/lib/features";

type Choice = "inherit" | "on" | "off";

function choiceFor(override: boolean | null): Choice {
  if (override === true) return "on";
  if (override === false) return "off";
  return "inherit";
}

function OverrideSelect({ tenantId, feature }: { tenantId: string; feature: TenantFeatureStatus }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  async function handleChange(choice: Choice) {
    setIsSaving(true);
    try {
      const isEnabled = choice === "inherit" ? null : choice === "on";
      await apiClient.patch(`/platform/tenants/${tenantId}/features/${feature.featureId}`, { isEnabled });
      toast({ title: "Feature override updated", variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong.";
      toast({ title: "Couldn't update override", description: message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Select
      value={choiceFor(feature.override)}
      disabled={isSaving}
      onChange={(e) => handleChange(e.target.value as Choice)}
      className="h-8 w-40 text-xs"
    >
      <option value="inherit">Inherit ({feature.isEnabledGlobally ? "on" : "off"})</option>
      <option value="on" disabled={!feature.isEnabledGlobally}>
        Force on
      </option>
      <option value="off">Force off</option>
    </Select>
  );
}

export function TenantFeaturesEditor({ tenantId, features }: { tenantId: string; features: TenantFeatureStatus[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Feature</TableHead>
          <TableHead>Effective</TableHead>
          <TableHead>Override</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {features.map((feature) => (
          <TableRow key={feature.featureId}>
            <TableCell className="font-medium">
              {feature.name}
              {!feature.isEnabledGlobally && (
                <span className="ml-2 text-xs font-normal text-muted-foreground">(disabled platform-wide)</span>
              )}
            </TableCell>
            <TableCell>
              <Badge variant={feature.effective ? "success" : "outline"}>{feature.effective ? "On" : "Off"}</Badge>
            </TableCell>
            <TableCell>
              <OverrideSelect tenantId={tenantId} feature={feature} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
