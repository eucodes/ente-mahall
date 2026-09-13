export enum BillingPeriod {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY"
}

/**
 * A Mahalle's billing relationship — deliberately distinct from whether the
 * Mahalle itself is active (Section S). Mirrors the SubscriptionStatus enum
 * in schema.prisma.
 */
export enum SubscriptionStatus {
  TRIAL = "TRIAL",
  ACTIVE = "ACTIVE",
  PAST_DUE = "PAST_DUE",
  SUSPENDED = "SUSPENDED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED"
}

export enum InvoiceStatus {
  DRAFT = "DRAFT",
  ISSUED = "ISSUED",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  VOID = "VOID"
}
