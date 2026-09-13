import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { WebsiteDomains } from "@/features/website/website-domains";

export default async function WebsiteDomainsPage({
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
    <WebsiteDomains
      slug={slug}
      tenantName={tenant.name}
    />
  );
}
