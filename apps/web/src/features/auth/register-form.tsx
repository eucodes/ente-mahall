"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, FormField, Input, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { User } from "@mahalle/types";

export interface RegisterFormProps {
  redirectTo: string;
}

export function RegisterForm({ redirectTo }: RegisterFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await apiClient.post<{ user: User }>("/auth/register", { email, password, fullName });
      toast({ title: "Account created", description: "Welcome to Mahalle.", variant: "success" });
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormField label="Full name" htmlFor="register-name" required>
        <Input id="register-name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </FormField>
      <FormField label="Email" htmlFor="register-email" required>
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>
      <FormField
        label="Password"
        htmlFor="register-password"
        required
        hint="At least 10 characters, with an uppercase letter, a lowercase letter, and a number."
        error={error ?? undefined}
      >
        <Input
          id="register-password"
          type="password"
          autoComplete="new-password"
          required
          invalid={Boolean(error)}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormField>
      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Create account
      </Button>
    </form>
  );
}
