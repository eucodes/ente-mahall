import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mahalle/ui";
import { adminHost } from "@/lib/env";
import { getSession } from "@/lib/session";
import { CreateTenantForm } from "@/features/tenants/create-tenant-form";
import { AuthShell } from "@/components/auth-shell";

export default async function NewMahallePage() {
  const user = await getSession();
  if (!user) {
    redirect(`http://${adminHost()}/login`);
  }

  return (
    <AuthShell
      panelTitle="Your Mahalle, its own private workspace"
      panelDescription="Members, families, events, announcements, and programs — isolated from every other Mahalle on the platform, and yours to run."
    >
      <Card>
        <CardHeader>
          <CardTitle>Create your Mahalle</CardTitle>
          <CardDescription>You&apos;ll be its OWNER, with full administrative access.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateTenantForm />
        </CardContent>
      </Card>
    </AuthShell>
  );
}
