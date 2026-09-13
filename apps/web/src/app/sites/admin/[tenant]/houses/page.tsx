import { redirect } from "next/navigation";

export default async function HousesPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  redirect(`/${slug}/families`);
}
