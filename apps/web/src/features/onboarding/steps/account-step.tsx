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
    <Card>
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>Set up your administrator account to get started with Mahallu.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <FormField label="Full Name" htmlFor="onboarding-fullname" required>
            <Input
              id="onboarding-fullname"
              autoComplete="name"
              autoFocus
              required
              leadingIcon={<User />}
              placeholder="Enter your full name"
              value={value.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
            />
          </FormField>
          <FormField label="Email Address" htmlFor="onboarding-email" required>
            <Input
              id="onboarding-email"
              type="email"
              autoComplete="email"
              required
              leadingIcon={<Mail />}
              placeholder="Enter your email address"
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
              placeholder="Enter your mobile number"
              value={value.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
            />
          </FormField>
          <FormField
            label="Password"
            htmlFor="onboarding-password"
            required
            hint={!password ? "At least 10 characters, with an uppercase letter, a lowercase letter, and a number." : undefined}
          >
            <div className="space-y-2">
              <PasswordInput
                id="onboarding-password"
                autoComplete="new-password"
                required
                placeholder="Create a password"
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
              autoComplete="new-password"
              required
              invalid={passwordsMismatch}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
            />
          </FormField>

          <label htmlFor="onboarding-terms" className="flex items-start gap-2.5 pt-1">
            <Checkbox
              id="onboarding-terms"
              checked={agreedToTerms}
              onChange={(e) => onAgreedToTermsChange(e.target.checked)}
              className="mt-0.5"
            />
            <span className="text-sm text-muted-foreground">
              I agree to the{" "}
              <a href="/terms" className="font-medium text-primary underline-offset-4 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="font-medium text-primary underline-offset-4 hover:underline">
                Privacy Policy
              </a>
              .
            </span>
          </label>

          {error && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
            Continue
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Log in
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
