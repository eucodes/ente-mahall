import { redirect } from "next/navigation";
import { PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getTaxLegalFilings } from "@/lib/finance";
import { TaxesLegalClient } from "./taxes-legal-client";

export default async function TaxesLegalPage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const filings = await getTaxLegalFilings(slug);

  return (
    <>
      <PageHeader
        title="Taxes & Legal Compliance"
        description="Statutory compliance calendars, Waqf board filings, 12A/80G status, and audit reports."
      />
      <TaxesLegalClient slug={slug} initialFilings={filings ?? []} />
    </>
  );
}
