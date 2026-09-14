# syntax=docker/dockerfile:1
# Build from the monorepo root: docker build -f apps/api/Dockerfile .
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk add --no-cache libc6-compat && corepack enable && corepack prepare pnpm@12.3.4 --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY database/package.json ./database/
COPY database/prisma ./database/prisma/
COPY packages/types/package.json ./packages/types/
COPY packages/config/package.json ./packages/config/
COPY packages/validation/package.json ./packages/validation/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/database/node_modules ./database/node_modules
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api ./apps/api/
COPY database ./database/
COPY packages/types ./packages/types/
COPY packages/config ./packages/config/
COPY packages/validation ./packages/validation/
RUN pnpm --filter @mahalle/types build && \
    pnpm --filter @mahalle/database prisma generate && \
    pnpm --filter @mahalle/database build:cjs && \
    pnpm --filter @mahalle/api build

FROM base AS deployer
WORKDIR /app
COPY --from=builder /app ./
RUN pnpm deploy --filter @mahalle/api --prod /deploy && \
    test -d /deploy/node_modules/@prisma/client

FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat dumb-init && npm install -g prisma@6.19.3
# Fail the image build instead of publishing an image with a missing migration
# CLI. This also documents the absolute path used by production migrations.
RUN test -x /usr/local/bin/prisma
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deployer /deploy ./
COPY --from=builder /app/database/prisma ./prisma
RUN prisma generate --schema ./prisma/schema.prisma && \
    mkdir -p uploads && chown node:node uploads
EXPOSE 4007
USER node
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
