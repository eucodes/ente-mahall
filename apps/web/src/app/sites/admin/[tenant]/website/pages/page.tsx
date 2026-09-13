import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { WebsitePages } from "@/features/website/website-pages";

export default async function WebsitePagesPage({
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
    <WebsitePages
      slug={slug}
      tenantName={tenant.name}
    />
  );
}
