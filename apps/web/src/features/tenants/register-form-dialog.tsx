"use client";

import { useState, type FormEvent } from "react";
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
import { apiClient, ApiError } from "@/lib/api-client";
import type { RegisterFieldConfig, RegisterRecord } from "./register-types";

function toInputValue(value: unknown, type: RegisterFieldConfig["type"]): string {
  if (value === null || value === undefined) return type === "checkbox" ? "false" : "";
  if (type === "date" && typeof value === "string") return value.slice(0, 10);
  if (type === "checkbox") return String(Boolean(value));
  return String(value);
}

export function RegisterFormDialog({
  slug,
  resource,
  open,
  onOpenChange,
  editingRecord,
  fields,
  title
}: {
  slug: string;
  resource: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRecord: RegisterRecord | null;
  fields: RegisterFieldConfig[];
  title: { create: string; edit: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, toInputValue(editingRecord?.[f.name], f.type)]))
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setValue(name: string, value: string) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const payload: Record<string, unknown> = {};
    for (const field of fields) {
      const raw = values[field.name];
      if (field.type === "checkbox") {
        payload[field.name] = raw === "true";
      } else {
        payload[field.name] = raw || undefined;
      }
    }
    try {
      if (editingRecord) {
        await apiClient.patch(`/tenants/${slug}/${resource}/${editingRecord.id}`, payload);
        toast({ title: "Saved", variant: "success" });
      } else {
        await apiClient.post(`/tenants/${slug}/${resource}`, payload);
        toast({ title: "Added", variant: "success" });
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
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingRecord ? title.edit : title.create}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field, index) => {
              const wrapperClass = field.fullWidth || field.type === "textarea" ? "sm:col-span-2" : undefined;
              const fieldId = `field-${field.name}`;
              return (
                <FormField
                  key={field.name}
                  label={field.label}
                  htmlFor={fieldId}
                  required={field.required}
                  hint={field.hint}
                  error={index === 0 ? (error ?? undefined) : undefined}
                  className={wrapperClass}
                >
                  {field.type === "textarea" ? (
                    <Textarea id={fieldId} required={field.required} value={values[field.name]} onChange={(e) => setValue(field.name, e.target.value)} />
                  ) : field.type === "select" ? (
                    <Select id={fieldId} required={field.required} value={values[field.name]} onChange={(e) => setValue(field.name, e.target.value)}>
                      <option value="">Select…</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Select>
                  ) : field.type === "checkbox" ? (
                    <div className="flex h-9 items-center">
                      <Checkbox checked={values[field.name] === "true"} onChange={(e) => setValue(field.name, String(e.target.checked))} />
                    </div>
                  ) : (
                    <Input
                      id={fieldId}
                      type={field.type === "date" ? "date" : "text"}
                      required={field.required}
                      value={values[field.name]}
                      onChange={(e) => setValue(field.name, e.target.value)}
                    />
                  )}
                </FormField>
              );
            })}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingRecord ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
