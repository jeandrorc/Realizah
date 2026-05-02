# ── Stage 1: builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

# Copy workspace manifests (all packages needed for build)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/mercadopago-provider/package.json ./packages/mercadopago-provider/
COPY packages/tsconfig/package.json ./packages/tsconfig/
COPY apps/medusa/package.json ./apps/medusa/

# Install all dependencies (including dev for build)
RUN pnpm install --frozen-lockfile

# Copy full source
COPY packages/ ./packages/
COPY apps/medusa/ ./apps/medusa/

# Build workspace packages that medusa depends on
RUN pnpm --filter @realizah/types build || true
RUN pnpm --filter @realizah/utils build || true
RUN pnpm --filter @realizah/mercadopago-provider build || true

# Build medusa — produces .medusa/server/ self-contained bundle
RUN pnpm --filter medusa build

# ── Stage 2: runner ───────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN apk add --no-cache curl

WORKDIR /app

# medusa build outputs a self-contained bundle in .medusa/server/
COPY --from=builder /app/apps/medusa/.medusa/server ./

ENV NODE_ENV=production
ENV PORT=9000

EXPOSE 9000

HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=3 \
  CMD curl -f http://localhost:9000/health || exit 1

# Run migrations then start the bundled server
CMD ["sh", "-c", "node_modules/.bin/medusa db:migrate && node_modules/.bin/medusa start"]
