import "server-only";
import { serverApiGet } from "./server-api";

export interface FormTemplateSummary {
  id: string;
  key: string;
  name: string;
  description: string | null;
  category: string | null;
  isPlatformWide: boolean;
  createdAt: string;
  latestVersion: { id: string; version: number; status: "DRAFT" | "PUBLISHED" } | null;
  assignedTenantCount: number;
}

export interface FormFieldSummary {
  id: string;
  key: string;
  label: string;
  type: string;
  description: string | null;
  required: boolean;
  order: number;
  options: string[] | null;
}

export interface FormVersionSummary {
  id: string;
  version: number;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: string | null;
  fields: FormFieldSummary[];
}

export interface FormTemplateDetail extends FormTemplateSummary {
  versions: FormVersionSummary[];
  assignedTenantIds: string[];
}

export async function getForms(): Promise<FormTemplateSummary[]> {
  const { status, body } = await serverApiGet<{ forms: FormTemplateSummary[] }>("/platform/forms");
  if (status !== 200 || !body.success || !body.data) return [];
  return body.data.forms;
}

export async function getForm(templateId: string): Promise<FormTemplateDetail | null> {
  const { status, body } = await serverApiGet<{ form: FormTemplateDetail }>(
    `/platform/forms/${encodeURIComponent(templateId)}`
  );
  if (status !== 200 || !body.success || !body.data) return null;
  return body.data.form;
}
