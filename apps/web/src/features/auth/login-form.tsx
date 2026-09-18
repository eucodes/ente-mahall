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
  loginfield?: "primary" | "destructive"
}

export function LoginForm({
  redirectTo,
  defaultEmail = "",
  defaultPassword = "",
  inactivityNotice = false,
  sessionExpiredNotice = false,
  loginfield = "primary"

}: LoginFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!email.includes("@") || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await apiClient.post<{ user: User }>("/auth/login", { email, password });
      toast({ title: "Welcome back", variant: "success" });
      if (typeof window !== "undefined") {
        window.location.href = redirectTo || "/";
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      const backendErrors: typeof errors = {};
      const lower = message.toLowerCase();

      if (
        lower.includes("invalid email or password") ||
        lower.includes("invalid credentials") ||
        lower.includes("unauthorized") ||
        lower.includes("user not found") ||
        lower.includes("inactive")
      ) {
        backendErrors.general = message;
      } else if (lower.includes("email")) {
        backendErrors.email = message;
      } else if (lower.includes("password")) {
        backendErrors.password = message;
      } else {
        backendErrors.general = message;
      }
      setErrors(backendErrors);
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

      {errors.general && (
        <Alert variant="destructive" className="py-2.5 px-3">
          <AlertDescription className="text-xs">{errors.general}</AlertDescription>
        </Alert>
      )}

      <FormField label="Email" htmlFor="login-email" required error={errors.email}>
        <Input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
          required
          invalid={Boolean(errors.email || errors.general)}
          leadingIcon={<Mail />}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email || errors.general) {
              setErrors((prev) => ({ ...prev, email: undefined, general: undefined }));
            }
          }}
        />
      </FormField>
      <FormField label="Password" htmlFor="login-password" required error={errors.password}>
        <PasswordInput
          id="login-password"
          name="password"
          autoComplete="current-password"
          required
          invalid={Boolean(errors.password || errors.general)}
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password || errors.general) {
              setErrors((prev) => ({ ...prev, password: undefined, general: undefined }));
            }
          }}
        />
      </FormField>
      <Button
        type="submit"
        variant={loginfield}
        className="w-full"
        size="lg"
        isLoading={isSubmitting}
      >
        Log in
      </Button>
    </form>
  );
}
