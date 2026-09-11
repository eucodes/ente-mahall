import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle, Badge } from "@mahalle/ui";
import { getMemberSession } from "@/lib/member-session";
import { LogoutButton } from "@/features/auth/logout-button";

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

  const logoutEndpoint = `/tenants/${encodeURIComponent(slug)}/member-auth/logout`;

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-6 py-16">
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="capitalize">
          {slug}.example.com/dashboard &middot; member area
        </Badge>
        <LogoutButton redirectTo="/login" endpoint={logoutEndpoint} />
      </div>
      <h1 className="text-2xl font-semibold">Welcome, {member.fullName}</h1>
      <Alert>
        <AlertTitle>Signed in as a Mahalle member</AlertTitle>
        <AlertDescription>
          Phone + OTP login is a separate identity from the admin account that manages this
          Mahalle at admin.example.com — admins never land here automatically, and this
          session only works for this Mahalle.
        </AlertDescription>
      </Alert>
    </main>
  );
}
