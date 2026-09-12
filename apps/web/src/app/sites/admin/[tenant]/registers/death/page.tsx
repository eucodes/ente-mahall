import { redirect } from "next/navigation";
import { Card, CardContent, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getRegisterRecords } from "@/lib/registers";
import { RegisterTable } from "@/features/tenants/register-table";
import type { RegisterColumnConfig, RegisterFieldConfig } from "@/features/tenants/register-types";

const RESOURCE = "registers/death";
const PAGE_SIZE = 100;

const FIELDS: RegisterFieldConfig[] = [
  { name: "deceasedName", label: "Deceased name", required: true },
  { name: "fatherOrGuardianName", label: "Father/guardian name" },
  { name: "gender", label: "Gender", type: "select", options: [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "OTHER", label: "Other" }
  ] },
  { name: "dateOfBirth", label: "Date of birth", type: "date" },
  { name: "dateOfDeath", label: "Date of death", type: "date", required: true },
  { name: "placeOfDeath", label: "Place of death" },
  { name: "causeOfDeath", label: "Cause of death" },
  { name: "burialDate", label: "Burial date", type: "date" },
  { name: "remarks", label: "Remarks", type: "textarea", fullWidth: true }
];

const COLUMNS: RegisterColumnConfig[] = [
  { header: "Deceased", key: "deceasedName" },
  { header: "Date of death", key: "dateOfDeath", format: "date" },
  { header: "Place", key: "placeOfDeath" }
];

export default async function DeathRegisterPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const result = await getRegisterRecords(slug, RESOURCE, 1, PAGE_SIZE);

  return (
    <>
      <PageHeader title="Death register" description="The Mahallu's official record of deaths, with printable certificates." />

      {result === null ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to view this register"
              description={`Your role (${membership.role.name}) doesn't include registers.death.view.`}
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
          labelKey="deceasedName"
          dialogTitle={{ create: "Add a death record", edit: "Edit death record" }}
          emptyTitle="No death records yet"
          emptyDescription="Add the first one above."
          certificated
        />
      )}
    </>
  );
}
