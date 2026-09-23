import { redirect } from "next/navigation";
import { PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getPlatformSession } from "@/lib/platform";
import { getForms } from "@/lib/forms";
import { FormsTable } from "@/features/platform/forms-table";

export default async function FormsPage() {
  const user = await getSession();
  if (!user) redirect("/login");

  const platformSession = await getPlatformSession();
  if (!platformSession) redirect("/");

  const forms = await getForms();

  return (
    <>
      <PageHeader
        title="Form Templates"
        description="Standardized forms and dynamic fields for Mahallu surveys, applications, and record collection."
      />
      <FormsTable forms={forms} />
    </>
  );
}
