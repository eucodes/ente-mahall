import { redirect } from "next/navigation";
import { PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import {
  getCollections,
  getCollectionCategories,
  getPaymentMethods,
  getAccounts
} from "@/lib/finance";
import { getFamilies } from "@/lib/business-resources";
import { getMembers } from "@/lib/members";
import { CollectionsClient } from "./collections-client";

export default async function CollectionsPage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const [
    collectionsRes,
    categories,
    accounts,
    paymentMethods,
    familiesRes,
    membersRes
  ] = await Promise.all([
    getCollections(slug, "page=1&pageSize=100"),
    getCollectionCategories(slug),
    getAccounts(slug),
    getPaymentMethods(slug),
    getFamilies(slug, 1, 100),
    getMembers(slug, 1, 100)
  ]);

  const collections = collectionsRes?.collections ?? [];

  return (
    <>
      <PageHeader
        title="Collections"
      />
      <CollectionsClient
        slug={slug}
        mahalleName={membership.tenant.name || "Mahall"}
        initialCollections={collections}
        categories={categories || []}
        accounts={accounts || []}
        paymentMethods={paymentMethods || []}
        families={familiesRes?.items || []}
        members={membersRes?.members || []}
      />
    </>
  );
}
