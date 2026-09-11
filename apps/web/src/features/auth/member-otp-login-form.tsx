"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, FormField, Input, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";

export interface MemberOtpLoginFormProps {
  /** The Mahalle's slug, e.g. "demo" — every member-auth call is scoped to it. */
  tenantSlug: string;
  /** Where to send the member after a successful login. */
  redirectTo: string;
}

type Step = "phone" | "code";

export function MemberOtpLoginForm({ tenantSlug, redirectTo }: MemberOtpLoginFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRequestOtp(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await apiClient.post(`/tenants/${encodeURIComponent(tenantSlug)}/member-auth/otp/request`, { phone });
      toast({ title: "Code sent", description: "Enter the code sent to your phone." });
      setStep("code");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerifyOtp(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await apiClient.post(`/tenants/${encodeURIComponent(tenantSlug)}/member-auth/otp/verify`, { phone, code });
      toast({ title: "Welcome back", variant: "success" });
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === "phone") {
    return (
      <form onSubmit={handleRequestOtp} className="space-y-4" noValidate>
        <FormField
          label="Phone number"
          htmlFor="member-phone"
          required
          hint="We'll text you a 6-digit code."
          error={error ?? undefined}
        >
          <Input
            id="member-phone"
            type="tel"
            autoComplete="tel"
            autoFocus
            required
            invalid={Boolean(error)}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </FormField>
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Send code
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerifyOtp} className="space-y-4" noValidate>
      <FormField
        label="6-digit code"
        htmlFor="member-code"
        required
        hint={`Sent to ${phone}.`}
        error={error ?? undefined}
      >
        <Input
          id="member-code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          autoFocus
          required
          invalid={Boolean(error)}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        />
      </FormField>
      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Verify and log in
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isSubmitting}
        onClick={() => {
          setStep("phone");
          setCode("");
          setError(null);
        }}
      >
        Use a different phone number
      </Button>
    </form>
  );
}
