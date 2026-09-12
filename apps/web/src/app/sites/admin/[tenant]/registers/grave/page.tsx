import { redirect } from "next/navigation";
import { Card, CardContent, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getRegisterRecords } from "@/lib/registers";
import { RegisterTable } from "@/features/tenants/register-table";
import type { RegisterColumnConfig, RegisterFieldConfig } from "@/features/tenants/register-types";

const RESOURCE = "registers/grave";
const PAGE_SIZE = 100;

const FIELDS: RegisterFieldConfig[] = [
  { name: "deceasedName", label: "Deceased name", required: true },
  { name: "plotNumber", label: "Plot number", required: true },
  { name: "section", label: "Section/block" },
  { name: "burialDate", label: "Burial date", type: "date", required: true },
  { name: "remarks", label: "Remarks", type: "textarea", fullWidth: true }
];

const COLUMNS: RegisterColumnConfig[] = [
  { header: "Deceased", key: "deceasedName" },
  { header: "Plot", key: "plotNumber" },
  { header: "Section", key: "section" },
  { header: "Burial date", key: "burialDate", format: "date" }
];

export default async function GraveRegisterPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const result = await getRegisterRecords(slug, RESOURCE, 1, PAGE_SIZE);

  return (
    <>
      <PageHeader title="Grave register" description="The Mahallu's burial-plot allocation record." />

      {result === null ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to view this register"
              description={`Your role (${membership.role.name}) doesn't include registers.grave.view.`}
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
          dialogTitle={{ create: "Add a grave record", edit: "Edit grave record" }}
          emptyTitle="No grave records yet"
          emptyDescription="Add the first one above."
        />
      )}
    </>
  );
}
