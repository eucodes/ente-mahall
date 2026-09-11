"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  ConfirmDialog,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Member } from "@/lib/members";
import type { Family } from "@/lib/business-resources";

interface MemberFormValues {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  familyId: string;
}

const EMPTY_FORM: MemberFormValues = { fullName: "", email: "", phone: "", address: "", familyId: "" };

function MemberFormDialog({
  slug,
  open,
  onOpenChange,
  editingMember,
  families
}: {
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingMember: Member | null;
  families: Family[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [values, setValues] = useState<MemberFormValues>(
    editingMember
      ? {
          fullName: editingMember.fullName,
          email: editingMember.email ?? "",
          phone: editingMember.phone ?? "",
          address: editingMember.address ?? "",
          familyId: editingMember.familyId ?? ""
        }
      : EMPTY_FORM
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const payload = {
      fullName: values.fullName,
      email: values.email || undefined,
      phone: values.phone || undefined,
      address: values.address || undefined,
      familyId: values.familyId || undefined
    };
    try {
      if (editingMember) {
        await apiClient.patch(`/tenants/${slug}/members/${editingMember.id}`, payload);
        toast({ title: "Member updated", variant: "success" });
      } else {
        await apiClient.post(`/tenants/${slug}/members`, payload);
        toast({ title: "Member added", variant: "success" });
      }
      onOpenChange(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingMember ? "Edit member" : "Add a member"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormField label="Full name" htmlFor="member-name" required error={error ?? undefined}>
            <Input
              id="member-name"
              required
              invalid={Boolean(error)}
              value={values.fullName}
              onChange={(e) => setValues((v) => ({ ...v, fullName: e.target.value }))}
            />
          </FormField>
          <FormField label="Email" htmlFor="member-email">
            <Input
              id="member-email"
              type="email"
              value={values.email}
              onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            />
          </FormField>
          <FormField label="Phone" htmlFor="member-phone">
            <Input
              id="member-phone"
              value={values.phone}
              onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
            />
          </FormField>
          <FormField label="Address" htmlFor="member-address">
            <Textarea
              id="member-address"
              value={values.address}
              onChange={(e) => setValues((v) => ({ ...v, address: e.target.value }))}
            />
          </FormField>
          <FormField label="Family" htmlFor="member-family" hint={families.length === 0 ? "No families yet — add one from the Families page." : undefined}>
            <Select
              id="member-family"
              value={values.familyId}
              onChange={(e) => setValues((v) => ({ ...v, familyId: e.target.value }))}
            >
              <option value="">No family</option>
              {families.map((family) => (
                <option key={family.id} value={family.id}>
                  {family.name}
                </option>
              ))}
            </Select>
          </FormField>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingMember ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function MembersTable({ slug, members, families }: { slug: string; members: Member[]; families: Family[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [removeTarget, setRemoveTarget] = useState<Member | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  function openAddForm() {
    setEditingMember(null);
    setFormOpen(true);
  }

  function openEditForm(member: Member) {
    setEditingMember(member);
    setFormOpen(true);
  }

  async function handleRemove() {
    if (!removeTarget) return;
    setIsRemoving(true);
    try {
      await apiClient.delete(`/tenants/${slug}/members/${removeTarget.id}`);
      toast({ title: `Removed ${removeTarget.fullName}`, variant: "success" });
      setRemoveTarget(null);
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't remove that member.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={openAddForm}>
          Add member
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Family</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">{member.fullName}</TableCell>
              <TableCell className="text-muted-foreground">{member.email ?? "—"}</TableCell>
              <TableCell className="text-muted-foreground">{member.phone ?? "—"}</TableCell>
              <TableCell className="text-muted-foreground">{member.family?.name ?? "—"}</TableCell>
              <TableCell className="flex justify-end gap-1 text-right">
                <Button variant="ghost" size="sm" onClick={() => openEditForm(member)}>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setRemoveTarget(member)}>
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <MemberFormDialog
        slug={slug}
        open={formOpen}
        onOpenChange={setFormOpen}
        editingMember={editingMember}
        families={families}
      />

      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title={`Remove ${removeTarget?.fullName ?? "this member"}?`}
        description="This removes them from the member directory. This action cannot be undone from here."
        confirmLabel="Remove"
        destructive
        isConfirming={isRemoving}
        onConfirm={handleRemove}
      />
    </div>
  );
}
