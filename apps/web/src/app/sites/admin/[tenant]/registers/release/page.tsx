import { redirect } from "next/navigation";
import { Card, CardContent, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getRegisterRecords } from "@/lib/registers";
import { RegisterTable } from "@/features/tenants/register-table";
import type { RegisterColumnConfig, RegisterFieldConfig } from "@/features/tenants/register-types";

const RESOURCE = "registers/release";
const PAGE_SIZE = 100;

const FIELDS: RegisterFieldConfig[] = [
  { name: "memberName", label: "Member name", required: true },
  { name: "releaseDate", label: "Release date", type: "date", required: true },
  { name: "destinationMahallu", label: "Destination Mahallu" },
  { name: "reason", label: "Reason" },
  { name: "remarks", label: "Remarks", type: "textarea", fullWidth: true }
];

const COLUMNS: RegisterColumnConfig[] = [
  { header: "Member", key: "memberName" },
  { header: "Release date", key: "releaseDate", format: "date" },
  { header: "Destination", key: "destinationMahallu" }
];

export default async function ReleaseRegisterPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const result = await getRegisterRecords(slug, RESOURCE, 1, PAGE_SIZE);

  return (
    <>
      <PageHeader title="Mahallu release register" description="Members formally released from this Mahallu's membership." />

      {result === null ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to view this register"
              description={`Your role (${membership.role.name}) doesn't include registers.release.view.`}
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
          labelKey="memberName"
          dialogTitle={{ create: "Add a release record", edit: "Edit release record" }}
          emptyTitle="No release records yet"
          emptyDescription="Add the first one above."
          certificated
        />
      )}
    </>
  );
}
