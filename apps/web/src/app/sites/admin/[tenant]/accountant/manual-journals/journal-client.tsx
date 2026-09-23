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
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { JournalEntry, Account } from "@/lib/finance";

interface Props {
  slug: string;
  initialEntries: JournalEntry[];
  accounts: Account[];
}

interface LineState {
  accountId: string;
  debit: string;
  credit: string;
  description: string;
}

export function JournalClient({ slug, initialEntries, accounts }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Journal form state
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [lines, setLines] = useState<LineState[]>([
    { accountId: accounts[0]?.id || "", debit: "", credit: "", description: "" },
    { accountId: accounts[1]?.id || "", debit: "", credit: "", description: "" }
  ]);

  const totalDebit = lines.reduce((acc, l) => acc + (parseFloat(l.debit) || 0), 0);
  const totalCredit = lines.reduce((acc, l) => acc + (parseFloat(l.credit) || 0), 0);
  const isBalanced = totalDebit > 0 && Math.abs(totalDebit - totalCredit) < 0.01;

  function handleAddLine() {
    setLines([...lines, { accountId: accounts[0]?.id || "", debit: "", credit: "", description: "" }]);
  }

  function handleRemoveLine(index: number) {
    if (lines.length <= 2) return;
    setLines(lines.filter((_, i) => i !== index));
  }

  function updateLine(index: number, key: keyof LineState, val: string) {
    const next = [...lines];
    next[index] = { ...next[index], [key]: val };
    // Clear debit if credit is entered, and vice versa
    if (key === "debit" && parseFloat(val) > 0) {
      next[index].credit = "";
    } else if (key === "credit" && parseFloat(val) > 0) {
      next[index].debit = "";
    }
    setLines(next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isBalanced) {
      toast({ title: "Journal entries must balance (Debit = Credit)", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post(`/tenants/${slug}/finance/journal-entries`, {
        date: new Date(date).toISOString(),
        reference: reference || undefined,
        description,
        lines: lines
          .filter((l) => (parseFloat(l.debit) || 0) > 0 || (parseFloat(l.credit) || 0) > 0)
          .map((l) => ({
            accountId: l.accountId,
            debit: parseFloat(l.debit) || 0,
            credit: parseFloat(l.credit) || 0,
            description: l.description || undefined
          }))
      });
      toast({ title: "Journal entry posted successfully", variant: "success" });
      setModalOpen(false);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to post journal entry";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Double-entry bookkeeping journal entries with real-time balance enforcement.
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
          <Plus className="h-4 w-4" />
          New Journal Entry
        </Button>
      </div>

      <Card className="rounded-2xl border border-border/80 shadow-sm">
        <CardContent className="p-0">
          {initialEntries.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No journal entries recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entry #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Particulars</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-mono text-xs font-semibold">
                        {entry.entryNumber}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(entry.date).toLocaleDateString("en-IN")}
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="font-medium text-foreground">{entry.description}</div>
                        <div className="space-y-0.5 mt-1 text-[11px] text-muted-foreground">
                          {entry.lines?.map((l) => (
                            <div key={l.id} className="flex gap-2">
                              <span className="font-medium text-foreground">{l.account.name}:</span>
                              {parseFloat(l.debit) > 0 && <span className="text-emerald-600">Dr ₹{parseFloat(l.debit).toLocaleString("en-IN")}</span>}
                              {parseFloat(l.credit) > 0 && <span className="text-rose-600">Cr ₹{parseFloat(l.credit).toLocaleString("en-IN")}</span>}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline" className="text-[10px]">
                          {entry.sourceType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono font-semibold">
                        ₹{parseFloat(entry.totalDebit).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono font-semibold">
                        ₹{parseFloat(entry.totalCredit).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="secondary" className="text-[10px]">
                          {entry.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Journal Entry Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle>Create Journal Entry (Manual Voucher)</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Date" required>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Reference / Cheque #">
                <Input
                  placeholder="e.g. JV-001"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                />
              </FormField>
            </div>

            <FormField label="Narration / Description" required>
              <Input
                placeholder="Description of journal entry..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </FormField>

            {/* Lines */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">Journal Lines</span>
                <Button type="button" size="sm" variant="outline" onClick={handleAddLine} className="h-7 text-xs">
                  + Add Line
                </Button>
              </div>

              <div className="space-y-2">
                {lines.map((line, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-1/2">
                      <Select
                        value={line.accountId}
                        onChange={(e) => updateLine(idx, "accountId", e.target.value)}
                        required
                      >
                        {accounts.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name} ({a.type})
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="w-1/4">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Debit (₹)"
                        value={line.debit}
                        onChange={(e) => updateLine(idx, "debit", e.target.value)}
                      />
                    </div>
                    <div className="w-1/4">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Credit (₹)"
                        value={line.credit}
                        onChange={(e) => updateLine(idx, "credit", e.target.value)}
                      />
                    </div>
                    {lines.length > 2 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveLine(idx)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Total & Balance Indicator */}
              <div className="p-3 bg-muted/40 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  {isBalanced ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <CheckCircle2 className="h-4 w-4" />
                      Balanced Entry
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-600 font-semibold">
                      <AlertCircle className="h-4 w-4" />
                      Difference: ₹{Math.abs(totalDebit - totalCredit).toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="space-x-4 font-mono">
                  <span>Total Dr: <strong>₹{totalDebit.toFixed(2)}</strong></span>
                  <span>Total Cr: <strong>₹{totalCredit.toFixed(2)}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isBalanced || isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isSubmitting ? "Posting..." : "Post Entry"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
