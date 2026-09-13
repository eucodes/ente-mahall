import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { WebsiteOverview } from "@/features/website/website-overview";

export default async function TenantAdminWebsitePage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const membership = await getMyTenantMembership(slug);
  if (!membership) {
    redirect("/");
  }

  const tenant = membership.tenant;

  return (
    <WebsiteOverview
      slug={slug}
      tenantName={tenant.name}
      masjidName={tenant.masjidName}
    />
  );
}
