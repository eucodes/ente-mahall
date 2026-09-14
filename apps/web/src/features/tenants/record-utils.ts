const YEAR_MS = 365.25 * 24 * 60 * 60 * 1000;

export function calculateAge(dob: string | null | undefined): number | null {
  if (!dob) return null;
  const birth = new Date(dob).getTime();
  if (Number.isNaN(birth)) return null;
  const age = Math.floor((Date.now() - birth) / YEAR_MS);
  return age >= 0 ? age : null;
}

export function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function maskId(id: string, revealed: boolean): string {
  if (revealed || id.length <= 4) return id;
  return `${id.slice(0, 4)} •••• ${id.slice(-2)}`;
}

/** "SELF_EMPLOYED" → "Self employed". */
export function humanize(value: string | null | undefined): string | null {
  if (!value) return null;
  const text = value.replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function whatsappHref(phone: string): string {
  return `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, "")}`;
}

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
});

export function formatCurrency(amount: number | string): string {
  const value = Number(amount);
  return INR.format(Number.isFinite(value) ? value : 0);
}
