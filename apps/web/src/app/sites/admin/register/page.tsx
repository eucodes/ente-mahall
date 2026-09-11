import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { RegisterForm } from "@/features/auth/register-form";
import { AuthShell } from "@/components/auth-shell";

export default async function AdminRegisterPage() {
  const user = await getSession();
  if (user) {
    redirect("/");
  }

  return (
    <AuthShell
      panelTitle="One account, every Mahalle"
      panelDescription="Create a single account and use it to run — or join — as many Mahalles as you belong to."
    >
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>One account works across every Mahalle and app on the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RegisterForm redirectTo="/" />
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
