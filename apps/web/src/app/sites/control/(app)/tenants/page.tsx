import { redirect } from "next/navigation";
import { PageHeader } from "@mahalle/ui";
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
    <div className="space-y-6">
      <PageHeader
        title="Fleet &amp; Mahalles"
        description={`Overseeing ${tenants.length} commissioned Mahalle${
          tenants.length === 1 ? "" : "s"
        } across all jurisdictions.`}
      />
      <TenantsTable tenants={tenants} />
    </div>
  );
}
