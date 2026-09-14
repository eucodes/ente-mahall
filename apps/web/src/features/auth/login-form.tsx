"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle, Button, Clock, FormField, Input, Mail, PasswordInput, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { User } from "@mahalle/types";

export interface LoginFormProps {
  /** Where to send the user after a successful login. */
  redirectTo: string;
  defaultEmail?: string;
  defaultPassword?: string;
  /** Whether the user was automatically logged out due to inactivity. */
  inactivityNotice?: boolean;
  /** Whether the user's session expired. */
  sessionExpiredNotice?: boolean;
}

export function LoginForm({
  redirectTo,
  defaultEmail = "",
  defaultPassword = "",
  inactivityNotice = false,
  sessionExpiredNotice = false
}: LoginFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await apiClient.post<{ user: User }>("/auth/login", { email, password });
      toast({ title: "Welcome back", variant: "success" });
      if (typeof window !== "undefined") {
        window.location.href = redirectTo || "/";
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {inactivityNotice && (
        <Alert variant="warning" className="flex items-start gap-3">
          <Clock className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <AlertTitle className="font-semibold">Session Expired</AlertTitle>
            <AlertDescription>
              You were automatically logged out due to inactivity. Please log in again to continue.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {sessionExpiredNotice && !inactivityNotice && (
        <Alert variant="warning" className="flex items-start gap-3">
          <Clock className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <AlertTitle className="font-semibold">Session Expired</AlertTitle>
            <AlertDescription>
              Your session has expired. Please log in again to continue.
            </AlertDescription>
          </div>
        </Alert>
      )}
      <FormField label="Email" htmlFor="login-email" required>
        <Input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
          required
          leadingIcon={<Mail />}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>
      <FormField label="Password" htmlFor="login-password" required error={error ?? undefined}>
        <PasswordInput
          id="login-password"
          name="password"
          autoComplete="current-password"
          required
          invalid={Boolean(error)}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormField>
      <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
        Log in
      </Button>
    </form>
  );
}
