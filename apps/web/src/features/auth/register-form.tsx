"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, Button, FormField, Input, Mail, PasswordInput, PasswordStrengthMeter, User, useToast } from "@mahalle/ui";
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const confirmPasswordError = errors.confirmPassword || (passwordsMismatch ? "Passwords do not match." : undefined);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!email.includes("@") || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 10) {
      newErrors.password = "Password must be at least 10 characters.";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Password must include a lowercase letter.";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must include an uppercase letter.";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must include a number.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await apiClient.post<{ user: UserModel }>("/auth/register", { email, password, fullName });
      toast({ title: "Account created", description: "Welcome to Mahalle.", variant: "success" });
      if (typeof window !== "undefined") {
        window.location.href = redirectTo || "/";
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      const backendErrors: typeof errors = {};

      if (message.toLowerCase().includes("email")) {
        backendErrors.email = message;
      }
      if (message.toLowerCase().includes("password")) {
        backendErrors.password = message;
      }
      if (message.toLowerCase().includes("fullname") || message.toLowerCase().includes("full name")) {
        backendErrors.fullName = message;
      }
      if (Object.keys(backendErrors).length === 0) {
        backendErrors.general = message;
      }
      setErrors(backendErrors);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {errors.general && (
        <Alert variant="destructive" className="py-2.5 px-3">
          <AlertDescription className="text-xs">{errors.general}</AlertDescription>
        </Alert>
      )}

      <FormField label="Full name" htmlFor="register-name" required error={errors.fullName}>
        <Input
          id="register-name"
          name="name"
          autoComplete="name"
          autoFocus
          required
          invalid={Boolean(errors.fullName)}
          leadingIcon={<User />}
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (errors.fullName || errors.general) {
              setErrors((prev) => ({ ...prev, fullName: undefined, general: undefined }));
            }
          }}
        />
      </FormField>
      <FormField label="Email" htmlFor="register-email" required error={errors.email}>
        <Input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          invalid={Boolean(errors.email)}
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
      <FormField
        label="Password"
        htmlFor="register-password"
        required
        hint={!password ? "At least 10 characters, with uppercase, lowercase, and a number." : undefined}
        error={errors.password}
      >
        <div className="space-y-2">
          <PasswordInput
            id="register-password"
            name="password"
            autoComplete="new-password"
            required
            invalid={Boolean(errors.password)}
            placeholder="Create a password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password || errors.general) {
                setErrors((prev) => ({ ...prev, password: undefined, general: undefined }));
              }
            }}
          />
          <PasswordStrengthMeter value={password} />
        </div>
      </FormField>
      <FormField
        label="Confirm Password"
        htmlFor="confirm-password"
        required
        error={confirmPasswordError}
      >
        <PasswordInput
          id="confirm-password"
          name="confirm-password"
          autoComplete="new-password"
          required
          invalid={Boolean(confirmPasswordError)}
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword || errors.general) {
              setErrors((prev) => ({ ...prev, confirmPassword: undefined, general: undefined }));
            }
          }}
        />
      </FormField>
      <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
        Create account
      </Button>
    </form>
  );
}
