"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Pencil,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Trash,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { House } from "@/lib/houses";
import type { Division } from "@/lib/structure";
import { HouseFormDialog } from "./house-form-dialog";

export interface HousesRegistryProps {
  slug: string;
  houses: House[];
  divisions: Division[];
}

export function HousesRegistry({ slug, houses, divisions }: HousesRegistryProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingHouse, setEditingHouse] = useState<House | null>(null);
  const [removeTarget, setRemoveTarget] = useState<House | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  function openAddForm() {
    setEditingHouse(null);
    setFormOpen(true);
  }

  function openEditForm(house: House) {
    setEditingHouse(house);
    setFormOpen(true);
  }

  async function handleRemove() {
    if (!removeTarget) return;
    setIsRemoving(true);
    try {
      await apiClient.delete(`/tenants/${slug}/houses/${removeTarget.id}`);
      toast({ title: `Removed house ${removeTarget.displayNumber}`, variant: "success" });
      setRemoveTarget(null);
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't remove that house.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openAddForm}>Add house</Button>
      </div>

      {houses.length === 0 ? (
        <Card className="p-0">
          <EmptyState title="No houses yet" description="Add the first house above." />
        </Card>
      ) : (
        <Card className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>House number</TableHead>
                <TableHead>Division</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {houses.map((house) => (
                <TableRow key={house.id}>
                  <TableCell className="font-medium">{house.displayNumber}</TableCell>
                  <TableCell className="text-muted-foreground">{house.division?.name ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{house.address ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditForm(house)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setRemoveTarget(house)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <HouseFormDialog slug={slug} open={formOpen} onOpenChange={setFormOpen} editingHouse={editingHouse} divisions={divisions} />

      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title={`Remove house ${removeTarget?.displayNumber ?? ""}?`}
        description="This action cannot be undone from here."
        confirmLabel="Remove"
        destructive
        isConfirming={isRemoving}
        onConfirm={handleRemove}
      />
    </div>
  );
}
