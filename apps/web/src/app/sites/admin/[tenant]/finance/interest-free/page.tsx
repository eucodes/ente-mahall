import { redirect } from "next/navigation";

export default async function InterestFreePage({
  params
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  redirect(`/${slug}/finance`);
}

