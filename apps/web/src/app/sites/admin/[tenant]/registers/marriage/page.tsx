import { redirect } from "next/navigation";
import { Card, CardContent, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getRegisterRecords } from "@/lib/registers";
import { RegisterTable } from "@/features/tenants/register-table";
import type { RegisterColumnConfig, RegisterFieldConfig } from "@/features/tenants/register-types";

const RESOURCE = "registers/marriage";
const PAGE_SIZE = 100;

const FIELDS: RegisterFieldConfig[] = [
  { name: "groomName", label: "Groom's name", required: true },
  { name: "groomFatherName", label: "Groom's father's name" },
  { name: "brideName", label: "Bride's name", required: true },
  { name: "brideFatherName", label: "Bride's father's name" },
  { name: "marriageDate", label: "Marriage date", type: "date", required: true },
  { name: "place", label: "Place" },
  { name: "officiantName", label: "Officiant (Khazi/Imam)" },
  { name: "witness1Name", label: "Witness 1" },
  { name: "witness2Name", label: "Witness 2" },
  { name: "mahrDetails", label: "Mahr details" },
  { name: "remarks", label: "Remarks", type: "textarea", fullWidth: true }
];

const COLUMNS: RegisterColumnConfig[] = [
  { header: "Groom", key: "groomName" },
  { header: "Bride", key: "brideName" },
  { header: "Date", key: "marriageDate", format: "date" }
];

export default async function MarriageRegisterPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const result = await getRegisterRecords(slug, RESOURCE, 1, PAGE_SIZE);

  return (
    <>
      <PageHeader title="Marriage register" description="The Mahallu's official nikah record, with printable certificates." />

      {result === null ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to view this register"
              description={`Your role (${membership.role.name}) doesn't include registers.marriage.view.`}
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
          labelKey="groomName"
          dialogTitle={{ create: "Add a marriage record", edit: "Edit marriage record" }}
          emptyTitle="No marriage records yet"
          emptyDescription="Add the first one above."
          certificated
        />
      )}
    </>
  );
}
