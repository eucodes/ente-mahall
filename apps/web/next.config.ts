import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Produces a self-contained .next/standalone directory for Docker production
  // images: a single `node server.js` replaces `next start`, and only the
  // node_modules actually used at runtime are included.
  output: "standalone",

  // With a pnpm monorepo the root node_modules sits two levels above the app.
  // Telling Next where the root is ensures shared packages (Radix, etc.) are
  // included in the file trace and are available inside the container.
  outputFileTracingRoot: path.join(__dirname, "../../"),

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
