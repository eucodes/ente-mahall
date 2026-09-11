"use client";

import { useState, type FormEvent } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormField,
  Input,
  Textarea
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import { adminHost } from "@/lib/env";

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

interface CreateTenantResponse {
  tenant: { slug: string };
}

type Step = 1 | 2 | 3;

const STEP_TITLES: Record<Step, string> = {
  1: "About your Mahalle",
  2: "Your account",
  3: "Set a password"
};

const STEP_DESCRIPTIONS: Record<Step, string> = {
  1: "Tell us a little about the Mahalle you're setting up.",
  2: "How you'll sign in and how we'll reach you.",
  3: "One account works across every Mahalle and app on the platform."
};

export function OnboardMahalleDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>(1);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function resetAndClose() {
    setOpen(false);
    setStep(1);
    setName("");
    setDescription("");
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
    setIsSubmitting(false);
  }

  function handleStep1Submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Enter a name for your Mahalle.");
      return;
    }
    setStep(2);
  }

  function handleStep2Submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!fullName.trim() || !email.trim()) {
      setError("Enter your name and email.");
      return;
    }
    setStep(3);
  }

  async function handleStep3Submit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post("/auth/register", { email, password, fullName });
      const res = await apiClient.post<CreateTenantResponse>("/tenants", {
        name,
        slug: slugify(name),
        description: description.trim() || undefined
      });
      // Not an internal Next.js route — this is a real cross-subdomain
      // navigation to the admin site, where the owner manages their Mahalle.
      // The tenant's own subdomain is for its members (phone + OTP login),
      // not for the admin who just created it.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = `${window.location.protocol}//${adminHost()}/${res.tenant.slug}`;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setError(message);
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          resetAndClose();
        } else {
          setOpen(true);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>Get started</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{STEP_TITLES[step]}</DialogTitle>
          <DialogDescription>{STEP_DESCRIPTIONS[step]}</DialogDescription>
        </DialogHeader>

        <p className="text-xs text-muted-foreground">Step {step} of 3</p>

        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4" noValidate>
            <FormField label="Mahallu name" htmlFor="onboard-name" required error={error ?? undefined}>
              <Input
                id="onboard-name"
                autoFocus
                required
                invalid={Boolean(error)}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormField>
            <FormField label="Mahallu description" htmlFor="onboard-description" hint="Optional">
              <Textarea
                id="onboard-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormField>
            <Button type="submit" className="w-full">
              Next
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-4" noValidate>
            <FormField label="Full name" htmlFor="onboard-fullname" required error={error ?? undefined}>
              <Input
                id="onboard-fullname"
                autoFocus
                required
                invalid={Boolean(error)}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </FormField>
            <FormField label="Email" htmlFor="onboard-email" required>
              <Input
                id="onboard-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormField>
            <div className="flex gap-2">
              <Button type="button" variant="outline" className="w-full" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="submit" className="w-full">
                Next
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleStep3Submit} className="space-y-4" noValidate>
            <FormField
              label="Password"
              htmlFor="onboard-password"
              required
              hint="At least 10 characters, with an uppercase letter, a lowercase letter, and a number."
            >
              <Input
                id="onboard-password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormField>
            <FormField
              label="Confirm password"
              htmlFor="onboard-confirm-password"
              required
              error={error ?? undefined}
            >
              <Input
                id="onboard-confirm-password"
                type="password"
                autoComplete="new-password"
                required
                invalid={Boolean(error)}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormField>
            <div className="flex gap-2">
              <Button type="button" variant="outline" className="w-full" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Create Mahalle
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
