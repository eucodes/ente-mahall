import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle, Card, CardContent, CardHeader, CardTitle } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { LoginForm } from "@/features/auth/login-form";

export default async function ControlLoginPage() {
  const user = await getSession();
  if (user) {
    redirect("/");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-6 py-16">
      <Alert variant="warning">
        <AlertTitle>Platform control plane</AlertTitle>
        <AlertDescription>This area is for platform staff only. All access is audited.</AlertDescription>
      </Alert>
      <Card>
        <CardHeader>
          <CardTitle>Log in</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm redirectTo="/" />
        </CardContent>
      </Card>
    </main>
  );
}
