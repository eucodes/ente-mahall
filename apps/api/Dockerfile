# =============================================================================
# Mahalle SaaS — API (NestJS)
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
# Copy only package.json manifests (optimal caching: only reinstalls when a
# manifest changes, not when source changes).
# ---------------------------------------------------------------------------
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json                ./apps/api/
COPY database/package.json                ./database/
COPY database/prisma                      ./database/prisma/
COPY packages/types/package.json          ./packages/types/
COPY packages/config/package.json         ./packages/config/
COPY packages/validation/package.json     ./packages/validation/

RUN pnpm install --frozen-lockfile

# ---------------------------------------------------------------------------
# Stage 2 — builder
# Copies source, compiles @mahalle/database to CJS first (NestJS uses CJS
# module resolution so it cannot require() TypeScript files at runtime),
# then builds the API with nest build.
# ---------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

# Restore installed node_modules from the deps stage
COPY --from=deps /app/node_modules             ./node_modules
COPY --from=deps /app/apps/api/node_modules    ./apps/api/node_modules
COPY --from=deps /app/database/node_modules    ./database/node_modules

# Copy manifests again (needed for pnpm workspace resolution)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json                ./apps/api/
COPY database/package.json                ./database/
COPY database/prisma                      ./database/prisma/
COPY packages/types/package.json          ./packages/types/
COPY packages/config/package.json         ./packages/config/
COPY packages/validation/package.json     ./packages/validation/

# Copy source code
COPY apps/api/         ./apps/api/
COPY database/         ./database/
COPY packages/types/   ./packages/types/
COPY packages/config/  ./packages/config/
COPY packages/validation/ ./packages/validation/

# 1. Build shared packages (@mahalle/types)
RUN pnpm --filter @mahalle/types build

# 2. Generate prisma client & compile @mahalle/database → CJS so NestJS can require() it at runtime
RUN pnpm --filter @mahalle/database prisma generate
RUN pnpm --filter @mahalle/database run build:cjs

# 3. Build the API (nest build → dist/)
RUN pnpm --filter @mahalle/api build

# ---------------------------------------------------------------------------
# Stage 3 — deployer
# Uses `pnpm deploy` to produce a self-contained production directory:
# - copies the compiled dist/
# - installs only production dependencies
# - resolves and inlines workspace packages (using the CJS-compiled database)
# ---------------------------------------------------------------------------
FROM base AS deployer
WORKDIR /app

# Need the full built workspace here so pnpm deploy can walk the graph
COPY --from=builder /app/ .

RUN pnpm deploy --filter @mahalle/api --prod /deploy

# ---------------------------------------------------------------------------
# Stage 4 — runner (final production image)
# ---------------------------------------------------------------------------
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat dumb-init && \
    npm install -g prisma@6.2.1

WORKDIR /app
ENV NODE_ENV=production

# Copy self-contained deployment produced by pnpm deploy
COPY --from=deployer /deploy .

# Prisma: keep schema available in the runtime image for migrate/seed commands
COPY --from=builder /app/database/prisma ./prisma

# Create uploads directory (normally mounted as a volume in production)
RUN mkdir -p uploads && chown node:node uploads

EXPOSE 4007
USER node

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
