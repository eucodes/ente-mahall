"use client";

import { Button, useToast } from "@mahalle/ui";

export function EditProfileButton() {
  const { toast } = useToast();

  return (
    <Button
      size="sm"
      variant="outline"
      className="rounded-xl text-xs font-semibold self-start sm:self-auto"
      onClick={() => toast({ title: "Coming soon", description: "Editing your own profile isn't available yet." })}
    >
      Edit Profile
    </Button>
  );
}
