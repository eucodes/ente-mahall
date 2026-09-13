"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
  Select,
  Textarea,
  useToast
} from "@mahalle/ui";
import { FormFieldType, FORM_FIELD_TYPES_WITH_OPTIONS } from "@mahalle/types";
import { apiClient, ApiError } from "@/lib/api-client";
import type { FormFieldSummary } from "@/lib/forms";

const TYPE_LABELS: Record<FormFieldType, string> = {
  [FormFieldType.TEXT]: "Text",
  [FormFieldType.LONG_TEXT]: "Long text",
  [FormFieldType.NUMBER]: "Number",
  [FormFieldType.PHONE]: "Phone",
  [FormFieldType.EMAIL]: "Email",
  [FormFieldType.DATE]: "Date",
  [FormFieldType.TIME]: "Time",
  [FormFieldType.SELECT]: "Select",
  [FormFieldType.MULTI_SELECT]: "Multi-select",
  [FormFieldType.RADIO]: "Radio",
  [FormFieldType.CHECKBOX]: "Checkbox",
  [FormFieldType.FILE_UPLOAD]: "File upload",
  [FormFieldType.ADDRESS]: "Address",
  [FormFieldType.MEMBER_LOOKUP]: "Member lookup",
  [FormFieldType.FAMILY_LOOKUP]: "Family lookup",
  [FormFieldType.HOUSE_LOOKUP]: "House lookup"
};

export function FormFieldDialog({
  versionId,
  open,
  onOpenChange,
  editingField,
  nextOrder
}: {
  versionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingField: FormFieldSummary | null;
  nextOrder: number;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [key, setKey] = useState(editingField?.key ?? "");
  const [label, setLabel] = useState(editingField?.label ?? "");
  const [type, setType] = useState<FormFieldType>((editingField?.type as FormFieldType) ?? FormFieldType.TEXT);
  const [description, setDescription] = useState(editingField?.description ?? "");
  const [required, setRequired] = useState(editingField?.required ?? false);
  const [order, setOrder] = useState(editingField?.order ?? nextOrder);
  const [optionsText, setOptionsText] = useState((editingField?.options ?? []).join("\n"));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setError(null);
      if (editingField) {
        setKey(editingField.key);
        setLabel(editingField.label);
        setType((editingField.type as FormFieldType) ?? FormFieldType.TEXT);
        setDescription(editingField.description ?? "");
        setRequired(editingField.required);
        setOrder(editingField.order);
        setOptionsText((editingField.options ?? []).join("\n"));
      } else {
        setKey("");
        setLabel("");
        setType(FormFieldType.TEXT);
        setDescription("");
        setRequired(false);
        setOrder(nextOrder);
        setOptionsText("");
      }
    }
  }, [open, editingField, nextOrder]);

  const needsOptions = FORM_FIELD_TYPES_WITH_OPTIONS.has(type);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const parsedOptions = optionsText
      .split("\n")
      .map((o) => o.trim())
      .filter(Boolean);
    const payload = {
      key,
      label,
      type,
      description: editingField ? (description || null) : (description || undefined),
      required,
      order,
      options: needsOptions
        ? parsedOptions
        : (editingField ? null : undefined)
    };
    try {
      if (editingField) {
        await apiClient.patch(`/platform/forms/fields/${editingField.id}`, payload);
        toast({ title: "Field updated", variant: "success" });
      } else {
        await apiClient.post(`/platform/forms/versions/${versionId}/fields`, payload);
        toast({ title: "Field added", variant: "success" });
      }
      onOpenChange(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingField ? "Edit field" : "Add field"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Label" htmlFor="field-label">
            <Input id="field-label" required value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Full name" />
          </FormField>
          <FormField label="Key" htmlFor="field-key" hint="Lowercase letters, numbers, underscores.">
            <Input id="field-key" required autoComplete="off" value={key} onChange={(e) => setKey(e.target.value)} placeholder="full_name" />
          </FormField>
          <FormField label="Type" htmlFor="field-type">
            <Select id="field-type" value={type} onChange={(e) => setType(e.target.value as FormFieldType)}>
              {Object.values(FormFieldType).map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABELS[t]}
                </option>
              ))}
            </Select>
          </FormField>
          {needsOptions && (
            <FormField label="Options" htmlFor="field-options" hint="One option per line.">
              <Textarea
                id="field-options"
                rows={4}
                value={optionsText}
                onChange={(e) => setOptionsText(e.target.value)}
                placeholder={"Option A\nOption B"}
              />
            </FormField>
          )}
          <FormField label="Description (optional)" htmlFor="field-description">
            <Input id="field-description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormField>
          <FormField label="Order" htmlFor="field-order">
            <Input
              id="field-order"
              type="number"
              min={0}
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
            />
          </FormField>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={required} onChange={() => setRequired((v) => !v)} />
            Required
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" isLoading={isSubmitting}>
              {editingField ? "Save changes" : "Add field"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
