import { redirect } from "next/navigation";

export default async function RedirectPage({
  params,
  searchParams
}: {
  params: Promise<{ tenant: string }>;
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const { tenant } = await params;
  const sp = searchParams ? await searchParams : {};
  const query = new URLSearchParams(sp as any).toString();
  redirect(`/${tenant}/accounting${query ? `?${query}` : ""}`);
}
