// Subdomains that can never be claimed as a Mahall's tenant slug. Shared by
// apps/web (middleware routing) and apps/api (tenant-creation validation) so
// the two can never disagree about what's reserved.
export const RESERVED_SLUGS = [
  'www',
  'admin',
  'api',
  'app',
  'dashboard',
  'docs',
  'status',
  'mail',
  'blog',
] as const;

export function isReservedSlug(slug: string): boolean {
  return (RESERVED_SLUGS as readonly string[]).includes(slug.toLowerCase());
}
