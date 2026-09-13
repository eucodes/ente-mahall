"use client";

import type { FormEvent } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  FormField,
  Input,
  Mail,
  PasswordInput,
  PasswordStrengthMeter,
  Phone,
  User
} from "@mahalle/ui";
import type { AccountData } from "../types";

export interface AccountStepProps {
  value: AccountData;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
  error: string | null;
  isSubmitting: boolean;
  onChange: (patch: Partial<AccountData>) => void;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (confirmPassword: string) => void;
  onAgreedToTermsChange: (agreed: boolean) => void;
  onSubmit: (event: FormEvent) => void;
}

export function AccountStep({
  value,
  password,
  confirmPassword,
  agreedToTerms,
  error,
  isSubmitting,
  onChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onAgreedToTermsChange,
  onSubmit
}: AccountStepProps) {
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <Card className="overflow-hidden border-border/80 shadow-md">
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500" />
      <CardHeader className="space-y-2 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">Create Administrator Account</CardTitle>
            <CardDescription className="text-sm">
              Set up your primary administrator credentials to manage your Mahallu.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Full Name" htmlFor="onboarding-fullname" required className="sm:col-span-2">
              <Input
                id="onboarding-fullname"
                name="name"
                autoComplete="name"
                autoFocus
                required
                leadingIcon={<User />}
                placeholder="e.g. Muhammed Shareef"
                value={value.fullName}
                onChange={(e) => onChange({ fullName: e.target.value })}
              />
            </FormField>

            <FormField label="Email Address" htmlFor="onboarding-email" required>
              <Input
                id="onboarding-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                leadingIcon={<Mail />}
                placeholder="admin@mahallu.org"
                value={value.email}
                onChange={(e) => onChange({ email: e.target.value })}
              />
            </FormField>

            <FormField label="Phone Number" htmlFor="onboarding-phone" hint="Optional">
              <Input
                id="onboarding-phone"
                type="tel"
                autoComplete="tel"
                leadingIcon={<Phone />}
                placeholder="+91 98765 43210"
                value={value.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
              />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Password"
              htmlFor="onboarding-password"
              required
              hint={!password ? "Min. 10 chars with uppercase & number" : undefined}
            >
              <div className="space-y-2">
                <PasswordInput
                  id="onboarding-password"
                  name="new-password"
                  autoComplete="new-password"
                  required
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                />
                <PasswordStrengthMeter value={password} />
              </div>
            </FormField>

            <FormField
              label="Confirm Password"
              htmlFor="onboarding-confirm-password"
              required
              error={passwordsMismatch ? "Passwords do not match." : undefined}
            >
              <PasswordInput
                id="onboarding-confirm-password"
                name="confirm-password"
                autoComplete="new-password"
                required
                invalid={passwordsMismatch}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => onConfirmPasswordChange(e.target.value)}
              />
            </FormField>
          </div>

          <div className="rounded-xl border border-border/70 bg-muted/40 p-3.5">
            <label htmlFor="onboarding-terms" className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                id="onboarding-terms"
                checked={agreedToTerms}
                onChange={(e) => onAgreedToTermsChange(e.target.checked)}
                className="mt-0.5"
              />
              <span className="text-xs text-muted-foreground leading-relaxed">
                I agree to the{" "}
                <a href="/terms" className="font-semibold text-primary underline-offset-4 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="font-semibold text-primary underline-offset-4 hover:underline">
                  Privacy Policy
                </a>
                .
              </span>
            </label>
          </div>

          {error && (
            <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full text-sm font-semibold shadow-xs" size="lg" isLoading={isSubmitting}>
            Continue to Mahallu Setup
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
              Log in instead
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
