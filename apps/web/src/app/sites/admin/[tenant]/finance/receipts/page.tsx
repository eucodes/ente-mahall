import { redirect } from "next/navigation";
import { PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getReceipts } from "@/lib/finance";
import { ReceiptsClient } from "./receipts-client";

export default async function ReceiptsPage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const receiptsRes = await getReceipts(slug, 1, 100);
  const receipts = receiptsRes?.receipts ?? [];

  return (
    <>
      <PageHeader
        title="Receipts Registry"
        description="Official money receipts issued with printable view, WhatsApp sharing, and audit-safe cancellation."
      />
      <ReceiptsClient
        slug={slug}
        mahalleName={membership.tenant.name || "Mahall"}
        initialReceipts={receipts}
      />
    </>
  );
}
