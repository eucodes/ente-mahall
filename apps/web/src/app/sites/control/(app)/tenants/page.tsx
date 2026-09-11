import { redirect } from "next/navigation";
import { Card, CardContent, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getAllTenants, getPlatformSession } from "@/lib/platform";
import { TenantsTable } from "@/features/platform/tenants-table";

export default async function AllMahallesPage() {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const platformSession = await getPlatformSession();
  if (!platformSession) {
    redirect("/");
  }

  const tenants = await getAllTenants();

  return (
    <>
      <PageHeader title="All Mahalles" description={`${tenants.length} Mahalle${tenants.length === 1 ? "" : "s"} on the platform.`} />
      <Card>
        <CardContent className="p-6">
          {tenants.length === 0 ? <EmptyState title="No Mahalles yet" /> : <TenantsTable tenants={tenants} />}
        </CardContent>
      </Card>
    </>
  );
}
