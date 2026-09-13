"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  ConfirmDialog,
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
import type { PlatformUser } from "@/lib/platform";
import { GrantPlatformAccessDialog } from "./grant-platform-access-dialog";

const ROLES = ["SUPER_ADMIN", "PLATFORM_STAFF", "PLATFORM_SUPPORT"] as const;

function RoleSelect({ membershipId, role }: { membershipId: string; role: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  async function handleChange(next: string) {
    setIsSaving(true);
    try {
      await apiClient.patch(`/platform/users/${membershipId}/role`, { role: next });
      toast({ title: "Role updated", variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong.";
      toast({ title: "Couldn't update role", description: message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Select
      value={role}
      disabled={isSaving}
      onChange={(e) => handleChange(e.target.value)}
      className="h-8 w-44 text-xs"
    >
      {ROLES.map((r) => (
        <option key={r} value={r}>
          {r}
        </option>
      ))}
    </Select>
  );
}

function RevokeButton({ membershipId, email }: { membershipId: string; email: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  async function handleRevoke() {
    setIsRevoking(true);
    try {
      await apiClient.delete(`/platform/users/${membershipId}`);
      toast({ title: "Platform access revoked", variant: "success" });
      setOpen(false);
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong.";
      toast({ title: "Couldn't revoke access", description: message, variant: "destructive" });
    } finally {
      setIsRevoking(false);
    }
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Revoke
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`Revoke platform access for ${email}?`}
        description="They'll immediately lose access to the control panel. This doesn't delete their account or affect their Mahalle memberships."
        confirmLabel="Revoke access"
        destructive
        isConfirming={isRevoking}
        onConfirm={handleRevoke}
      />
    </>
  );
}

export function PlatformUsersTable({ users }: { users: PlatformUser[] }) {
  const [grantOpen, setGrantOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setGrantOpen(true)}>
          Grant access
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Granted</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((membership) => (
            <TableRow key={membership.id}>
              <TableCell className="font-medium">{membership.user.fullName}</TableCell>
              <TableCell className="text-muted-foreground">{membership.user.email}</TableCell>
              <TableCell>
                {membership.isActive ? (
                  <RoleSelect membershipId={membership.id} role={membership.role} />
                ) : (
                  <Badge variant="outline">{membership.role}</Badge>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={membership.isActive ? "success" : "outline"}>
                  {membership.isActive ? "Active" : "Revoked"}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {new Date(membership.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/users/${membership.user.id}/sessions`}
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Sessions
                  </Link>
                  {membership.isActive && <RevokeButton membershipId={membership.id} email={membership.user.email} />}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <GrantPlatformAccessDialog open={grantOpen} onOpenChange={setGrantOpen} />
    </div>
  );
}
