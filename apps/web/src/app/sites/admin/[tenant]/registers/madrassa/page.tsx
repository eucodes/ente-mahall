import { redirect } from "next/navigation";
import { Card, CardContent, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getRegisterRecords } from "@/lib/registers";
import { RegisterTable } from "@/features/tenants/register-table";
import type { RegisterColumnConfig, RegisterFieldConfig } from "@/features/tenants/register-types";

const RESOURCE = "registers/madrassa";
const PAGE_SIZE = 100;

const FIELDS: RegisterFieldConfig[] = [
  { name: "studentName", label: "Student name", required: true },
  { name: "className", label: "Class/level" },
  { name: "guardianName", label: "Guardian name" },
  { name: "guardianPhone", label: "Guardian phone" },
  { name: "admissionDate", label: "Admission date", type: "date", required: true },
  { name: "remarks", label: "Remarks", type: "textarea", fullWidth: true }
];

const COLUMNS: RegisterColumnConfig[] = [
  { header: "Student", key: "studentName" },
  { header: "Class", key: "className" },
  { header: "Guardian", key: "guardianName" },
  { header: "Admitted", key: "admissionDate", format: "date" }
];

export default async function MadrassaRegisterPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const result = await getRegisterRecords(slug, RESOURCE, 1, PAGE_SIZE);

  return (
    <>
      <PageHeader title="Madrassa / Dars register" description="Religious-education enrollment record." />

      {result === null ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to view this register"
              description={`Your role (${membership.role.name}) doesn't include registers.madrassa.view.`}
            />
          </CardContent>
        </Card>
      ) : (
        <RegisterTable
          slug={slug}
          resource={RESOURCE}
          records={result.records}
          columns={COLUMNS}
          fields={FIELDS}
          labelKey="studentName"
          dialogTitle={{ create: "Add an enrollment", edit: "Edit enrollment" }}
          emptyTitle="No enrollments yet"
          emptyDescription="Add the first one above."
        />
      )}
    </>
  );
}
