import { notFound } from "next/navigation";
import { getTenant } from "@/lib/tenant/get-tenant";

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mahall = await getTenant(slug);
  if (!mahall) notFound();

  return <>{children}</>;
}
