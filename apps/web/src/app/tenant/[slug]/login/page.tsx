import { notFound } from "next/navigation";
import { getTenant } from "@/lib/tenant/get-tenant";
import { LoginForm } from "./login-form";

export default async function TenantLoginPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mahall = await getTenant(slug);
  if (!mahall) notFound();

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <LoginForm slug={slug} mahallName={mahall.name} />
    </main>
  );
}
