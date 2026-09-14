"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  FormField,
  Input,
  Pencil,
  Select,
  StatCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Division, FamilyStatus, Structure, StructureSummary } from "@/lib/structure";
import { DivisionFormDialog } from "./division-form-dialog";
import { FamilyStatusFormDialog } from "./family-status-form-dialog";

export interface StructureSettingsProps {
  slug: string;
  structure: Structure;
  divisions: Division[];
  familyStatuses?: FamilyStatus[];
  summary: StructureSummary | null;
}

export function StructureSettings({ slug, structure, divisions, familyStatuses = [], summary }: StructureSettingsProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [hasDivisions, setHasDivisions] = useState(structure.hasDivisions);
  const [divisionTerm, setDivisionTerm] = useState(structure.divisionTerm ?? "Division");
  const [isNumberingPerDivision, setIsNumberingPerDivision] = useState(() => {
    if (structure.houseNumberingMethod === "PER_DIVISION") return true;
    if (structure.houseNumberingMethod === "GLOBAL") return false;
    if (structure.houseNumberPrefix) return false;
    return true; // default to different per division
  });
  const [houseNumberPrefix, setHouseNumberPrefix] = useState(structure.houseNumberPrefix ?? "");
  const [isSaving, setIsSaving] = useState(false);

  // Family Status Division State
  const [hasFamilyStatuses, setHasFamilyStatuses] = useState(structure.hasFamilyStatuses ?? false);
  const [familyStatusTerm, setFamilyStatusTerm] = useState(structure.familyStatusTerm ?? "Category");
  const [isSavingStatusSettings, setIsSavingStatusSettings] = useState(false);
  const [statusFormOpen, setStatusFormOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<FamilyStatus | null>(null);
  const [busyStatusId, setBusyStatusId] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState<Division | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const label = divisionTerm || "division";
  const statusLabel = familyStatusTerm || "Category";
  const activeDivisions = divisions.filter((d) => d.isActive);
  const inactiveDivisions = divisions.filter((d) => !d.isActive);
  const sortedActive = [...activeDivisions].sort((a, b) => a.order - b.order);

  const activeFamilyStatuses = familyStatuses.filter((s) => s.isActive);
  const sortedActiveStatuses = [...activeFamilyStatuses].sort((a, b) => a.order - b.order);

  async function handleSaveSettings() {
    setIsSaving(true);
    try {
      await apiClient.patch(`/tenants/${slug}/structure`, {
        hasDivisions,
        divisionTerm: hasDivisions ? divisionTerm.trim() : "",
        houseNumberingMethod: hasDivisions ? (isNumberingPerDivision ? "PER_DIVISION" : "GLOBAL") : "GLOBAL",
        houseNumberPrefix: hasDivisions
          ? (!isNumberingPerDivision && houseNumberPrefix.trim() ? houseNumberPrefix.trim().toUpperCase() : null)
          : (houseNumberPrefix.trim() ? houseNumberPrefix.trim().toUpperCase() : null)
      });
      toast({ title: "Structure settings saved", variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't save structure settings.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleActive(division: Division) {
    setBusyId(division.id);
    try {
      const action = division.isActive ? "deactivate" : "reactivate";
      await apiClient.patch(`/tenants/${slug}/structure/divisions/${division.id}/${action}`, {});
      toast({ title: division.isActive ? `${division.name} deactivated` : `${division.name} reactivated`, variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't update that entry.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  }

  async function handleMove(division: Division, direction: -1 | 1) {
    const index = sortedActive.findIndex((d) => d.id === division.id);
    const swapWith = sortedActive[index + direction];
    if (!swapWith) return;
    const reordered = [...sortedActive];
    [reordered[index], reordered[index + direction]] = [reordered[index + direction], reordered[index]];
    setBusyId(division.id);
    try {
      await apiClient.post(`/tenants/${slug}/structure/divisions/reorder`, { orderedIds: reordered.map((d) => d.id) });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't reorder.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  }

  async function handleSaveStatusSettings() {
    setIsSavingStatusSettings(true);
    try {
      await apiClient.patch(`/tenants/${slug}/structure`, {
        hasFamilyStatuses,
        familyStatusTerm: hasFamilyStatuses ? familyStatusTerm.trim() : "Category"
      });
      toast({ title: "Family status settings saved", variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't save family status settings.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIsSavingStatusSettings(false);
    }
  }

  async function handleToggleStatusActive(status: FamilyStatus) {
    setBusyStatusId(status.id);
    try {
      const action = status.isActive ? "deactivate" : "reactivate";
      await apiClient.patch(`/tenants/${slug}/structure/family-statuses/${status.id}/${action}`, {});
      toast({ title: status.isActive ? `${status.name} deactivated` : `${status.name} reactivated`, variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't update status.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setBusyStatusId(null);
    }
  }

  async function handleMoveStatus(status: FamilyStatus, direction: -1 | 1) {
    const index = sortedActiveStatuses.findIndex((s) => s.id === status.id);
    const swapWith = sortedActiveStatuses[index + direction];
    if (!swapWith) return;
    const reordered = [...sortedActiveStatuses];
    [reordered[index], reordered[index + direction]] = [reordered[index + direction], reordered[index]];
    setBusyStatusId(status.id);
    try {
      await apiClient.post(`/tenants/${slug}/structure/family-statuses/reorder`, { orderedIds: reordered.map((s) => s.id) });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't reorder statuses.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setBusyStatusId(null);
    }
  }

  const getStatusBadgeStyle = (color?: string | null) => {
    switch (color) {
      case "emerald":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
      case "blue":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800";
      case "amber":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800";
      case "purple":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800";
      case "rose":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/40 dark:text-slate-300 dark:border-slate-800";
    }
  };

  return (
    <div className="space-y-6">
      {summary && (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label={hasDivisions ? `Total ${label.toLowerCase()}s` : "Total divisions"} value={summary.totalDivisions} tone="violet" />
          <StatCard label="Total houses" value={summary.totalHouses} tone="blue" />
          <StatCard label="Active houses" value={summary.activeHouses} tone="green" />
          <StatCard label="Inactive houses" value={summary.inactiveHouses} />
          {hasDivisions && <StatCard label="Unassigned houses" value={summary.unassignedHouses} />}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>How is this Mahallu organized?</CardTitle>
          <CardDescription>
            This shapes how families and houses are grouped throughout the app — change it any time.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Does this Mahallu have divisions, wards, or areas?" htmlFor="settings-has-divisions">
            <Select
              id="settings-has-divisions"
              value={hasDivisions ? "yes" : "no"}
              onChange={(e) => setHasDivisions(e.target.value === "yes")}
              className="max-w-xs"
            >
              <option value="no">No subdivisions</option>
              <option value="yes">Subdivisions enabled</option>
            </Select>
          </FormField>

          {hasDivisions ? (
            <>
              <FormField
                label="What do you call these divisions?"
                htmlFor="settings-division-term"
                hint="e.g. Division, Ward, Area, Zone, Mohalla, Unit"
              >
                <Input
                  id="settings-division-term"
                  placeholder="e.g. Division, Ward, Area, Zone"
                  value={divisionTerm}
                  onChange={(e) => setDivisionTerm(e.target.value)}
                  className="max-w-md"
                />
              </FormField>

              <div className="space-y-3 pt-2 border-t border-border">
                <FormField
                  label={`Is house numbering different in each ${label.toLowerCase()}?`}
                  htmlFor="numbering-scope"
                  hint={`Determine whether each ${label.toLowerCase()} has its own prefix code or if one global code is used`}
                >
                  <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
                    <label
                      className={`flex-1 flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                        isNumberingPerDivision
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border hover:bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      <input
                        type="radio"
                        id="numbering-scope-div"
                        name="numbering-scope"
                        checked={isNumberingPerDivision}
                        onChange={() => setIsNumberingPerDivision(true)}
                        className="mt-0.5 text-primary focus:ring-primary"
                      />
                      <div className="flex flex-col text-xs">
                        <span className="font-semibold text-foreground">Yes, different per {label.toLowerCase()}</span>
                        <span className="text-muted-foreground mt-0.5">
                          Each {label.toLowerCase()} defines its own code (e.g. Kambalakkad = KBD → KBD01)
                        </span>
                      </div>
                    </label>

                    <label
                      className={`flex-1 flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                        !isNumberingPerDivision
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border hover:bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      <input
                        type="radio"
                        id="numbering-scope-global"
                        name="numbering-scope"
                        checked={!isNumberingPerDivision}
                        onChange={() => setIsNumberingPerDivision(false)}
                        className="mt-0.5 text-primary focus:ring-primary"
                      />
                      <div className="flex flex-col text-xs">
                        <span className="font-semibold text-foreground">No, same globally</span>
                        <span className="text-muted-foreground mt-0.5">
                          Use the same prefix code for all houses across the Mahallu
                        </span>
                      </div>
                    </label>
                  </div>
                </FormField>

                {!isNumberingPerDivision && (
                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border/80 max-w-md space-y-2 animate-in fade-in-50 duration-150">
                    <FormField
                      label="Global House Number Prefix / Code"
                      htmlFor="global-house-prefix"
                      hint="Prefix code used before house numbers across the entire Mahallu (e.g. MH, KBD)"
                    >
                      <Input
                        id="global-house-prefix"
                        placeholder="e.g. MH"
                        value={houseNumberPrefix}
                        onChange={(e) => setHouseNumberPrefix(e.target.value.toUpperCase())}
                        className="font-mono uppercase max-w-xs"
                      />
                    </FormField>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* When divisions are disabled: ask house number code globally */
            <div className="space-y-3 pt-2 border-t border-border max-w-md animate-in fade-in-50 duration-150">
              <FormField
                label="House Number Prefix / Code"
                htmlFor="disabled-div-house-prefix"
                hint="Prefix code used before house numbers across this Mahallu (e.g. MH for MH01, MH02)"
              >
                <Input
                  id="disabled-div-house-prefix"
                  placeholder="e.g. MH"
                  value={houseNumberPrefix}
                  onChange={(e) => setHouseNumberPrefix(e.target.value.toUpperCase())}
                  className="font-mono uppercase max-w-xs"
                />
              </FormField>
            </div>
          )}

          <div className="pt-2">
            <Button isLoading={isSaving} onClick={handleSaveSettings}>
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {hasDivisions && (
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="capitalize">{label}s</CardTitle>
              <CardDescription>Add, edit, reorder, or deactivate the {label.toLowerCase()}s this Mahallu is split into.</CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() => {
                setEditingDivision(null);
                setFormOpen(true);
              }}
            >
              Add {label}
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {divisions.length === 0 ? (
              <EmptyState title={`No ${label.toLowerCase()}s yet`} description="Add the first one above." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Code / Prefix</TableHead>
                    <TableHead>Houses</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...sortedActive, ...inactiveDivisions].map((division, idx) => (
                    <TableRow key={division.id}>
                      <TableCell className="text-muted-foreground">
                        {division.isActive && (
                          <div className="flex gap-0.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={idx === 0 || busyId === division.id}
                              onClick={() => handleMove(division, -1)}
                              aria-label={`Move ${division.name} up`}
                            >
                              ↑
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={idx === sortedActive.length - 1 || busyId === division.id}
                              onClick={() => handleMove(division, 1)}
                              aria-label={`Move ${division.name} down`}
                            >
                              ↓
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{division.name}</TableCell>
                      <TableCell>
                        {division.code ? (
                          <span className="font-mono font-semibold px-2 py-0.5 rounded bg-muted text-foreground text-xs border border-border">
                            {division.code}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">—</TableCell>
                      <TableCell>
                        <Badge variant={division.isActive ? "secondary" : "outline"}>{division.isActive ? "Active" : "Inactive"}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingDivision(division);
                              setFormOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            isLoading={busyId === division.id}
                            onClick={() => handleToggleActive(division)}
                          >
                            {division.isActive ? "Deactivate" : "Reactivate"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      <DivisionFormDialog slug={slug} open={formOpen} onOpenChange={setFormOpen} editingDivision={editingDivision} divisionTerm={label} />

      {/* ========================================================================= */}
      {/* 2. Family Status Division Settings (e.g. Category A, B, Welfare, etc.)    */}
      {/* ========================================================================= */}
      <Card>
        <CardHeader>
          <CardTitle>Family Status Division</CardTitle>
          <CardDescription>
            Group and classify households into socioeconomic tiers or administrative categories (e.g. Category A, Category B, Welfare, Zakat Eligible).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl border border-border/70 bg-muted/20">
            <div className="space-y-0.5">
              <label htmlFor="has-family-statuses" className="text-sm font-semibold text-foreground cursor-pointer">
                Enable Family Status Division
              </label>
              <p className="text-xs text-muted-foreground">
                When enabled, family adding, editing, and family registry tables will show and filter by this status tier.
              </p>
            </div>
            <input
              id="has-family-statuses"
              type="checkbox"
              className="h-5 w-5 rounded border-input text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
              checked={hasFamilyStatuses}
              onChange={(e) => setHasFamilyStatuses(e.target.checked)}
            />
          </div>

          {hasFamilyStatuses && (
            <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border/50">
              <FormField label="Terminology for Status" htmlFor="status-term">
                <Input
                  id="status-term"
                  placeholder="e.g. Category, Status, Slab, Class"
                  value={familyStatusTerm}
                  onChange={(e) => setFamilyStatusTerm(e.target.value)}
                />
              </FormField>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              isLoading={isSavingStatusSettings}
              onClick={handleSaveStatusSettings}
            >
              Save Family Status Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {hasFamilyStatuses && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>{statusLabel} List</CardTitle>
              <CardDescription>
                Define the available {statusLabel.toLowerCase()} values for households.
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() => {
                setEditingStatus(null);
                setStatusFormOpen(true);
              }}
            >
              Add {statusLabel}
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {familyStatuses.length === 0 ? (
              <EmptyState
                title={`No ${statusLabel.toLowerCase()}s defined yet`}
                description={`Click 'Add ${statusLabel}' to configure your first household category.`}
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Order</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Badge Preview</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {familyStatuses.map((status, idx) => (
                    <TableRow key={status.id}>
                      <TableCell className="text-muted-foreground">
                        {status.isActive && (
                          <div className="flex gap-0.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={idx === 0 || busyStatusId === status.id}
                              onClick={() => handleMoveStatus(status, -1)}
                              aria-label={`Move ${status.name} up`}
                            >
                              ↑
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={idx === sortedActiveStatuses.length - 1 || busyStatusId === status.id}
                              onClick={() => handleMoveStatus(status, 1)}
                              aria-label={`Move ${status.name} down`}
                            >
                              ↓
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold">{status.name}</TableCell>
                      <TableCell>
                        {status.code ? (
                          <span className="font-mono font-semibold px-2 py-0.5 rounded bg-muted text-foreground text-xs border border-border">
                            {status.code}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeStyle(status.color)}`}>
                          {status.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                        {status.description || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.isActive ? "secondary" : "outline"}>
                          {status.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingStatus(status);
                              setStatusFormOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            isLoading={busyStatusId === status.id}
                            onClick={() => handleToggleStatusActive(status)}
                          >
                            {status.isActive ? "Deactivate" : "Reactivate"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      <FamilyStatusFormDialog
        slug={slug}
        open={statusFormOpen}
        onOpenChange={setStatusFormOpen}
        editingStatus={editingStatus}
        statusTerm={statusLabel}
      />
    </div>
  );
}
