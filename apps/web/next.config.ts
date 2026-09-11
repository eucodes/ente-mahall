import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This app is deliberately visited through many hostnames (marketing,
  // admin, control, and every tenant subdomain — see src/middleware.ts).
  // Next's dev server blocks cross-origin HMR/dev-asset requests by default;
  // without this, every non-default host works for page loads but silently
  // breaks Fast Refresh/HMR in a way that looks like random state resets.
  allowedDevOrigins: [
    "mahalle.test",
    "*.mahalle.test",
    "localhost",
    "*.localhost"
  ]
};

export default nextConfig;
