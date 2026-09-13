"use client";

import { useState } from "react";
import { Button, EmptyState, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@mahalle/ui";
import type { PaymentSummary } from "@/lib/billing";
import { RecordPaymentDialog } from "./record-payment-dialog";

function formatAmount(amountMinor: number, currency: string) {
  return (amountMinor / 100).toLocaleString("en-IN", { style: "currency", currency });
}

export function PaymentsPanel({ tenantId, payments }: { tenantId: string; payments: PaymentSummary[] }) {
  const [recordOpen, setRecordOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={() => setRecordOpen(true)}>
          Record payment
        </Button>
      </div>

      {payments.length === 0 ? (
        <EmptyState title="No payments recorded yet" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Recorded</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{formatAmount(payment.amountMinor, payment.currency)}</TableCell>
                <TableCell className="text-muted-foreground">{payment.method}</TableCell>
                <TableCell className="text-muted-foreground">{payment.reference ?? "—"}</TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {new Date(payment.recordedAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <RecordPaymentDialog tenantId={tenantId} open={recordOpen} onOpenChange={setRecordOpen} />
    </div>
  );
}
