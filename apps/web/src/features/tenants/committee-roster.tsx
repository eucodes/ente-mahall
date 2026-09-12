"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
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
import type { CommitteePost } from "@/lib/committee";
import type { Member } from "@/lib/members";
import { CommitteePostFormDialog } from "./committee-post-form-dialog";

function formatDate(iso: string | null): string {
  return iso ? new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : "—";
}

export function CommitteeRoster({ slug, posts, members }: { slug: string; posts: CommitteePost[]; members: Member[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<CommitteePost | null>(null);
  const [removeTarget, setRemoveTarget] = useState<CommitteePost | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  function openAddForm() {
    setEditingPost(null);
    setFormOpen(true);
  }

  function openEditForm(post: CommitteePost) {
    setEditingPost(post);
    setFormOpen(true);
  }

  async function handleRemove() {
    if (!removeTarget) return;
    setIsRemoving(true);
    try {
      await apiClient.delete(`/tenants/${slug}/committee/members/${removeTarget.id}`);
      toast({ title: `Removed ${removeTarget.designation}`, variant: "success" });
      setRemoveTarget(null);
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't remove that post.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{posts.length} committee post{posts.length === 1 ? "" : "s"}</p>
        <Button onClick={openAddForm}>Add post</Button>
      </div>

      {posts.length === 0 ? (
        <EmptyState title="No committee posts yet" description="Add the first one above." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Designation</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Term</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Badge variant="secondary">{post.designation}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={post.member.fullName} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{post.member.fullName}</p>
                        <p className="truncate text-xs text-muted-foreground">{post.member.phone ?? "No phone on file"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {post.termStart || post.termEnd ? `${formatDate(post.termStart)} – ${formatDate(post.termEnd)}` : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditForm(post)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setRemoveTarget(post)}>
                        <Trash className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CommitteePostFormDialog slug={slug} open={formOpen} onOpenChange={setFormOpen} editingPost={editingPost} members={members} />

      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title={`Remove ${removeTarget?.designation ?? "this post"}?`}
        description="This removes the post from the roster. The member's own record is unaffected."
        confirmLabel="Remove"
        destructive
        isConfirming={isRemoving}
        onConfirm={handleRemove}
      />
    </div>
  );
}
