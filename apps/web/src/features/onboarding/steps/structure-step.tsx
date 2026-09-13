"use client";

import { useState, type FormEvent } from "react";
import { Building, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, FormField, Input, Plus, Select, Trash } from "@mahalle/ui";
import { DIVISION_TERMS, type DivisionEntry, type StructureData } from "../types";

export interface StructureStepProps {
  value: StructureData;
  error: string | null;
  onChange: (patch: Partial<StructureData>) => void;
  onBack: () => void;
  onSubmit: (event: FormEvent) => void;
}

function emptyDivision(): DivisionEntry {
  return { name: "", code: "", description: "" };
}

function YesNoToggle({ value, onChange, name }: { value: boolean; onChange: (value: boolean) => void; name: string }) {
  return (
    <div className="inline-flex rounded-xl border border-border/80 bg-muted/40 p-1" role="radiogroup" aria-label={name}>
      {[
        { label: "Yes", val: true },
        { label: "No", val: false }
      ].map((opt) => (
        <button
          key={opt.label}
          type="button"
          role="radio"
          aria-checked={value === opt.val}
          onClick={() => onChange(opt.val)}
          className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all duration-150 ${
            value === opt.val
              ? "bg-primary text-primary-foreground shadow-2xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function StructureStep({ value, error, onChange, onBack, onSubmit }: StructureStepProps) {
  const [draft, setDraft] = useState<DivisionEntry>(emptyDivision());
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const isKnownTerm = (DIVISION_TERMS as readonly string[]).includes(value.divisionTerm) && value.divisionTerm !== "Other";
  const [isCustomTerm, setIsCustomTerm] = useState(Boolean(value.divisionTerm) && !isKnownTerm);

  function saveDraft() {
    if (!draft.name.trim()) return;
    const divisions = [...value.divisions];
    if (editingIndex !== null) {
      divisions[editingIndex] = draft;
    } else {
      divisions.push(draft);
    }
    onChange({ divisions });
    setDraft(emptyDivision());
    setEditingIndex(null);
  }

  function editDivision(index: number) {
    setDraft(value.divisions[index]);
    setEditingIndex(index);
  }

  function deleteDivision(index: number) {
    onChange({ divisions: value.divisions.filter((_, i) => i !== index) });
    if (editingIndex === index) {
      setDraft(emptyDivision());
      setEditingIndex(null);
    }
  }

  return (
    <Card className="overflow-hidden border-border/80 shadow-md">
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500" />
      <CardHeader className="space-y-2 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">Community Organization</CardTitle>
            <CardDescription className="text-sm">
              Configure how your Mahallu is zoned, divided, and how resident houses are numbered.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          {/* Question 1: Divisions */}
          <div className="rounded-xl border border-border/70 bg-card p-4 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Does your Mahallu have divisions, wards, or zones?</p>
                <p className="text-xs text-muted-foreground">Useful for distributing surveys, relief, notices, and collections.</p>
              </div>
              <YesNoToggle name="Has divisions" value={value.hasDivisions} onChange={(hasDivisions) => onChange({ hasDivisions })} />
            </div>

            {value.hasDivisions && (
              <div className="space-y-4 rounded-xl border border-border/60 bg-muted/20 p-4 pt-4">
                <FormField label="What do you call these divisions?" htmlFor="onboarding-division-term">
                  <div className="flex gap-2">
                    <Select
                      id="onboarding-division-term"
                      className="max-w-[200px]"
                      value={isCustomTerm ? "Other" : value.divisionTerm}
                      onChange={(e) => {
                        const term = e.target.value;
                        if (term === "Other") {
                          setIsCustomTerm(true);
                          onChange({ divisionTerm: "" });
                        } else {
                          setIsCustomTerm(false);
                          onChange({ divisionTerm: term });
                        }
                      }}
                    >
                      <option value="">Select terminology</option>
                      {DIVISION_TERMS.map((term) => (
                        <option key={term} value={term}>
                          {term}
                        </option>
                      ))}
                    </Select>
                    {isCustomTerm && (
                      <Input
                        placeholder="Enter your term (e.g. Unit or Sector)"
                        value={value.divisionTerm}
                        onChange={(e) => onChange({ divisionTerm: e.target.value })}
                      />
                    )}
                  </div>
                </FormField>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Configured {value.divisionTerm ? `${value.divisionTerm}s` : "Divisions"} ({value.divisions.length})
                    </span>
                  </div>

                  {value.divisions.length > 0 && (
                    <div className="overflow-hidden rounded-xl border border-border/80 bg-background shadow-2xs">
                      <ul className="divide-y divide-border/60">
                        {value.divisions.map((division, index) => (
                          <li key={index} className="flex items-center justify-between gap-3 p-3 text-sm">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">{division.name}</span>
                                {division.code && (
                                  <span className="rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary">
                                    {division.code}
                                  </span>
                                )}
                              </div>
                              {division.description && <p className="truncate text-xs text-muted-foreground mt-0.5">{division.description}</p>}
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                              <Button type="button" variant="ghost" size="sm" onClick={() => editDivision(index)} className="h-8 text-xs font-medium">
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                aria-label={`Delete ${division.name}`}
                                onClick={() => deleteDivision(index)}
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Add / Edit division inputs */}
                  <div className="rounded-xl border border-dashed border-border/80 bg-background/80 p-3 space-y-2">
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {editingIndex !== null ? "Edit division details:" : `Add new ${value.divisionTerm || "division"}:`}
                    </span>
                    <div className="grid gap-2 sm:grid-cols-[1fr_100px_1fr_auto]">
                      <Input
                        aria-label="Name"
                        placeholder="Name (e.g. Ward 1 - East)"
                        value={draft.name}
                        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      />
                      <Input
                        aria-label="Code"
                        placeholder="Code (W1)"
                        value={draft.code}
                        onChange={(e) => setDraft({ ...draft, code: e.target.value })}
                      />
                      <Input
                        aria-label="Description"
                        placeholder="Description (Optional)"
                        value={draft.description}
                        onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                      />
                      <Button type="button" variant="outline" onClick={saveDraft} disabled={!draft.name.trim()} className="text-xs font-semibold">
                        <Plus className="h-3.5 w-3.5" /> {editingIndex !== null ? "Save" : "Add"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Question 2: House Numbers */}
          <div className="rounded-xl border border-border/70 bg-card p-4 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Does your Mahallu assign house numbering?</p>
                <p className="text-xs text-muted-foreground">Enables house-by-house census, surveys, and membership registry.</p>
              </div>
              <YesNoToggle
                name="Uses house numbers"
                value={value.usesHouseNumbers}
                onChange={(usesHouseNumbers) => onChange({ usesHouseNumbers })}
              />
            </div>

            {value.usesHouseNumbers && (
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <FormField
                  label="House Numbering Format"
                  htmlFor="onboarding-house-numbering"
                  hint="You can customize numbering rules anytime in settings."
                >
                  <Select
                    id="onboarding-house-numbering"
                    value={value.houseNumberingMethod}
                    onChange={(e) => onChange({ houseNumberingMethod: e.target.value as StructureData["houseNumberingMethod"] })}
                  >
                    <option value="NUMERIC">Numeric Only (e.g. 101, 102, 103)</option>
                    <option value="ALPHANUMERIC">Alphanumeric (e.g. W1-101, W2-402)</option>
                    <option value="CUSTOM">Custom / Legacy Format</option>
                  </Select>
                </FormField>
              </div>
            )}
          </div>

          {error && (
            <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button type="button" variant="outline" size="lg" onClick={onBack} className="min-w-[100px]">
              Back
            </Button>
            <Button type="submit" className="flex-1 text-sm font-semibold shadow-xs" size="lg">
              Continue to Management
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
