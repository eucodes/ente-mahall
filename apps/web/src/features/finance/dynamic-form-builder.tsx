"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Checkbox,
  Badge,
  Select,
  Plus,
  Trash2,
  Eye,
  Sliders,
  Layers,
  FileText,
  Calendar,
  Hash,
  Paperclip,
  Users,
  Home,
  CheckSquare,
  ListFilter
} from "@mahalle/ui";
import type { DynamicFormFieldConfig, DynamicFormFieldType } from "@/lib/finance";

export const AVAILABLE_FIELD_TYPES: {
  type: DynamicFormFieldType;
  label: string;
  description: string;
  iconName: string;
  hasOptions: boolean;
}[] = [
  { type: "family", label: "Family", description: "Mahallu family selection", iconName: "Home", hasOptions: false },
  { type: "member", label: "Member", description: "Family member selection", iconName: "Users", hasOptions: false },
  { type: "amount", label: "Amount", description: "Monetary amount in INR", iconName: "Hash", hasOptions: false },
  { type: "date", label: "Date", description: "Collection date picker", iconName: "Calendar", hasOptions: false },
  { type: "description", label: "Description", description: "Notes or description textarea", iconName: "FileText", hasOptions: false },
  { type: "file", label: "File upload", description: "Receipt or document attachment", iconName: "Paperclip", hasOptions: false },
  { type: "text", label: "Text", description: "Single-line custom text input", iconName: "FileText", hasOptions: false },
  { type: "number", label: "Number", description: "Numeric value input", iconName: "Hash", hasOptions: false },
  { type: "select", label: "Dropdown", description: "Single selection dropdown menu", iconName: "ListFilter", hasOptions: true },
  { type: "radio", label: "Radio", description: "Single selection radio group", iconName: "CheckSquare", hasOptions: true },
  { type: "checkbox", label: "Checkbox", description: "Yes/No boolean toggle checkbox", iconName: "CheckSquare", hasOptions: false },
  { type: "multiselect", label: "Multi-select", description: "Multiple selection checkboxes", iconName: "ListFilter", hasOptions: true }
];

export const DEFAULT_STANDARD_FIELDS: DynamicFormFieldConfig[] = [
  { id: "family", type: "family", label: "Mahallu Family", enabled: true, required: true },
  { id: "member", type: "member", label: "Family Member", enabled: true, required: false },
  { id: "amount", type: "amount", label: "Amount (₹)", enabled: true, required: true },
  { id: "date", type: "date", label: "Collection Date", enabled: true, required: true },
  { id: "description", type: "description", label: "Notes / Description", enabled: true, required: false },
  { id: "file", type: "file", label: "Attachment / Receipt", enabled: false, required: false }
];

interface Props {
  fields: DynamicFormFieldConfig[];
  onChange: (fields: DynamicFormFieldConfig[]) => void;
}

