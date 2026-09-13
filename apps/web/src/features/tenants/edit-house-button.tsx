"use client";

import { useState } from "react";
import { Button, Pencil } from "@mahalle/ui";
import type { House } from "@/lib/houses";
import type { Division } from "@/lib/structure";
import { HouseFormDialog } from "./house-form-dialog";

export function EditHouseButton({
  slug,
  house,
  divisions
}: {
  slug: string;
  house: House;
  divisions: Division[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-1.5">
        <Pencil className="h-3.5 w-3.5" />
        Edit house
      </Button>
      <HouseFormDialog
        slug={slug}
        open={open}
        onOpenChange={setOpen}
        editingHouse={house}
        divisions={divisions}
      />
    </>
  );
}
