import { redirect } from "next/navigation";
import { Badge, Card, CardContent, CardHeader,CardDescription, CardTitle, ShieldCheck } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { LoginForm } from "@/features/auth/login-form";
import { AuthShell } from "@/components/auth-shell";

function sanitizeReturnTo(url?: string | null): string {
  if (!url) return "/";
  if (url.startsWith("/") && !url.startsWith("//") && !url.startsWith("/\\")) {
    return url;
  }
  return "/";
}

export default async function ControlLoginPage({
  searchParams
}: {
  searchParams: Promise<{ reason?: string; returnTo?: string; redirect?: string }>;
}) {
  const [{ reason, returnTo, redirect: redir }, user] = await Promise.all([searchParams, getSession()]);
  const destination = sanitizeReturnTo(returnTo || redir);
  if (user) {
    redirect(destination);
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
            redirectTo={destination}
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
