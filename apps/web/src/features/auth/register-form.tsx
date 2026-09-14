"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, FormField, Input, Mail, PasswordInput, PasswordStrengthMeter, User, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import type { User as UserModel } from "@mahalle/types";

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
      await apiClient.post<{ user: UserModel }>("/auth/register", { email, password, fullName });
      toast({ title: "Account created", description: "Welcome to Mahalle.", variant: "success" });
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
      <FormField label="Full name" htmlFor="register-name" required>
        <Input
          id="register-name"
          name="name"
          autoComplete="name"
          autoFocus
          required
          leadingIcon={<User />}
          placeholder="Aisha Rahman"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </FormField>
      <FormField label="Email" htmlFor="register-email" required>
        <Input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          leadingIcon={<Mail />}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>
      <FormField
        label="Password"
        htmlFor="register-password"
        required
        hint={!password ? "At least 10 characters, with an uppercase letter, a lowercase letter, and a number." : undefined}
        error={error ?? undefined}
      >
        <div className="space-y-2">
          <PasswordInput
            id="register-password"
            name="password"
            autoComplete="new-password"
            required
            invalid={Boolean(error)}
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordStrengthMeter value={password} />
        </div>
      </FormField>
      <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
        Create account
      </Button>
    </form>
  );
}
