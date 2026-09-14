# =============================================================================
# Mahalle SaaS — Web (Next.js)
# Build context: monorepo root
# =============================================================================

# ---------------------------------------------------------------------------
# Base: Node 20 Alpine + pinned pnpm
# ---------------------------------------------------------------------------
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk add --no-cache libc6-compat && \
    corepack enable && \
    corepack prepare pnpm@12.3.4 --activate

# ---------------------------------------------------------------------------
# Stage 1 — deps
# Copy only package.json manifests for optimal layer caching.
# ---------------------------------------------------------------------------
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json               ./apps/web/
COPY packages/types/package.json         ./packages/types/
COPY packages/config/package.json        ./packages/config/
COPY packages/validation/package.json    ./packages/validation/
COPY packages/ui/package.json            ./packages/ui/
COPY packages/api-client/package.json    ./packages/api-client/

RUN pnpm install --frozen-lockfile

# ---------------------------------------------------------------------------
# Stage 2 — builder
# Bakes NEXT_PUBLIC_* vars at build time (Next.js inlines them into the
# client bundle during `next build` — they CANNOT be injected at runtime).
# ---------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

# Restore node_modules
COPY --from=deps /app/node_modules             ./node_modules
COPY --from=deps /app/apps/web/node_modules    ./apps/web/node_modules

# Copy manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json               ./apps/web/
COPY packages/types/package.json         ./packages/types/
COPY packages/config/package.json        ./packages/config/
COPY packages/validation/package.json    ./packages/validation/
COPY packages/ui/package.json            ./packages/ui/
COPY packages/api-client/package.json    ./packages/api-client/

# Copy source code
COPY apps/web/         ./apps/web/
COPY packages/         ./packages/

# NEXT_PUBLIC_* are baked into the client bundle at build time.
# Pass them as --build-arg in docker build / GitHub Actions.
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_ROOT_DOMAIN
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_ROOT_DOMAIN=$NEXT_PUBLIC_ROOT_DOMAIN

# Disable Next.js telemetry in CI/CD
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm --filter @mahalle/web build

# ---------------------------------------------------------------------------
# Stage 3 — runner (final production image)
# Next.js `output: "standalone"` generates a self-contained .next/standalone/
# directory. Copy it plus the static assets and public files.
# ---------------------------------------------------------------------------
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat dumb-init

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# The standalone server and its minimal node_modules
COPY --from=builder /app/apps/web/.next/standalone ./

# Static build assets (JS chunks, CSS, images)
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

# Public directory (robots.txt, icons, etc.)
COPY --from=builder /app/apps/web/public ./apps/web/public

# PORT must match the container expose; HOSTNAME=0.0.0.0 is required so the
# server binds on all interfaces (not just loopback) inside the container.
ENV PORT=3007
ENV HOSTNAME=0.0.0.0
EXPOSE 3007

USER node
ENTRYPOINT ["dumb-init", "--"]

# server.js is emitted by Next.js into the standalone root.
# With outputFileTracingRoot set to the monorepo root the server is at:
#   /app/apps/web/server.js
CMD ["node", "apps/web/server.js"]
