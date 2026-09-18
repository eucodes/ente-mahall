"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  Button,
  Badge,
  Input,
  Select,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  FormField,
  Textarea,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Plus,
  Check,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { TaxLegalFiling } from "@/lib/finance";

interface Props {
  slug: string;
  initialFilings: TaxLegalFiling[];
}

export function TaxesLegalClient({ slug, initialFilings }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form
  const [title, setTitle] = useState("");
  const [filingType, setFilingType] = useState("");
  const [period, setPeriod] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !dueDate) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post(`/tenants/${slug}/finance/taxes-legal`, {
        title,
        filingType,
        period: period || undefined,
        dueDate: new Date(dueDate).toISOString(),
        amount: amount ? String(amount).trim() : undefined,
        notes: notes || undefined
      });
      toast({ title: "Statutory compliance record added", variant: "success" });
      setModalOpen(false);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to save record";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleMarkFiled(id: string) {
    try {
      await apiClient.patch(`/tenants/${slug}/finance/taxes-legal/${id}`, {
        status: "FILED",
        paymentDate: new Date().toISOString()
      });
      toast({ title: "Marked as filed / completed", variant: "success" });
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to update status";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
          <Plus className="h-4 w-4" />
          Add Statutory Compliance
        </Button>
      </div>

      <Card className="rounded-2xl border border-border/80 shadow-sm">
        <CardContent className="p-0">
          {initialFilings.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No statutory compliance filings recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Filing / Obligation</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Statutory Fees</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialFilings.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell className="font-semibold text-xs">
                        {f.title}
                        {f.notes && <span className="text-[10px] text-muted-foreground block">{f.notes}</span>}
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline" className="text-[10px]">{f.filingType}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{f.period || "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(f.dueDate).toLocaleDateString("en-IN")}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        {f.amount ? `₹${parseFloat(f.amount).toLocaleString("en-IN")}` : "—"}
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge
                          variant={f.status === "FILED" ? "secondary" : "outline"}
                          className="text-[10px]"
                        >
                          {f.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {f.status !== "FILED" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMarkFiled(f.id)}
                            className="h-7 px-2 text-xs gap-1 text-emerald-600 hover:bg-emerald-50"
                          >
                            <Check className="h-3 w-3" />
                            Mark Filed
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle>Add Statutory Filing Tracker</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <FormField label="Filing Title" required>
              <Input
                placeholder="Enter filing title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Type" required>
                <Input value={filingType} onChange={(e) => setFilingType(e.target.value)}>
                </Input>
              </FormField>

              <FormField label="Due Date" required>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Period">
                <Input
                  placeholder="Enter period"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                />
              </FormField>

              <FormField label="Filing Fees / Tax (₹)">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </FormField>
            </div>

            <FormField label="Notes / Reference">
              <Textarea
                placeholder="Registration number, acknowledgment details..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </FormField>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {isSubmitting ? "Saving..." : "Save Record"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
