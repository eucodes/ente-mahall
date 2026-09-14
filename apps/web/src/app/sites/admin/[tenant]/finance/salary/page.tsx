import { redirect } from "next/navigation";

export default async function SalaryPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  redirect(`/${slug}/finance/payments`);
}

