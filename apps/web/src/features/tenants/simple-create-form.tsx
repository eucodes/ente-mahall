"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, FormField, Input, Select, Textarea, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";

export interface SimpleFormField {
  name: string;
  label: string;
  type?: "text" | "textarea" | "datetime-local" | "date" | "select";
  required?: boolean;
  /** Only used when type is "select". */
  options?: { value: string; label: string }[];
  hint?: string;
}

interface SimpleCreateFormProps {
  slug: string;
  resource: string;
  fields: SimpleFormField[];
  successMessage: string;
  /**
   * Constant fields merged into every submission (e.g. `{ publish: true }`
   * for announcements) — plain serializable data, not a function, since a
   * Server Component caller can't pass this Client Component a function
   * prop.
   */
  extraFields?: Record<string, unknown>;
}

/**
 * Shared create-form UI for the simpler business resources. Each caller
 * supplies its own field list since entities differ (Family: name/address/
 * phone; Program: name/description; ...) — this only handles the mechanics
 * (state, submit, error display, success toast, refresh). A `datetime-local`
 * field is converted to an ISO string automatically; every other field is
 * sent as-is, with a blank value omitted.
 */
export function SimpleCreateForm({ slug, resource, fields, successMessage, extraFields }: SimpleCreateFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, ""]))
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const payload: Record<string, unknown> = { ...extraFields };
    for (const field of fields) {
      const raw = values[field.name];
      payload[field.name] = field.type === "datetime-local" && raw ? new Date(raw).toISOString() : raw || undefined;
    }
    try {
      await apiClient.post(`/tenants/${slug}/${resource}`, payload);
      toast({ title: successMessage, variant: "success" });
      setValues(Object.fromEntries(fields.map((f) => [f.name, ""])));
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {fields.map((field) => (
        <FormField
          key={field.name}
          label={field.label}
          htmlFor={`field-${field.name}`}
          required={field.required}
          hint={field.hint}
          error={field.name === fields[0]?.name ? (error ?? undefined) : undefined}
        >
          {field.type === "textarea" ? (
            <Textarea
              id={`field-${field.name}`}
              required={field.required}
              value={values[field.name]}
              onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
            />
          ) : field.type === "select" ? (
            <Select
              id={`field-${field.name}`}
              required={field.required}
              value={values[field.name]}
              onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
            >
              <option value="">Select…</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          ) : (
            <Input
              id={`field-${field.name}`}
              type={field.type ?? "text"}
              required={field.required}
              value={values[field.name]}
              onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
            />
          )}
        </FormField>
      ))}
      <Button type="submit" isLoading={isSubmitting} className="rounded-xl font-bold shadow-xs">
        Add Record
      </Button>
    </form>
  );
}
