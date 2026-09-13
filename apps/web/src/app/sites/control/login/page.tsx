import { redirect } from "next/navigation";
import { Badge, Card, CardContent, CardHeader, CardTitle, ShieldCheck } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { LoginForm } from "@/features/auth/login-form";
import { AuthShell } from "@/components/auth-shell";

export default async function ControlLoginPage() {
  const user = await getSession();
  if (user) {
    redirect("/");
  }

  return (
    <AuthShell
      accent="destructive"
      panelBadge={
        <Badge variant="secondary" className="gap-1.5 bg-white/15 text-primary-foreground">
          <ShieldCheck className="h-3.5 w-3.5" /> Platform staff only
        </Badge>
      }
      panelTitle="Platform control plane"
      panelDescription="This area is for platform staff only. Every action taken here is recorded to the platform-wide audit log."
    >
      <Card>
        <CardHeader>
          <CardTitle>Log in</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm
            redirectTo="/"
            defaultEmail="platform-admin@mahalle.local"
            defaultPassword="ChangeMe123!"
          />
   
        </CardContent>
      </Card>
    </AuthShell>
  );
}
