import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getPlatformSession, getAllTenants } from "@/lib/platform";
import { getForm } from "@/lib/forms";
import { FormFieldsList } from "@/features/platform/form-fields-list";
import { PublishVersionButton, NewDraftVersionButton } from "@/features/platform/form-version-actions";
import { FormAssignmentEditor } from "@/features/platform/form-assignment-editor";
import { DeleteFormButton } from "@/features/platform/delete-form-button";

export default async function FormDetailPage({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = await params;
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const platformSession = await getPlatformSession();
  if (!platformSession) {
    redirect("/");
  }

  const [form, tenants] = await Promise.all([getForm(templateId), getAllTenants()]);
  if (!form) {
    notFound();
  }

  const draftVersion = form.versions.find((v) => v.status === "DRAFT") ?? null;
  const hasPublishedVersion = form.versions.some((v) => v.status === "PUBLISHED");

  return (
    <>
      <PageHeader
        title={form.name}
        description={`${form.key}${form.category ? ` · ${form.category}` : ""}`}
        actions={!hasPublishedVersion && <DeleteFormButton templateId={form.id} name={form.name} />}
      />

      <div className="mb-6">
        <Link href="/forms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          &larr; All forms
        </Link>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>
                {draftVersion ? `Draft — v${draftVersion.version}` : `No open draft`}
              </CardTitle>
              <CardDescription>
                {draftVersion
                  ? "Editable. Publishing freezes this version forever."
                  : "Every version has been published. Open a new draft to make further changes."}
              </CardDescription>
            </div>
            {draftVersion ? (
              <PublishVersionButton versionId={draftVersion.id} fieldCount={draftVersion.fields.length} />
            ) : (
              <NewDraftVersionButton templateId={form.id} />
            )}
          </CardHeader>
          <CardContent>
            {draftVersion && <FormFieldsList versionId={draftVersion.id} fields={draftVersion.fields} editable />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Version history</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.versions.map((version) => (
              <div key={version.id} className="rounded-xl border border-border/70 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold">
                    v{version.version}{" "}
                    <Badge variant={version.status === "PUBLISHED" ? "success" : "outline"} className="ml-1">
                      {version.status === "PUBLISHED" ? "Published" : "Draft"}
                    </Badge>
                  </p>
                  {version.publishedAt && (
                    <p className="text-xs text-muted-foreground">
                      Published {new Date(version.publishedAt).toLocaleString()}
                    </p>
                  )}
                </div>
                {version.status === "DRAFT" ? (
                  <p className="text-sm text-muted-foreground">
                    {version.fields.length} field{version.fields.length === 1 ? "" : "s"} — see the draft card above to edit.
                  </p>
                ) : (
                  <FormFieldsList versionId={version.id} fields={version.fields} editable={false} />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assignment</CardTitle>
            <CardDescription>Which Mahalles use this form.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormAssignmentEditor
              templateId={form.id}
              isPlatformWide={form.isPlatformWide}
              assignedTenantIds={form.assignedTenantIds}
              tenants={tenants}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
