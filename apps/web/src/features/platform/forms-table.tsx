"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge, Button, EmptyState, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@mahalle/ui";
import type { FormTemplateSummary } from "@/lib/forms";
import { CreateFormDialog } from "./create-form-dialog";

export function FormsTable({ forms }: { forms: FormTemplateSummary[] }) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          New form
        </Button>
      </div>

      {forms.length === 0 ? (
        <EmptyState title="No forms yet" />
      ) : (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Assignment</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {forms.map((form) => (
            <TableRow key={form.id}>
              <TableCell className="font-medium">{form.name}</TableCell>
              <TableCell className="text-muted-foreground">{form.key}</TableCell>
              <TableCell className="text-muted-foreground">{form.category ?? "—"}</TableCell>
              <TableCell>
                {form.latestVersion ? (
                  <Badge variant={form.latestVersion.status === "PUBLISHED" ? "success" : "outline"}>
                    v{form.latestVersion.version} · {form.latestVersion.status === "PUBLISHED" ? "Published" : "Draft"}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {form.isPlatformWide ? "Platform-wide" : `${form.assignedTenantCount} Mahalle${form.assignedTenantCount === 1 ? "" : "s"}`}
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/forms/${form.id}`} className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                  Open
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      )}

      <CreateFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
