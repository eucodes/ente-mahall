import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle, PageHeader } from "@mahalle/ui";
import { getMemberSession } from "@/lib/member-session";

export default async function TenantDashboardPage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const member = await getMemberSession(slug);
  if (!member) {
    redirect("/login");
  }

  return (
    <>
      <PageHeader title={`Welcome, ${member.fullName}`} />
      <Alert>
        <AlertTitle>Signed in as a Mahalle member</AlertTitle>
        <AlertDescription>
          Phone + OTP login is a separate identity from the admin account that manages this
          Mahalle at admin.example.com — admins never land here automatically, and this
          session only works for this Mahalle.
        </AlertDescription>
      </Alert>
    </>
  );
}
