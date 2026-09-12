"use client";

import { useState, type FormEvent } from "react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, FormField, Input, Plus, Select, Trash } from "@mahalle/ui";
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
    <div className="inline-flex rounded-md border border-input p-0.5" role="radiogroup" aria-label={name}>
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
          className={`rounded px-4 py-1.5 text-sm font-medium transition-colors ${
            value === opt.val ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
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
    <Card>
      <CardHeader>
        <CardTitle>Set up your Mahallu structure</CardTitle>
        <CardDescription>Tell us how your Mahallu is organized so we can structure families and houses correctly.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Does your Mahallu have divisions, wards, or areas?</p>
              <YesNoToggle name="Has divisions" value={value.hasDivisions} onChange={(hasDivisions) => onChange({ hasDivisions })} />
            </div>

            {value.hasDivisions && (
              <div className="space-y-4 rounded-md border border-border p-4">
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
                      <option value="">Select</option>
                      {DIVISION_TERMS.map((term) => (
                        <option key={term} value={term}>
                          {term}
                        </option>
                      ))}
                    </Select>
                    {isCustomTerm && (
                      <Input
                        placeholder="Enter your term (e.g. Unit)"
                        value={value.divisionTerm}
                        onChange={(e) => onChange({ divisionTerm: e.target.value })}
                      />
                    )}
                  </div>
                </FormField>

                <div className="space-y-3">
                  <p className="text-sm font-medium">Add {value.divisionTerm || "divisions"}</p>
                  {value.divisions.length > 0 && (
                    <ul className="divide-y divide-border rounded-md border border-border">
                      {value.divisions.map((division, index) => (
                        <li key={index} className="flex items-center justify-between gap-3 p-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {division.name}
                              {division.code && <span className="ml-1.5 text-xs text-muted-foreground">({division.code})</span>}
                            </p>
                            {division.description && <p className="truncate text-xs text-muted-foreground">{division.description}</p>}
                          </div>
                          <div className="flex shrink-0 gap-1">
                            <Button type="button" variant="ghost" size="sm" onClick={() => editDivision(index)}>
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              aria-label={`Delete ${division.name}`}
                              onClick={() => deleteDivision(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="grid gap-2 sm:grid-cols-[1fr_100px_1fr_auto]">
                    <Input
                      aria-label="Name"
                      placeholder="Name"
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    />
                    <Input
                      aria-label="Code"
                      placeholder="Code"
                      value={draft.code}
                      onChange={(e) => setDraft({ ...draft, code: e.target.value })}
                    />
                    <Input
                      aria-label="Description"
                      placeholder="Description"
                      value={draft.description}
                      onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                    />
                    <Button type="button" variant="outline" onClick={saveDraft} disabled={!draft.name.trim()}>
                      <Plus className="h-4 w-4" /> {editingIndex !== null ? "Save" : "Add"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Does your Mahallu use house numbers?</p>
              <YesNoToggle
                name="Uses house numbers"
                value={value.usesHouseNumbers}
                onChange={(usesHouseNumbers) => onChange({ usesHouseNumbers })}
              />
            </div>
            {value.usesHouseNumbers && (
              <FormField
                label="House Numbering Method"
                htmlFor="onboarding-house-numbering"
                hint="You can fine-tune this later from Family Management / Settings."
              >
                <Select
                  id="onboarding-house-numbering"
                  value={value.houseNumberingMethod}
                  onChange={(e) => onChange({ houseNumberingMethod: e.target.value as StructureData["houseNumberingMethod"] })}
                >
                  <option value="NUMERIC">Numeric</option>
                  <option value="ALPHANUMERIC">Alphanumeric</option>
                  <option value="CUSTOM">Custom</option>
                </Select>
              </FormField>
            )}
          </section>

          {error && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" className="w-full" size="lg">
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
