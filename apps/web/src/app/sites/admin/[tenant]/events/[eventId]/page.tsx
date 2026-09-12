import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Badge, Card, CardContent, CardHeader, CardTitle, PageHeader, StatCard } from "@mahalle/ui";
import { getSession } from "@/lib/session";
import { getMyTenantMembership } from "@/lib/tenants";
import { getEvent, getEventFinanceSummary, getEventRegistrations } from "@/lib/event-detail";
import { EventRegistrationsTable } from "@/features/tenants/event-registrations-table";

export default async function EventDetailPage({ params }: { params: Promise<{ tenant: string; eventId: string }> }) {
  const { tenant: slug, eventId } = await params;
  const user = await getSession();
  if (!user) redirect("/login");

  const membership = await getMyTenantMembership(slug);
  if (!membership) redirect("/");

  const event = await getEvent(slug, eventId);
  if (!event) notFound();

  const [registrations, financeSummary] = await Promise.all([getEventRegistrations(slug, eventId), getEventFinanceSummary(slug, eventId)]);

  return (
    <>
      <PageHeader
        title={event.title}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{new Date(event.startsAt).toLocaleString("en-IN")}</Badge>
            {event.location && <span>{event.location}</span>}
          </span>
        }
        actions={
          <Link href={`/${slug}/events`} className="text-sm font-medium text-primary hover:underline">
            ← All events
          </Link>
        }
      />

      <div className="space-y-6">
        {financeSummary && (
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Income" value={`₹${financeSummary.totalIncome}`} tone="green" />
            <StatCard label="Expense" value={`₹${financeSummary.totalExpense}`} tone="blue" />
            <StatCard label="Net" value={`₹${financeSummary.net}`} tone="violet" />
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <EventRegistrationsTable slug={slug} eventId={eventId} registrations={registrations ?? []} />
          </CardContent>
        </Card>

        {financeSummary && financeSummary.vouchers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Income & expenditure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {financeSummary.vouchers.map((voucher) => (
                <div key={voucher.id} className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0">
                  <div>
                    <p className="font-medium">{voucher.account.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {voucher.voucherNumber} · {new Date(voucher.date).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <span className={voucher.type === "RECEIPT" ? "text-emerald-600" : "text-rose-600"}>
                    {voucher.type === "RECEIPT" ? "+" : "-"}₹{voucher.amount}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
