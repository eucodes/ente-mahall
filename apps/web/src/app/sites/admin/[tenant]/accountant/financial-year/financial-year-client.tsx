"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  Button,
  Badge,
  Input,
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
  Lock,
  Unlock,
  Star,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { FinancialYear } from "@/lib/finance";

interface Props {
  slug: string;
  initialYears: FinancialYear[];
}

export function FinancialYearClient({ slug, initialYears }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !startDate || !endDate) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post(`/tenants/${slug}/finance/financial-years`, {
        name,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString()
      });
      toast({ title: "Financial year created successfully", variant: "success" });
      setModalOpen(false);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to create financial year";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAction(id: string, action: "close" | "reopen" | "set-current") {
    try {
      await apiClient.post(`/tenants/${slug}/finance/financial-years/${id}/${action}`, {});
      toast({ title: `Action completed: ${action}`, variant: "success" });
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : `Failed to execute ${action}`;
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Manage financial years lifecycle, accounting period closures, and active fiscal year.
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
          <Plus className="h-4 w-4" />
          Add Financial Year
        </Button>
      </div>

      <Card className="rounded-2xl border border-border/80 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year Title</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialYears.map((fy) => {
                const isClosed = fy.status === "CLOSED";
                return (
                  <TableRow key={fy.id}>
                    <TableCell className="font-semibold text-xs">{fy.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(fy.startDate).toLocaleDateString("en-IN")}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(fy.endDate).toLocaleDateString("en-IN")}
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge variant={isClosed ? "outline" : "secondary"} className="text-[10px]">
                        {isClosed ? "Closed / Locked" : "Open"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {fy.isCurrent && (
                        <Badge className="bg-emerald-600 text-[10px] text-white">Current FY</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {!fy.isCurrent && !isClosed && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAction(fy.id, "set-current")}
                            className="h-7 px-2 text-xs gap-1 text-emerald-600 hover:bg-emerald-50"
                          >
                            <Star className="h-3 w-3" />
                            Set Current
                          </Button>
                        )}
                        {!isClosed ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAction(fy.id, "close")}
                            className="h-7 px-2 text-xs gap-1 text-amber-600 hover:bg-amber-50"
                          >
                            <Lock className="h-3 w-3" />
                            Close FY
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAction(fy.id, "reopen")}
                            className="h-7 px-2 text-xs gap-1 text-blue-600 hover:bg-blue-50"
                          >
                            <Unlock className="h-3 w-3" />
                            Reopen
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle>New Financial Year</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <FormField label="Financial Year Name" required>
              <Input
                placeholder="e.g. FY 2027-28"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Start Date" required>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="End Date" required>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </FormField>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {isSubmitting ? "Creating..." : "Create Financial Year"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
