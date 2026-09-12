"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ConfirmDialog,
  EmptyState,
  FormField,
  Input,
  Pencil,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Trash,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Division, Structure } from "@/lib/structure";
import { DivisionFormDialog } from "./division-form-dialog";

const DIVISION_TERMS = ["Ward", "Division", "Area", "Zone", "Other"] as const;
const HOUSE_NUMBERING_METHODS = ["NUMERIC", "ALPHANUMERIC", "CUSTOM"] as const;

export interface StructureSettingsProps {
  slug: string;
  structure: Structure;
  divisions: Division[];
}

export function StructureSettings({ slug, structure, divisions }: StructureSettingsProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [hasDivisions, setHasDivisions] = useState(structure.hasDivisions);
  const [divisionTerm, setDivisionTerm] = useState(structure.divisionTerm ?? "");
  const [houseNumberingMethod, setHouseNumberingMethod] = useState(structure.houseNumberingMethod ?? "NUMERIC");
  const [isSaving, setIsSaving] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState<Division | null>(null);
  const [removeTarget, setRemoveTarget] = useState<Division | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const label = divisionTerm || "division";
  const isKnownTerm = (DIVISION_TERMS as readonly string[]).includes(divisionTerm);

  async function handleSaveSettings() {
    setIsSaving(true);
    try {
      await apiClient.patch(`/tenants/${slug}/structure`, {
        hasDivisions,
        divisionTerm: hasDivisions ? divisionTerm : "",
        houseNumberingMethod
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

  async function handleRemoveDivision() {
    if (!removeTarget) return;
    setIsRemoving(true);
    try {
      await apiClient.delete(`/tenants/${slug}/structure/divisions/${removeTarget.id}`);
      toast({ title: `Removed ${removeTarget.name}`, variant: "success" });
      setRemoveTarget(null);
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't remove that entry.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <div className="space-y-6">
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
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </Select>
          </FormField>

          {hasDivisions && (
            <FormField label="What do you call these divisions?" htmlFor="settings-division-term">
              <div className="flex max-w-md gap-2">
                <Select
                  id="settings-division-term"
                  value={isKnownTerm ? divisionTerm : "Other"}
                  onChange={(e) => setDivisionTerm(e.target.value === "Other" ? "" : e.target.value)}
                >
                  <option value="">Select</option>
                  {DIVISION_TERMS.map((term) => (
                    <option key={term} value={term}>
                      {term}
                    </option>
                  ))}
                </Select>
                {!isKnownTerm && (
                  <Input
                    placeholder="Enter your term (e.g. Unit)"
                    value={divisionTerm}
                    onChange={(e) => setDivisionTerm(e.target.value)}
                  />
                )}
              </div>
            </FormField>
          )}

          <FormField label="House numbering method" htmlFor="settings-house-numbering">
            <Select
              id="settings-house-numbering"
              className="max-w-xs"
              value={houseNumberingMethod}
              onChange={(e) => setHouseNumberingMethod(e.target.value)}
            >
              {HOUSE_NUMBERING_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m[0] + m.slice(1).toLowerCase()}
                </option>
              ))}
            </Select>
          </FormField>

          <Button isLoading={isSaving} onClick={handleSaveSettings}>
            Save
          </Button>
        </CardContent>
      </Card>

      {hasDivisions && (
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="capitalize">{label}s</CardTitle>
              <CardDescription>Add, edit, or remove the {label.toLowerCase()}s this Mahallu is split into.</CardDescription>
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
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {divisions.map((division) => (
                    <TableRow key={division.id}>
                      <TableCell className="font-medium">{division.name}</TableCell>
                      <TableCell className="text-muted-foreground">{division.code ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{division.description ?? "—"}</TableCell>
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
                          <Button variant="ghost" size="sm" onClick={() => setRemoveTarget(division)}>
                            <Trash className="h-4 w-4" />
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

      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title={`Remove ${removeTarget?.name ?? "this entry"}?`}
        description="Houses in this entry are not deleted — they just become unassigned."
        confirmLabel="Remove"
        destructive
        isConfirming={isRemoving}
        onConfirm={handleRemoveDivision}
      />
    </div>
  );
}
