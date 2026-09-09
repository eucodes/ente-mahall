import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getTenant } from "@/lib/tenant/get-tenant";

export default async function TenantHomePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mahall = await getTenant(slug);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">{mahall?.name}</h1>
      <p className="max-w-md text-muted-foreground">Member portal — screens land in follow-up prompts.</p>
      <Link href="/login" className={buttonVariants()}>
        Sign in
      </Link>
    </main>
  );
}
