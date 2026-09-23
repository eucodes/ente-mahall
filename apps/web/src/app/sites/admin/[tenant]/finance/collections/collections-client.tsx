"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Select,
  Checkbox,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Plus,
  Printer,
  Pencil,
  Trash2,
  Settings,
  MoreVertical,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import { RecordCollectionModal } from "@/features/finance/record-collection-modal";
import { EditCollectionModal } from "@/features/finance/edit-collection-modal";
import { UniversalReceiptModal, type UniversalReceiptData } from "@/features/finance/universal-receipt-modal";
import type { Account, FinanceCollection, CollectionCategory, FinancePaymentMethod } from "@/lib/finance";

interface Props {
  slug: string;
  mahalleName: string;
  initialCollections: FinanceCollection[];
  categories: CollectionCategory[];
  accounts?: Account[];
  paymentMethods: FinancePaymentMethod[];
  families: any[];
  members: any[];
}

export function CollectionsClient({
  slug,
  mahalleName,
  initialCollections,
  categories,
  accounts = [],
  paymentMethods,
  families,
  members
}: Props) {
  const router = useRouter();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<FinanceCollection | null>(null);

  const [activeReceipt, setActiveReceipt] = useState<UniversalReceiptData | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  // Single Delete state
  const [deleteTarget, setDeleteTarget] = useState<FinanceCollection | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Multi-Select & Bulk Delete state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [accountFilter, setAccountFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const incomeAccounts = accounts.filter((a) => a.type === "INCOME" || !a.type);

  const filteredCollections = initialCollections.filter((c) => {
    if (typeFilter !== "ALL" && c.type !== typeFilter) return false;
    if (categoryFilter !== "ALL" && c.categoryId !== categoryFilter) return false;
    if (accountFilter !== "ALL") {
      const cat = categories.find((catItem) => catItem.id === c.categoryId);
      if (cat?.incomeAccountId !== accountFilter) return false;
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const payer = (c.donorName || c.member?.fullName || c.family?.name || "").toLowerCase();
      const receiptNo = (c.receipt?.receiptNumber || "").toLowerCase();
      if (!payer.includes(term) && !receiptNo.includes(term)) return false;
    }
    return true;
  });

  const totalAmount = filteredCollections.reduce((acc, c) => acc + parseFloat(c.amount || "0"), 0);

  // Selection handlers
  const allSelected = filteredCollections.length > 0 && selectedIds.length === filteredCollections.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  function handleSelectAll(checked: boolean) {
    if (checked) {
      setSelectedIds(filteredCollections.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  }

  function handleToggleRow(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function handleViewReceipt(c: FinanceCollection) {
    if (!c.receipt) return;
    const catName = c.category?.name || c.type;
    setActiveReceipt({
      receiptNumber: c.receipt.receiptNumber,
      date: new Date(c.date).toLocaleDateString("en-IN"),
      payerName: c.donorName || c.family?.name || c.member?.fullName || "Anonymous Donor",
      payerPhone: c.donorPhone || c.member?.phone || undefined,
      familyDetails: c.family ? `${c.family.name}${c.family.familyNumber ? ` (#${c.family.familyNumber})` : ""}` : undefined,
      category: catName,
      title: catName,
      amount: String(c.amount),
      paymentMethod: c.paymentMethod,
      mahalleName,
      notes: c.notes || c.description
    });
    setReceiptModalOpen(true);
  }

  async function handleDeleteSingle() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/tenants/${slug}/finance/collections/${deleteTarget.id}`);
      toast({ title: "Collection deleted successfully", variant: "success" });
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      setDeleteTarget(null);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to delete collection";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleBulkDelete() {
    if (selectedIds.length === 0) return;
    setIsBulkDeleting(true);
    try {
      await apiClient.post(`/tenants/${slug}/finance/collections/bulk-delete`, { ids: selectedIds });
      toast({ title: `${selectedIds.length} collections deleted`, variant: "success" });
      setSelectedIds([]);
      setBulkDeleteOpen(false);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to bulk delete collections";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsBulkDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search payer, receipt #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-56 h-9 text-xs"
          />

          {/* Account / Fund Filter */}
          {incomeAccounts.length > 0 && (
            <Select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="w-44 h-9 text-xs"
            >
              <option value="ALL">All Accounts / Funds</option>
              {incomeAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </Select>
          )}

          {/* Category Filter */}
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-44 h-9 text-xs"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>

          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-36 h-9 text-xs"
          >
            <option value="ALL">All Types</option>
            <option value="FAMILY">Family</option>
            <option value="FRIDAY">Friday</option>
            <option value="DONATION">Donation</option>
            <option value="BOX">Hundi Box</option>
            <option value="OTHER">Other</option>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkDeleteOpen(true)}
              className="gap-1.5 rounded-xl text-xs h-9"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Selected ({selectedIds.length})
            </Button>
          )}

          {/* Quick Settings Button */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-xl text-xs h-9"
          >
            <Link href={`/${slug}/settings/finance`}>
              <Settings className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Settings</span>
            </Link>
          </Button>

          <Button
            onClick={() => setModalOpen(true)}
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold h-9"
          >
            <Plus className="h-4 w-4" />
            Record Collection
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl border border-border/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-semibold">
            Collections ({filteredCollections.length})
          </CardTitle>
          <div className="text-sm font-semibold font-mono text-emerald-700 dark:text-emerald-400">
            Total: ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredCollections.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No collections found matching the selected criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={allSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Receipt #</TableHead>
                    <TableHead>Payer / Member</TableHead>
                    <TableHead>Category / Fund</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCollections.map((c) => {
                    const isChecked = selectedIds.includes(c.id);
                    const matchedCat = categories.find((cat) => cat.id === c.categoryId);
                    const fundName = matchedCat?.incomeAccount?.name;

                    return (
                      <TableRow key={c.id} className={isChecked ? "bg-muted/40" : ""}>
                        <TableCell>
                          <Checkbox
                            checked={isChecked}
                            onChange={() => handleToggleRow(c.id)}
                          />
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(c.date).toLocaleDateString("en-IN")}
                        </TableCell>
                        <TableCell className="font-mono text-xs font-semibold">
                          {c.receipt?.receiptNumber || c.collectionNumber || "—"}
                        </TableCell>
                        <TableCell className="text-xs font-medium">
                          <div>
                            {c.donorName || c.family?.name || c.member?.fullName || "Anonymous"}
                            {c.family && c.donorName && c.donorName !== c.family.name && (
                              <span className="text-[10px] text-muted-foreground block">
                                Family: {c.family.name}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="flex flex-col gap-0.5">
                            <Badge variant="outline" className="text-[10px] w-fit">
                              {c.category?.name || c.type}
                            </Badge>
                            {fundName && (
                              <span className="text-[10px] text-muted-foreground">
                                Fund: {fundName}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {c.paymentMethod || "Cash"}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                          ₹{parseFloat(c.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {c.receipt && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                onClick={() => handleViewReceipt(c)}
                                title="View / Print Receipt"
                              >
                                <Printer className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                              onClick={() => {
                                setEditingCollection(c);
                                setEditModalOpen(true);
                              }}
                              title="Edit Collection"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                              onClick={() => setDeleteTarget(c)}
                              title="Delete Collection"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Record Collection Modal */}
      <RecordCollectionModal
        slug={slug}
        open={modalOpen}
        onOpenChange={setModalOpen}
        categories={categories}
        accounts={incomeAccounts}
        paymentMethods={paymentMethods}
        families={families}
        members={members}
        mahalleName={mahalleName}
      />

      {/* Edit Collection Modal */}
      <EditCollectionModal
        slug={slug}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        collection={editingCollection}
        categories={categories}
        accounts={incomeAccounts}
        paymentMethods={paymentMethods}
        families={families}
        members={members}
      />

      {/* Universal Receipt Modal */}
      <UniversalReceiptModal
        open={receiptModalOpen}
        onOpenChange={setReceiptModalOpen}
        receipt={activeReceipt}
      />

      {/* Single Delete Confirmation Dialog */}
      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Delete Collection Record
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-sm text-muted-foreground">
            <p>
              Are you sure you want to delete receipt <strong>{deleteTarget?.receipt?.receiptNumber || deleteTarget?.collectionNumber}</strong>?
            </p>
            {deleteTarget && (
              <div className="rounded-xl bg-muted/40 p-3 text-xs space-y-1">
                <div><strong>Amount:</strong> ₹{parseFloat(deleteTarget.amount).toLocaleString("en-IN")}</div>
                <div><strong>Payer:</strong> {deleteTarget.donorName || deleteTarget.family?.name || deleteTarget.member?.fullName || "Anonymous"}</div>
                <div><strong>Date:</strong> {new Date(deleteTarget.date).toLocaleDateString("en-IN")}</div>
              </div>
            )}
            <p className="text-xs text-rose-600 dark:text-rose-400">
              This will automatically reverse the linked ledger entry and delete the associated receipt.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDeleteSingle}
            >
              {isDeleting ? "Deleting..." : "Delete Permanently"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Bulk Delete Collections
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-sm text-muted-foreground">
            <p>
              Are you sure you want to permanently delete <strong>{selectedIds.length}</strong> selected collection records?
            </p>
            <p className="text-xs text-rose-600 dark:text-rose-400">
              All linked receipts and accounting ledger entries for these collections will be reversed and permanently deleted. This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
            <Button variant="outline" onClick={() => setBulkDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isBulkDeleting}
              onClick={handleBulkDelete}
            >
              {isBulkDeleting ? "Deleting..." : `Delete ${selectedIds.length} Records`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
