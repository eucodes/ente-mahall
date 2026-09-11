import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mahalle/ui";
import { adminHost } from "@/lib/env";
import { getSession } from "@/lib/session";
import { CreateTenantForm } from "@/features/tenants/create-tenant-form";

export default async function NewMahallePage() {
  const user = await getSession();
  if (!user) {
    redirect(`http://${adminHost()}/login`);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Create your Mahalle</CardTitle>
          <CardDescription>You&apos;ll be its OWNER, with full administrative access.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateTenantForm />
        </CardContent>
      </Card>
    </main>
  );
}
