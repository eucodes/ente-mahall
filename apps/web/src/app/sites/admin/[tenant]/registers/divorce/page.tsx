import { redirect } from "next/navigation";
import { Card, CardContent, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getRegisterRecords } from "@/lib/registers";
import { RegisterTable } from "@/features/tenants/register-table";
import type { RegisterColumnConfig, RegisterFieldConfig } from "@/features/tenants/register-types";

const RESOURCE = "registers/divorce";
const PAGE_SIZE = 100;

const FIELDS: RegisterFieldConfig[] = [
  { name: "husbandName", label: "Husband's name", required: true },
  { name: "wifeName", label: "Wife's name", required: true },
  { name: "divorceType", label: "Type", hint: "e.g. Talaq, Khula, Faskh" },
  { name: "divorceDate", label: "Date", type: "date", required: true },
  { name: "place", label: "Place" },
  { name: "officiantName", label: "Officiant (Khazi/Imam)" },
  { name: "remarks", label: "Remarks", type: "textarea", fullWidth: true }
];

const COLUMNS: RegisterColumnConfig[] = [
  { header: "Husband", key: "husbandName" },
  { header: "Wife", key: "wifeName" },
  { header: "Type", key: "divorceType" },
  { header: "Date", key: "divorceDate", format: "date" }
];

export default async function DivorceRegisterPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const result = await getRegisterRecords(slug, RESOURCE, 1, PAGE_SIZE);

  return (
    <>
      <PageHeader title="Divorce register" description="The Mahallu's official divorce record, with printable certificates." />

      {result === null ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to view this register"
              description={`Your role (${membership.role.name}) doesn't include registers.divorce.view.`}
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
          labelKey="husbandName"
          dialogTitle={{ create: "Add a divorce record", edit: "Edit divorce record" }}
          emptyTitle="No divorce records yet"
          emptyDescription="Add the first one above."
          certificated
        />
      )}
    </>
  );
}
