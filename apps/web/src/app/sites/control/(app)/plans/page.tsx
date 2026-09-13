import { redirect } from "next/navigation";
import { Card, CardContent, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getPlatformSession } from "@/lib/platform";
import { getPlans } from "@/lib/billing";
import { getFeatures } from "@/lib/features";
import { PlansTable } from "@/features/platform/plans-table";

export default async function PlansPage() {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const platformSession = await getPlatformSession();
  if (!platformSession) {
    redirect("/");
  }

  const [plans, features] = await Promise.all([getPlans(), getFeatures()]);

  return (
    <>
      <PageHeader title="Plans" description="Configurable entitlements — never hard-coded plan names in application logic." />
      <Card>
        <CardContent className="p-6">
          <PlansTable plans={plans} features={features} />
        </CardContent>
      </Card>
    </>
  );
}
