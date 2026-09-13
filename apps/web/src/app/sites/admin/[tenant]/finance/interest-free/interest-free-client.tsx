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
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { InterestFreeAccount } from "@/lib/finance";

interface Props {
  slug: string;
  initialAccounts: InterestFreeAccount[];
  members: any[];
  families: any[];
}

export function InterestFreeClient({ slug, initialAccounts, members, families }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<InterestFreeAccount | null>(null);
  const [txType, setTxType] = useState<"DEPOSIT" | "WITHDRAWAL">("DEPOSIT");
  const [txAmount, setTxAmount] = useState("");
  const [txDesc, setTxDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Account State
  const [holderName, setHolderName] = useState("");
  const [holderType, setHolderType] = useState<"MEMBER" | "FAMILY" | "INDIVIDUAL">("MEMBER");
  const [memberId, setMemberId] = useState("");
  const [familyId, setFamilyId] = useState("");
  const [phone, setPhone] = useState("");

  const totalDeposits = initialAccounts.reduce((acc, a) => acc + parseFloat(a.balance || "0"), 0);

  function openTxModal(account: InterestFreeAccount, type: "DEPOSIT" | "WITHDRAWAL") {
    setSelectedAccount(account);
    setTxType(type);
    setTxAmount("");
    setTxDesc("");
    setTxModalOpen(true);
  }

  async function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault();
    if (!holderName) {
      toast({ title: "Please enter account holder name", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post(`/tenants/${slug}/finance/interest-free/accounts`, {
        holderName,
        holderType,
        memberId: memberId || undefined,
        familyId: familyId || undefined,
        phone: phone || undefined
      });
      toast({ title: "Qard Hasan account opened successfully", variant: "success" });
      setCreateModalOpen(false);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to create account";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePostTransaction(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAccount || !txAmount || parseFloat(txAmount) <= 0) {
      toast({ title: "Please enter valid transaction amount", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = txType === "DEPOSIT" ? "deposit" : "withdraw";
      await apiClient.post(`/tenants/${slug}/finance/interest-free/accounts/${selectedAccount.id}/${endpoint}`, {
        amount: parseFloat(txAmount),
        description: txDesc || undefined
      });
      toast({ title: `Transaction processed: ${txType}`, variant: "success" });
      setTxModalOpen(false);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Transaction failed";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl p-3 bg-emerald-500/10 text-emerald-600">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-semibold">Total Funds in Trust</div>
            <div className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
              ₹{totalDeposits.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <Button onClick={() => setCreateModalOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
          <Plus className="h-4 w-4" />
          Open Account
        </Button>
      </div>

      <Card className="rounded-2xl border border-border/80 shadow-sm">
        <CardContent className="p-0">
          {initialAccounts.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No Qard Hasan interest-free banking accounts opened yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account #</TableHead>
                    <TableHead>Holder Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialAccounts.map((acc) => (
                    <TableRow key={acc.id}>
                      <TableCell className="font-mono text-xs font-semibold">
                        {acc.accountNumber}
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {acc.holderName}
                        {acc.family && <span className="text-[10px] text-muted-foreground block">Family: {acc.family.name}</span>}
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline" className="text-[10px]">{acc.holderType}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{acc.phone || "—"}</TableCell>
                      <TableCell className="text-right text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        ₹{parseFloat(acc.balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openTxModal(acc, "DEPOSIT")}
                            className="h-7 px-2 text-xs gap-1 border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                          >
                            <ArrowDownLeft className="h-3 w-3" />
                            Deposit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openTxModal(acc, "WITHDRAWAL")}
                            className="h-7 px-2 text-xs gap-1 border-rose-500 text-rose-700 hover:bg-rose-50"
                          >
                            <ArrowUpRight className="h-3 w-3" />
                            Withdraw
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Open Account Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle>Open Interest-Free Banking Account</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateAccount} className="space-y-4 pt-2">
            <FormField label="Holder Type" required>
              <Select value={holderType} onChange={(e) => setHolderType(e.target.value as any)}>
                <option value="MEMBER">Mahall Member</option>
                <option value="FAMILY">Family</option>
                <option value="INDIVIDUAL">External Individual</option>
              </Select>
            </FormField>

            {holderType === "MEMBER" && (
              <FormField label="Link Member">
                <Select
                  value={memberId}
                  onChange={(e) => {
                    setMemberId(e.target.value);
                    const m = members.find((x) => x.id === e.target.value);
                    if (m) {
                      setHolderName(m.fullName);
                      if (m.phone) setPhone(m.phone);
                    }
                  }}
                >
                  <option value="">Select Member...</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName}
                    </option>
                  ))}
                </Select>
              </FormField>
            )}

            <FormField label="Account Holder Name" required>
              <Input
                placeholder="Full Name"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Phone Number">
              <Input
                placeholder="e.g. 9847000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </FormField>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {isSubmitting ? "Opening..." : "Open Account"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Transaction Modal */}
      <Dialog open={txModalOpen} onOpenChange={setTxModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle>
              {txType === "DEPOSIT" ? "Deposit to" : "Withdraw from"} {selectedAccount?.holderName}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePostTransaction} className="space-y-4 pt-2">
            <div className="p-3 bg-muted/40 rounded-xl text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account #:</span>
                <span className="font-mono font-bold">{selectedAccount?.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Balance:</span>
                <span className="font-mono font-bold text-emerald-700">
                  ₹{parseFloat(selectedAccount?.balance || "0").toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <FormField label="Amount (₹)" required>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={txAmount}
                onChange={(e) => setTxAmount(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Description / Narration">
              <Textarea
                placeholder="Reason or reference..."
                value={txDesc}
                onChange={(e) => setTxDesc(e.target.value)}
                rows={2}
              />
            </FormField>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setTxModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={txType === "DEPOSIT" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-rose-600 hover:bg-rose-700 text-white"}
              >
                {isSubmitting ? "Processing..." : `Confirm ${txType}`}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
