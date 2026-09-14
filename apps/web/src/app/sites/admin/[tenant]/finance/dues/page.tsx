import { redirect } from "next/navigation";

export default async function DuesPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  redirect(`/${slug}/finance/collections`);
}

