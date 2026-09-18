import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { LoginForm } from "@/features/auth/login-form";
import { AuthShell } from "@/components/auth-shell";

export default async function AdminLoginPage({
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
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Log in with your Mahalle account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginForm
            redirectTo="/"
            inactivityNotice={reason === "inactivity"}
            sessionExpiredNotice={reason === "expired"}
          />
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
        </div>
      </Card>
      </div>
  );
}
