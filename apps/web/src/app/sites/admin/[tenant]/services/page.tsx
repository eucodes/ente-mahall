import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, EmptyState, PageHeader } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getServiceRequests } from "@/lib/services";
import { getMembers } from "@/lib/members";
import { SimpleCreateForm } from "@/features/tenants/simple-create-form";
import { ServiceRequestsTable } from "@/features/tenants/service-requests-table";

const PAGE_SIZE = 100;

export default async function ServicesPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const [result, membersResult] = await Promise.all([getServiceRequests(slug, 1, PAGE_SIZE), getMembers(slug, 1, PAGE_SIZE)]);

  if (result === null) {
    return (
      <>
        <PageHeader title="Services" description="Requests from members — a workflow layer over the Registers, Certificates, and Events." />
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="You don't have permission to view services"
              description={`Your role (${membership.role.name}) doesn't include services.view.`}
            />
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Services" description="Requests from members — a workflow layer over the Registers, Certificates, and Events." />
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Log a request</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleCreateForm
              slug={slug}
              resource="services"
              successMessage="Request logged"
              fields={[
                { name: "requestType", label: "Request type", required: true, hint: "e.g. Death Certificate Copy, Event Registration" },
                { name: "requesterName", label: "Requester name", required: true },
                { name: "requesterPhone", label: "Requester phone" },
                {
                  name: "memberId",
                  label: "Member",
                  type: "select",
                  hint: "Optional — if the requester is a registered member",
                  options: (membersResult?.members ?? []).map((m) => ({ value: m.id, label: m.fullName }))
                },
                { name: "subject", label: "Subject", required: true },
                { name: "description", label: "Description", type: "textarea" }
              ]}
            />
          </CardContent>
        </Card>
        <ServiceRequestsTable slug={slug} requests={result.requests} />
      </div>
    </>
  );
}
