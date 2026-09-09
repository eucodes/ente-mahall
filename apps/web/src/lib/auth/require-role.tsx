"use client";

import type { UserRole } from "@ente-mahall/contracts";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

/**
 * Client-side gate: redirects away if the persisted session doesn't have one
 * of `roles`. This is a UX convenience only — every API request the gated
 * page makes is still independently authorized by the NestJS guard reading
 * the JWT, which is the actual enforcement point.
 */
export function RequireRole({
  roles,
  redirectTo,
  children,
}: {
  roles: UserRole[];
  redirectTo: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user || !roles.includes(user.role)) {
      router.replace(redirectTo);
    }
  }, [user, roles, redirectTo, router]);

  if (!user || !roles.includes(user.role)) return null;
  return <>{children}</>;
}
