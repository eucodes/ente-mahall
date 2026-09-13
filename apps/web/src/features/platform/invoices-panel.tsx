"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, EmptyState, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { InvoiceSummary } from "@/lib/billing";
import { CreateInvoiceDialog } from "./create-invoice-dialog";

function formatAmount(amountMinor: number, currency: string) {
  return (amountMinor / 100).toLocaleString("en-IN", { style: "currency", currency });
}

const STATUS_TONE: Record<string, "success" | "outline" | "destructive"> = {
  DRAFT: "outline",
  ISSUED: "outline",
  PAID: "success",
  OVERDUE: "destructive",
  VOID: "outline"
};

export function InvoicesPanel({ tenantId, invoices }: { tenantId: string; invoices: InvoiceSummary[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function handleMarkPaid(invoiceId: string) {
    setSavingId(invoiceId);
    try {
      await apiClient.post(`/platform/tenants/${tenantId}/billing/invoices/${invoiceId}/mark-paid`, {});
      toast({ title: "Invoice marked paid", variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong.";
      toast({ title: "Couldn't mark invoice paid", description: message, variant: "destructive" });
    } finally {
      setSavingId(null);
    }
  }

  async function handleVoid(invoiceId: string) {
    setSavingId(invoiceId);
    try {
      await apiClient.post(`/platform/tenants/${tenantId}/billing/invoices/${invoiceId}/void`, {});
      toast({ title: "Invoice voided", variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong.";
      toast({ title: "Couldn't void invoice", description: message, variant: "destructive" });
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          Issue invoice
        </Button>
      </div>

      {invoices.length === 0 ? (
        <EmptyState title="No invoices yet" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead>Due</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{formatAmount(invoice.amountMinor, invoice.currency)}</TableCell>
                <TableCell className="text-muted-foreground">{invoice.description ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_TONE[invoice.status] ?? "outline"}>{invoice.status}</Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {invoice.issuedAt ? new Date(invoice.issuedAt).toLocaleDateString() : "—"}
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {invoice.dueAt ? new Date(invoice.dueAt).toLocaleDateString() : "—"}
                </TableCell>
                <TableCell className="text-right">
                  {invoice.status !== "PAID" && invoice.status !== "VOID" && (
                    <div className="flex justify-end gap-2">
                      <Button size="sm" isLoading={savingId === invoice.id} onClick={() => handleMarkPaid(invoice.id)}>
                        Mark paid
                      </Button>
                      <Button size="sm" variant="outline" isLoading={savingId === invoice.id} onClick={() => handleVoid(invoice.id)}>
                        Void
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <CreateInvoiceDialog tenantId={tenantId} open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
