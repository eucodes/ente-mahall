import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMyTenants } from "@/lib/tenants";

export default async function AdminHomePage() {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const tenants = await getMyTenants();

  if (tenants.length > 0) {
    // Single-tenant rule: Automatically direct user to their managed Mahall workspace
    redirect(`/${tenants[0].tenant.slug}`);
  }

  // If user has no Mahall registered yet, send directly to setup wizard to create one
  redirect("/onboarding");
}
