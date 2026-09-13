"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Select,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Plus,
  Printer
} from "@mahalle/ui";
import { RecordCollectionModal } from "@/features/finance/record-collection-modal";
import { UniversalReceiptModal, type UniversalReceiptData } from "@/features/finance/universal-receipt-modal";
import type { FinanceCollection, CollectionCategory, FinancePaymentMethod } from "@/lib/finance";

interface Props {
  slug: string;
  mahalleName: string;
  initialCollections: FinanceCollection[];
  categories: CollectionCategory[];
  paymentMethods: FinancePaymentMethod[];
  families: any[];
  members: any[];
}

export function CollectionsClient({
  slug,
  mahalleName,
  initialCollections,
  categories,
  paymentMethods,
  families,
  members
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<UniversalReceiptData | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const filteredCollections = initialCollections.filter((c) => {
    if (typeFilter !== "ALL" && c.type !== typeFilter) return false;
    if (categoryFilter !== "ALL" && c.categoryId !== categoryFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const payer = (c.donorName || c.member?.fullName || c.family?.name || "").toLowerCase();
      const receiptNo = (c.receipt?.receiptNumber || "").toLowerCase();
      if (!payer.includes(term) && !receiptNo.includes(term)) return false;
    }
    return true;
  });

  const totalAmount = filteredCollections.reduce((acc, c) => acc + parseFloat(c.amount || "0"), 0);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search payer, receipt #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-40">
            <option value="ALL">All Types</option>
            <option value="FAMILY">Family</option>
            <option value="FRIDAY">Friday</option>
            <option value="DONATION">Donation</option>
            <option value="BOX">Hundi Box</option>
            <option value="OTHER">Other</option>
          </Select>
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-44">
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </div>

        <Button onClick={() => setModalOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
          <Plus className="h-4 w-4" />
          Record Collection
        </Button>
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
                    <TableHead>Date</TableHead>
                    <TableHead>Receipt #</TableHead>
                    <TableHead>Payer / Member</TableHead>
                    <TableHead>Category / Type</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCollections.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(c.date).toLocaleDateString("en-IN")}
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold">
                        {c.receipt?.receiptNumber || "—"}
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        <div>
                          {c.donorName || c.family?.name || c.member?.fullName || "Anonymous"}
                          {c.family && c.donorName && c.donorName !== c.family.name && (
                            <span className="text-[11px] text-muted-foreground block">
                              Family: {c.family.name}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline" className="text-[10px]">
                          {c.category?.name || c.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {c.paymentMethod || "Cash"}
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                        ₹{parseFloat(c.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">
                        {c.receipt ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewReceipt(c)}
                            className="h-7 px-2 text-xs gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          >
                            <Printer className="h-3 w-3" />
                            Receipt
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
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

      <RecordCollectionModal
        slug={slug}
        open={modalOpen}
        onOpenChange={setModalOpen}
        categories={categories}
        paymentMethods={paymentMethods}
        families={families}
        members={members}
        mahalleName={mahalleName}
      />

      <UniversalReceiptModal
        open={receiptModalOpen}
        onOpenChange={setReceiptModalOpen}
        receipt={activeReceipt}
      />
    </div>
  );
}
