import { redirect } from "next/navigation";
import { Badge, Card, CardContent, CardHeader,CardDescription, CardTitle, ShieldCheck } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { LoginForm } from "@/features/auth/login-form";
import { AuthShell } from "@/components/auth-shell";

export default async function ControlLoginPage({
  searchParams
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const [{ reason }, user] = await Promise.all([searchParams, getSession()]);
  if (user) {
    redirect("/");
  }

  return (
    <div className="w-full h-screen flex items-center justify-center ">
      <Card className="border-none shadow-lg max-w-sm w-full p-4 flex items-center justify-center">
        <div className="w-full">
        <CardHeader className="items-center">
          <CardTitle className="text-2xl font-bold">Control Panel Log in</CardTitle>
                    <CardDescription>Log in with your Control Panel account.</CardDescription>
          
        </CardHeader>
        <CardContent>
          <LoginForm
            redirectTo="/"
            defaultEmail="platform-admin@mahalle.local"
            defaultPassword="ChangeMe123!"
            inactivityNotice={reason === "inactivity"}
            sessionExpiredNotice={reason === "expired"}
            loginfield="destructive"
          />
        </CardContent>
        </div>
      </Card>
      </div>
  );
}