export function DynamicFormBuilder({ fields, onChange }: Props) {
  const [activeSubTab, setActiveSubTab] = useState<"builder" | "preview">("builder");
  const [newFieldType, setNewFieldType] = useState<DynamicFormFieldType>("text");
  const [newFieldLabel, setNewFieldLabel] = useState("");

  const currentFields = fields && fields.length > 0 ? fields : DEFAULT_STANDARD_FIELDS;

  function updateField(id: string, updates: Partial<DynamicFormFieldConfig>) {
    onChange(
      currentFields.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  }

  function addField() {
    if (!newFieldLabel.trim()) return;
    const typeDef = AVAILABLE_FIELD_TYPES.find((t) => t.type === newFieldType);
    const newId = `custom_${Date.now()}_${newFieldType}`;
    const newField: DynamicFormFieldConfig = {
      id: newId,
      type: newFieldType,
      label: newFieldLabel.trim(),
      enabled: true,
      required: false,
      options: typeDef?.hasOptions ? ["Option 1", "Option 2"] : undefined
    };
    onChange([...currentFields, newField]);
    setNewFieldLabel("");
  }

  function removeField(id: string) {
    onChange(currentFields.filter((f) => f.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-2">
        <div>
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5 text-primary" />
            Dynamic Form Builder
          </span>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Configure the 12 available field types for collection recording.
          </p>
        </div>
        <div className="flex items-center gap-1 p-0.5 bg-muted/60 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveSubTab("builder")}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
              activeSubTab === "builder" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Fields ({currentFields.filter((f) => f.enabled).length}/{currentFields.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("preview")}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 cursor-pointer ${
              activeSubTab === "preview" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="h-3 w-3" />
            Live Preview
          </button>
        </div>
      </div>

      {activeSubTab === "builder" ? (
        <div className="space-y-3">
          {/* Field rows */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {currentFields.map((field) => {
              const meta = AVAILABLE_FIELD_TYPES.find((t) => t.type === field.type);
              const isStandard = ["family", "member", "amount", "date", "description", "file"].includes(field.type);

              return (
                <div
                  key={field.id}
                  className={`p-2.5 rounded-xl border transition-all ${
                    field.enabled
                      ? "bg-background border-border/80 shadow-2xs"
                      : "bg-muted/20 border-border/40 opacity-60"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Checkbox
                        checked={field.enabled}
                        onChange={(e) => updateField(field.id, { enabled: e.target.checked })}
                      />
                      <Badge variant="outline" className="text-[10px] uppercase font-mono px-1.5 py-0 h-4">
                        {field.type}
                      </Badge>
                      <Input
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        disabled={!field.enabled}
                        className="h-7 text-xs flex-1 min-w-[120px]"
                        placeholder="Field label"
                      />
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                      <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                        <Checkbox
                          checked={field.required}
                          disabled={!field.enabled}
                          onChange={(e) => updateField(field.id, { required: e.target.checked })}
                        />
                        <span className={field.required ? "font-semibold text-foreground" : "text-muted-foreground"}>
                          Required
                        </span>
                      </label>

                      {!isStandard && (
                        <button
                          type="button"
                          onClick={() => removeField(field.id)}
                          className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors cursor-pointer"
                          title="Remove custom field"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Options editor for select/radio/multiselect */}
                  {meta?.hasOptions && field.enabled && (
                    <div className="mt-2 pl-6 pt-2 border-t border-border/40 flex flex-col gap-1">
                      <span className="text-[10px] text-muted-foreground font-medium">
                        Options (comma-separated):
                      </span>
                      <Input
                        value={(field.options || []).join(", ")}
                        onChange={(e) =>
                          updateField(field.id, {
                            options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                          })
                        }
                        placeholder="Option 1, Option 2, Option 3"
                        className="h-7 text-xs font-mono"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add custom field */}
          <div className="p-3 rounded-xl bg-muted/30 border border-dashed border-border/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Select
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value as DynamicFormFieldType)}
              className="h-8 text-xs sm:w-44"
            >
              {AVAILABLE_FIELD_TYPES.map((t) => (
                <option key={t.type} value={t.type}>
                  {t.label} ({t.type})
                </option>
              ))}
            </Select>

            <Input
              value={newFieldLabel}
              onChange={(e) => setNewFieldLabel(e.target.value)}
              placeholder="Custom field label (e.g. Occasion, Receipt #)"
              className="h-8 text-xs flex-1"
            />

            <Button
              type="button"
              size="sm"
              onClick={addField}
              disabled={!newFieldLabel.trim()}
              className="h-8 gap-1.5 text-xs bg-primary text-primary-foreground shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Field
            </Button>
          </div>
        </div>
      ) : (
        /* Live Preview */
        <div className="p-4 rounded-xl bg-muted/20 border border-border/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/40">
            <span className="text-xs font-semibold text-foreground">Interactive Form Preview</span>
            <Badge variant="secondary" className="text-[10px]">
              {currentFields.filter((f) => f.enabled).length} Active Fields
            </Badge>
          </div>

          <div className="space-y-3">
            {currentFields
              .filter((f) => f.enabled)
              .map((field) => (
                <div key={field.id} className="space-y-1">
                  <label className="text-xs font-medium text-foreground flex items-center justify-between">
                    <span>
                      {field.label}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </span>
                    <span className="text-[10px] text-muted-foreground/70 uppercase font-mono">
                      {field.type}
                    </span>
                  </label>

                  {field.type === "family" && (
                    <Select disabled className="h-8 text-xs bg-muted/10 opacity-70">
                      <option>Search & select Mahallu family...</option>
                    </Select>
                  )}

                  {field.type === "member" && (
                    <Select disabled className="h-8 text-xs bg-muted/10 opacity-70">
                      <option>Search & select family member...</option>
                    </Select>
                  )}

                  {field.type === "amount" && (
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₹</span>
                      <Input disabled placeholder="0.00" className="h-8 text-xs pl-6 bg-muted/10 opacity-70 font-mono" />
                    </div>
                  )}

                  {field.type === "date" && (
                    <Input disabled type="date" value={new Date().toISOString().split("T")[0]} className="h-8 text-xs bg-muted/10 opacity-70" />
                  )}

                  {field.type === "description" && (
                    <textarea
                      disabled
                      placeholder="Add notes or receipt remarks..."
                      rows={2}
                      className="w-full text-xs rounded-lg border border-border/60 p-2 bg-muted/10 opacity-70 resize-none"
                    />
                  )}

                  {field.type === "file" && (
                    <div className="border border-dashed border-border/80 rounded-lg p-2 text-center text-xs text-muted-foreground bg-muted/10">
                      Drag and drop receipt file or browse
                    </div>
                  )}

                  {field.type === "text" && (
                    <Input disabled placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`} className="h-8 text-xs bg-muted/10 opacity-70" />
                  )}

                  {field.type === "number" && (
                    <Input disabled type="number" placeholder="0" className="h-8 text-xs bg-muted/10 opacity-70 font-mono" />
                  )}

                  {field.type === "select" && (
                    <Select disabled className="h-8 text-xs bg-muted/10 opacity-70">
                      <option>Select an option...</option>
                      {(field.options || ["Option 1", "Option 2"]).map((opt, i) => (
                        <option key={i}>{opt}</option>
                      ))}
                    </Select>
                  )}

                  {field.type === "radio" && (
                    <div className="flex items-center gap-3 pt-1">
                      {(field.options || ["Option 1", "Option 2"]).map((opt, i) => (
                        <label key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <input type="radio" disabled name={field.id} defaultChecked={i === 0} />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === "checkbox" && (
                    <label className="flex items-center gap-2 text-xs pt-1 text-foreground">
                      <Checkbox disabled defaultChecked={false} />
                      <span>{field.label}</span>
                    </label>
                  )}

                  {field.type === "multiselect" && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {(field.options || ["Option 1", "Option 2"]).map((opt, i) => (
                        <label key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Checkbox disabled defaultChecked={false} />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
