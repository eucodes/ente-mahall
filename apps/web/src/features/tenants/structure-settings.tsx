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
import type { Division, Structure, StructureSummary } from "@/lib/structure";
import { DivisionFormDialog } from "./division-form-dialog";

export interface StructureSettingsProps {
  slug: string;
  structure: Structure;
  divisions: Division[];
  summary: StructureSummary | null;
}

export function StructureSettings({ slug, structure, divisions, summary }: StructureSettingsProps) {
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

  const [formOpen, setFormOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState<Division | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const label = divisionTerm || "division";
  const activeDivisions = divisions.filter((d) => d.isActive);
  const inactiveDivisions = divisions.filter((d) => !d.isActive);
  const sortedActive = [...activeDivisions].sort((a, b) => a.order - b.order);

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
    </div>
  );
}
