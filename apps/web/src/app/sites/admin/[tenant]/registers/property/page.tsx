import { redirect } from "next/navigation";
import { Card, CardContent, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getRegisterRecords } from "@/lib/registers";
import { RegisterTable } from "@/features/tenants/register-table";
import type { RegisterColumnConfig, RegisterFieldConfig } from "@/features/tenants/register-types";

const RESOURCE = "registers/property";
const PAGE_SIZE = 100;

const FIELDS: RegisterFieldConfig[] = [
  {
    name: "propertyType",
    label: "Type",
    type: "select",
    required: true,
    options: [
      { value: "WAQF", label: "Waqf" },
      { value: "ASSET", label: "Owned asset" },
      { value: "RENTED", label: "Rented out" }
    ]
  },
  { name: "name", label: "Name/description", required: true },
  { name: "location", label: "Location" },
  { name: "areaDetails", label: "Area details" },
  { name: "lesseeName", label: "Lessee name", hint: "If rented out" },
  { name: "lesseePhone", label: "Lessee phone" },
  { name: "rentAmount", label: "Rent amount" },
  { name: "acquisitionDate", label: "Acquisition date", type: "date" },
  { name: "remarks", label: "Remarks", type: "textarea", fullWidth: true }
];

const COLUMNS: RegisterColumnConfig[] = [
  { header: "Name", key: "name" },
  { header: "Type", key: "propertyType" },
  { header: "Location", key: "location" },
  { header: "Lessee", key: "lesseeName" }
];

export default async function PropertyRegisterPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const result = await getRegisterRecords(slug, RESOURCE, 1, PAGE_SIZE);

  return (
    <>
      <PageHeader title="Property register" description="Waqf land/buildings, owned assets, and property rented out." />

      {result === null ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to view this register"
              description={`Your role (${membership.role.name}) doesn't include registers.property.view.`}
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
          labelKey="name"
          dialogTitle={{ create: "Add a property record", edit: "Edit property record" }}
          emptyTitle="No property records yet"
          emptyDescription="Add the first one above."
        />
      )}
    </>
  );
}
