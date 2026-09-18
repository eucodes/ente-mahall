import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession, redirectToLogin } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getServiceRequests } from "@/lib/services";
import { getDues } from "@/lib/finance";
import { getStructure } from "@/lib/structure";
import { AdminShell } from "@/features/navigation/admin-shell";

import { getMyTenantFeatures } from "@/lib/features";

export default async function TenantAdminLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) {
    return await redirectToLogin();
  }

  const membership = await getMyTenantMembership(slug);
  if (!membership) {
    redirect("/");
  }

  // Fetch pending notification items, structure, and feature flags in parallel
  const [serviceReqs, pendingDues, structureData, features] = await Promise.all([
    getServiceRequests(slug, 1, 1).catch(() => null),
    getDues(slug, 1, 1).catch(() => null),
    getStructure(slug).catch(() => null),
    getMyTenantFeatures(slug).catch(() => [])
  ]);

  const disabledFeatures = features.filter((f) => !f.effective).map((f) => f.key);
  const hasDivisions = structureData?.structure?.hasDivisions ?? false;
  const divisionTerm = structureData?.structure?.divisionTerm || "Ward";

  const notificationItems = [];
  if (serviceReqs && serviceReqs.total > 0) {
    notificationItems.push({
      label: "Pending service requests",
      count: serviceReqs.total,
      href: `/${slug}/services`
    });
  }
  if (pendingDues && pendingDues.total > 0) {
    notificationItems.push({
      label: "Dues to reconcile",
      count: pendingDues.total,
      href: `/${slug}/finance/dues`
    });
  }

  return (
    <AdminShell
      slug={slug}
      tenantName={membership.tenant.name}
      masjidName={membership.tenant.masjidName ?? undefined}
      userName={user.fullName}
      userRole={membership.role.name}
      hasDivisions={hasDivisions}
      divisionTerm={divisionTerm}
      disabledFeatures={disabledFeatures}
      notificationItems={notificationItems}
    >
      {children}
    </AdminShell>
  );
}
