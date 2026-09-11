"use client";

import { useState, type FormEvent } from "react";
import {
  Building,
  Button,
  Check,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormField,
  Input,
  Mail,
  PasswordInput,
  PasswordStrengthMeter,
  Textarea,
  User
} from "@mahalle/ui";
import { apiClient, ApiError } from "@/lib/api-client";
import { adminHost } from "@/lib/env";
import { slugify, SlugField } from "./slug-field";

interface CreateTenantResponse {
  tenant: { slug: string };
}

type Step = 1 | 2 | 3;

const STEPS: { step: Step; label: string; title: string; description: string }[] = [
  { step: 1, label: "Mahalle", title: "About your Mahalle", description: "Tell us a little about the Mahalle you're setting up." },
  { step: 2, label: "Account", title: "Your account", description: "How you'll sign in and how we'll reach you." },
  {
    step: 3,
    label: "Password",
    title: "Set a password",
    description: "One account works across every Mahalle and app on the platform."
  }
];

export function OnboardMahalleDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>(1);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [slugTaken, setSlugTaken] = useState(false);
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
    setSlug("");
    setSlugEdited(false);
    setSlugTaken(false);
    setDescription("");
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
    setIsSubmitting(false);
  }

  function handleNameChange(value: string) {
    setName(value);
    if (!slugEdited) setSlug(slugify(value));
  }

  function handleStep1Submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Enter a name for your Mahalle.");
      return;
    }
    if (!slug.trim()) {
      setError("Choose a URL for your Mahalle.");
      return;
    }
    if (slugTaken) {
      setError("That URL is already taken — choose another.");
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
        slug,
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

  const current = STEPS[step - 1];

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
        <Button size="lg">Get started</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{current.title}</DialogTitle>
          <DialogDescription>{current.description}</DialogDescription>
        </DialogHeader>

        <ol className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <li key={s.step} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  s.step < step
                    ? "bg-primary text-primary-foreground"
                    : s.step === step
                      ? "bg-primary/15 text-primary ring-2 ring-primary"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {s.step < step ? <Check className="h-3.5 w-3.5" /> : s.step}
              </div>
              <span className={cn("hidden text-xs font-medium sm:inline", s.step === step ? "text-foreground" : "text-muted-foreground")}>
                {s.label}
              </span>
              {i < STEPS.length - 1 && <div className={cn("h-px flex-1", s.step < step ? "bg-primary" : "bg-border")} />}
            </li>
          ))}
        </ol>

        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4" noValidate>
            <FormField label="Mahalle name" htmlFor="onboard-name" required>
              <Input
                id="onboard-name"
                autoFocus
                required
                leadingIcon={<Building />}
                placeholder="Al Noor Mahalle"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </FormField>
            <SlugField
              id="onboard-slug"
              value={slug}
              onChange={(value) => {
                setSlugEdited(true);
                setSlug(value);
              }}
              onAvailabilityChange={(a) => setSlugTaken(a === "taken")}
            />
            <FormField label="Mahalle description" htmlFor="onboard-description" hint="Optional">
              <Textarea
                id="onboard-description"
                placeholder="A short line about your Mahalle"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormField>
            {error && (
              <p role="alert" className="text-xs font-medium text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" size="lg" disabled={slugTaken}>
              Next
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-4" noValidate>
            <FormField label="Full name" htmlFor="onboard-fullname" required>
              <Input
                id="onboard-fullname"
                autoFocus
                required
                leadingIcon={<User />}
                placeholder="Aisha Rahman"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </FormField>
            <FormField label="Email" htmlFor="onboard-email" required error={error ?? undefined}>
              <Input
                id="onboard-email"
                type="email"
                autoComplete="email"
                required
                invalid={Boolean(error)}
                leadingIcon={<Mail />}
                placeholder="you@example.com"
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
              hint={!password ? "At least 10 characters, with an uppercase letter, a lowercase letter, and a number." : undefined}
            >
              <div className="space-y-2">
                <PasswordInput
                  id="onboard-password"
                  autoComplete="new-password"
                  required
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <PasswordStrengthMeter value={password} />
              </div>
            </FormField>
            <FormField label="Confirm password" htmlFor="onboard-confirm-password" required error={error ?? undefined}>
              <PasswordInput
                id="onboard-confirm-password"
                autoComplete="new-password"
                required
                invalid={Boolean(error)}
                placeholder="Re-enter your password"
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
