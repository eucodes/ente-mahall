import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { RegisterForm } from "@/features/auth/register-form";

export default async function AdminRegisterPage() {
  const user = await getSession();
  if (user) {
    redirect("/");
  }

  return (
  
    <div className="w-full h-screen flex items-center justify-center ">
      <Card className="border-none shadow-lg max-w-sm w-full p-4 flex items-center justify-center">
        <div className="w-full">
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
        </div>
      </Card>
      </div>
  );
}
