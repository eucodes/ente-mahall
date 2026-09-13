import { redirect } from "next/navigation";
import { PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getJournalEntries, getAccounts } from "@/lib/finance";
import { JournalClient } from "./journal-client";

export default async function JournalPage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const [entriesRes, accounts] = await Promise.all([
    getJournalEntries(slug, 1, 100),
    getAccounts(slug)
  ]);

  return (
    <>
      <PageHeader
        title="Journal Entries"
        description="Double-entry audit log of all financial transactions posted to the general ledger."
      />
      <JournalClient
        slug={slug}
        initialEntries={entriesRes?.journalEntries ?? []}
        accounts={accounts ?? []}
      />
    </>
  );
}
