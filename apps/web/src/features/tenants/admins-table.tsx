"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  ConfirmDialog,
  FormField,
  Input,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToast
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { AdminMember } from "@/lib/admins";
import type { RoleSummary } from "@/lib/roles";

export function AdminsTable({
  slug,
  admins,
  roles,
  currentUserId
}: {
  slug: string;
  admins: AdminMember[];
  roles: RoleSummary[];
  currentUserId: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [removeTarget, setRemoveTarget] = useState<AdminMember | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  async function handleRoleChange(admin: AdminMember, roleKey: string) {
    try {
      await apiClient.patch(`/tenants/${slug}/admins/${admin.id}`, { roleKey });
      toast({ title: `${admin.user.fullName} is now ${roleKey}`, variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't change that role.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    }
  }

  async function handleRemove() {
    if (!removeTarget) return;
    setIsRemoving(true);
    try {
      await apiClient.delete(`/tenants/${slug}/admins/${removeTarget.id}`);
      toast({ title: `Removed ${removeTarget.user.fullName}`, variant: "success" });
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
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => {
            const isSelf = admin.user.id === currentUserId;
            // The admin's current role might be inactive or missing from the
            // assignable list (e.g. a deactivated custom role) — always
            // include it as an option so the select never silently drops it.
            const options = roles.some((r) => r.key === admin.role.key)
              ? roles
              : [{ id: admin.role.key, key: admin.role.key, name: admin.role.name } as RoleSummary, ...roles];
            return (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">
                  {admin.user.fullName}
                  {isSelf && <span className="ml-1.5 text-xs text-muted-foreground">(you)</span>}
                </TableCell>
                <TableCell className="text-muted-foreground">{admin.user.email}</TableCell>
                <TableCell>
                  <Select
                    aria-label={`Role for ${admin.user.fullName}`}
                    value={admin.role.key}
                    disabled={isSelf}
                    onChange={(e) => handleRoleChange(admin, e.target.value)}
                    className="h-8 w-44"
                  >
                    {options.map((role) => (
                      <option key={role.key} value={role.key}>
                        {role.name}
                      </option>
                    ))}
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isSelf}
                    onClick={() => setRemoveTarget(admin)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title={`Remove ${removeTarget?.user.fullName ?? "this member"}?`}
        description="They'll lose all access to this Mahalle immediately. This can be undone by adding them back."
        confirmLabel="Remove"
        destructive
        isConfirming={isRemoving}
        onConfirm={handleRemove}
      />
    </>
  );
}

export function AddAdminForm({ slug, roles }: { slug: string; roles: RoleSummary[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [roleKey, setRoleKey] = useState<string>(roles.find((r) => r.key === "STAFF")?.key ?? roles[0]?.key ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await apiClient.post(`/tenants/${slug}/admins`, { email, roleKey });
      toast({ title: "Administrator added", variant: "success" });
      setEmail("");
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't add that person.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <FormField label="Email" htmlFor="add-admin-email" className="flex-1" error={error ?? undefined}>
        <Input
          id="add-admin-email"
          type="email"
          required
          placeholder="person@example.com"
          invalid={Boolean(error)}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>
      <FormField label="Role" htmlFor="add-admin-role">
        <Select id="add-admin-role" value={roleKey} onChange={(e) => setRoleKey(e.target.value)} className="w-44">
          {roles.map((role) => (
            <option key={role.key} value={role.key}>
              {role.name}
            </option>
          ))}
        </Select>
      </FormField>
      <Button type="submit" isLoading={isSubmitting}>
        Add
      </Button>
    </form>
  );
}
