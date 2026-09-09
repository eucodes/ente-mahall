"use client";

import type { AuthTokens, SuperAdminLoginInput } from "@ente-mahall/contracts";
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/client";
import { useAuthStore } from "@/stores/auth-store";

export function useSuperAdminLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (input: SuperAdminLoginInput) =>
      apiFetch<AuthTokens>("/auth/super-admin/login", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: setSession,
  });
}
