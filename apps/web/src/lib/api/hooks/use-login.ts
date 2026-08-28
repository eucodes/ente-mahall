"use client";

import type { AuthTokens, LoginInput } from "@ente-mahall/shared-types";
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/client";

export function useLogin() {
  return useMutation({
    mutationFn: (input: LoginInput) =>
      apiFetch<AuthTokens>("/auth/login", {
        method: "POST",
        body: JSON.stringify(input),
      }),
  });
}
