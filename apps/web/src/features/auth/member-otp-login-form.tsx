"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle, Button, Clock, FormField, Input, Phone, useToast } from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";

export interface MemberOtpLoginFormProps {
  /** The Mahalle's slug, e.g. "demo" — every member-auth call is scoped to it. */
  tenantSlug: string;
  /** Where to send the member after a successful login. */
  redirectTo: string;
  /** Whether the user was automatically logged out due to inactivity. */
  inactivityNotice?: boolean;
  /** Whether the user's session expired. */
  sessionExpiredNotice?: boolean;
}

type Step = "phone" | "code";

const RESEND_COOLDOWN_SECONDS = 30;

export function MemberOtpLoginForm({
  tenantSlug,
  redirectTo,
  inactivityNotice = false,
  sessionExpiredNotice = false
}: MemberOtpLoginFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function requestOtp() {
    setError(null);
    setIsSubmitting(true);
    try {
      await apiClient.post(`/tenants/${encodeURIComponent(tenantSlug)}/member-auth/otp/request`, { phone });
      toast({ title: "Code sent", description: "Enter the code sent to your phone." });
      setStep("code");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRequestOtp(event: FormEvent) {
    event.preventDefault();
    await requestOtp();
  }

  async function handleVerifyOtp(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await apiClient.post(`/tenants/${encodeURIComponent(tenantSlug)}/member-auth/otp/verify`, { phone, code });
      toast({ title: "Welcome back", variant: "success" });
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const queryReturnTo = urlParams.get("returnTo") || urlParams.get("redirect");
        const target =
          queryReturnTo && queryReturnTo.startsWith("/") && !queryReturnTo.startsWith("//") && !queryReturnTo.startsWith("/\\")
            ? queryReturnTo
            : redirectTo || "/";
        window.location.href = target;
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const notices = (
    <>
      {inactivityNotice && (
        <Alert variant="warning" className="flex items-start gap-3 mb-4">
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
        <Alert variant="warning" className="flex items-start gap-3 mb-4">
          <Clock className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <AlertTitle className="font-semibold">Session Expired</AlertTitle>
            <AlertDescription>
              Your session has expired. Please log in again to continue.
            </AlertDescription>
          </div>
        </Alert>
      )}
    </>
  );

  if (step === "phone") {
    return (
      <form onSubmit={handleRequestOtp} className="space-y-4" noValidate>
        {notices}
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
            leadingIcon={<Phone />}
            placeholder="+91 98765 43210"
            invalid={Boolean(error)}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </FormField>
        <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
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
          className="text-center text-lg font-semibold tracking-[0.5em]"
          placeholder="000000"
          invalid={Boolean(error)}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        />
      </FormField>
      <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
        Verify and log in
      </Button>
      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          className="font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          disabled={isSubmitting}
          onClick={() => {
            setStep("phone");
            setCode("");
            setError(null);
          }}
        >
          Use a different number
        </button>
        <button
          type="button"
          className="font-medium text-primary underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
          disabled={isSubmitting || cooldown > 0}
          onClick={requestOtp}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
        </button>
      </div>
    </form>
  );
}
