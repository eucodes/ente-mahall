import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Sparkles, Users } from "@mahalle/ui";
import { getMemberSession } from "@/lib/member-session";
import { getPublicTenant } from "@/lib/tenants";
import { MemberOtpLoginForm } from "@/features/auth/member-otp-login-form";

export default async function TenantLoginPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const [member, tenant] = await Promise.all([
    getMemberSession(slug),
    getPublicTenant(slug)
  ]);

  if (member) {
    redirect("/dashboard");
  }

  const mahalleName = tenant?.name ?? `${slug.toUpperCase()} Mahalle`;

  return (
    <div className="mx-auto max-w-md py-10 sm:py-16">
      <Card className="rounded-3xl border-border/80 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-950 to-slate-900 p-6 text-white text-center space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">{mahalleName}</h2>
          <p className="text-xs text-slate-300">Citizen Member Self-Service Portal</p>
        </div>

        <CardHeader className="pt-6 pb-2">
          <CardTitle className="text-base font-bold text-foreground">Sign In via Phone & OTP</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Enter your registered mobile number to receive a one-time login code. No password required.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2 pb-6 space-y-4">
          <MemberOtpLoginForm tenantSlug={slug} redirectTo="/dashboard" />

          <div className="pt-4 border-t border-border/60 text-center">
            <Link href="/" className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
              ← Return to public homepage
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
