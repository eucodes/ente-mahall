"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, EmptyState, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { PlatformUserSession } from "@/lib/platform";

function isExpired(session: PlatformUserSession) {
  return new Date(session.expiresAt).getTime() < Date.now();
}

function RevokeSessionButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isRevoking, setIsRevoking] = useState(false);

  async function handleRevoke() {
    setIsRevoking(true);
    try {
      await apiClient.post(`/platform/sessions/${sessionId}/revoke`, {});
      toast({ title: "Session revoked", variant: "success" });
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong.";
      toast({ title: "Couldn't revoke session", description: message, variant: "destructive" });
    } finally {
      setIsRevoking(false);
    }
  }

  return (
    <Button size="sm" variant="outline" isLoading={isRevoking} onClick={handleRevoke}>
      Revoke
    </Button>
  );
}

export function UserSessionsTable({ sessions }: { sessions: PlatformUserSession[] }) {
  if (sessions.length === 0) {
    return <EmptyState title="No sessions on record" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Started</TableHead>
          <TableHead>IP address</TableHead>
          <TableHead>Device</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead>Status</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((session) => {
          const revoked = !!session.revokedAt;
          const expired = isExpired(session);
          return (
            <TableRow key={session.id}>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {new Date(session.createdAt).toLocaleString()}
              </TableCell>
              <TableCell className="text-muted-foreground">{session.ipAddress ?? "—"}</TableCell>
              <TableCell className="max-w-xs truncate text-muted-foreground">{session.userAgent ?? "—"}</TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {new Date(session.expiresAt).toLocaleString()}
              </TableCell>
              <TableCell>
                <Badge variant={revoked || expired ? "outline" : "success"}>
                  {revoked ? "Revoked" : expired ? "Expired" : "Active"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {!revoked && !expired && <RevokeSessionButton sessionId={session.id} />}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
