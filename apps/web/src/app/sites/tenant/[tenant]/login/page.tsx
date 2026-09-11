import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mahalle/ui";
import { getMemberSession } from "@/lib/member-session";
import { MemberOtpLoginForm } from "@/features/auth/member-otp-login-form";

export default async function TenantLoginPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const member = await getMemberSession(slug);
  if (member) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-sm py-8">
      <Card>
        <CardHeader>
          <CardTitle className="capitalize">{slug} Mahalle</CardTitle>
          <CardDescription>Log in with your phone number to reach your member dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <MemberOtpLoginForm tenantSlug={slug} redirectTo="/dashboard" />
        </CardContent>
      </Card>
    </div>
  );
}
