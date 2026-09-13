"use client";

import { useState } from "react";
import { Button, Pencil } from "@mahalle/ui";
import type { Family } from "@/lib/business-resources";
import type { House } from "@/lib/houses";
import { FamilyFormDialog } from "./family-form-dialog";

export function EditFamilyButton({
  slug,
  family,
  houses
}: {
  slug: string;
  family: Family;
  houses: House[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-1.5">
        <Pencil className="h-3.5 w-3.5" />
        Edit family
      </Button>
      <FamilyFormDialog
        slug={slug}
        open={open}
        onOpenChange={setOpen}
        editingFamily={family}
        houses={houses}
      />
    </>
  );
}
