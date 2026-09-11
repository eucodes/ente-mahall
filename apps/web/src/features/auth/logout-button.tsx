"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, LogOut, useToast, type ButtonProps } from "@mahalle/ui";
import { apiClient } from "@/lib/api-client";

export interface LogoutButtonProps {
  redirectTo: string;
  /** Defaults to the admin/platform User logout — pass the member-scoped one on tenant sites. */
  endpoint?: string;
  variant?: ButtonProps["variant"];
  className?: string;
  /** Show a leading log-out icon — used in the sidebar profile card, off by default for the compact topbar button. */
  showIcon?: boolean;
}

export function LogoutButton({
  redirectTo,
  endpoint = "/auth/logout",
  variant = "outline",
  className,
  showIcon = false
}: LogoutButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await apiClient.post(endpoint);
    } catch {
      // Even if the API call fails, proceed with sending the user to the
      // login page — the access token cookie is short-lived either way.
    } finally {
      toast({ title: "Logged out" });
      router.push(redirectTo);
      router.refresh();
    }
  }

  return (
    <Button variant={variant} size="sm" className={className} isLoading={isLoggingOut} onClick={handleLogout}>
      {showIcon && <LogOut className="h-4 w-4" />}
      Log out
    </Button>
  );
}
