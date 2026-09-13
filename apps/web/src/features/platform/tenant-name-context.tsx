"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const TenantNameContext = createContext<{
  name: string | null;
  setName: (name: string | null) => void;
} | null>(null);

export function TenantNameProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState<string | null>(null);
  const value = useMemo(() => ({ name, setName }), [name]);
  return <TenantNameContext.Provider value={value}>{children}</TenantNameContext.Provider>;
}

export function useTenantName() {
  const ctx = useContext(TenantNameContext);
  return ctx?.name ?? null;
}

/** Rendered by a tenant-scoped page to make its Mahalle's name available to the shell (breadcrumbs, context bar). */
export function RegisterTenantName({ name }: { name: string }) {
  const ctx = useContext(TenantNameContext);
  useEffect(() => {
    ctx?.setName(name);
    return () => ctx?.setName(null);
  }, [ctx, name]);
  return null;
}
