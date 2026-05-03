# ── Stage 1: builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

# Copy workspace manifests
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/mercadopago-provider/package.json ./packages/mercadopago-provider/
COPY packages/tsconfig/package.json ./packages/tsconfig/
COPY apps/medusa/package.json ./apps/medusa/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY packages/ ./packages/
COPY apps/medusa/ ./apps/medusa/

# Build workspace packages
RUN pnpm --filter @realizah/types build || true
RUN pnpm --filter @realizah/utils build || true
RUN pnpm --filter @realizah/mercadopago-provider build || true

# Build medusa — produces dist/ (backend) + .medusa/client/ (admin)
RUN MEDUSA_DISABLE_TELEMETRY=1 pnpm --filter medusa build

# ── Stage 2: runner ───────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN apk add --no-cache curl

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

# Copy workspace manifests for production deploy
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/mercadopago-provider/package.json ./packages/mercadopago-provider/
COPY packages/tsconfig/package.json ./packages/tsconfig/
COPY apps/medusa/package.json ./apps/medusa/

# Use pnpm deploy to create a clean production deployment with workspace deps resolved
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/types/dist ./packages/types/dist
COPY --from=builder /app/packages/utils/dist ./packages/utils/dist
COPY --from=builder /app/packages/mercadopago-provider/dist ./packages/mercadopago-provider/dist

# Copy medusa build artifacts
COPY --from=builder /app/apps/medusa/dist ./apps/medusa/dist
# admin-bundler.serve() hardcodes rootDir/public/admin — copy there regardless of admin.outDir config
COPY --from=builder /app/apps/medusa/dist/public/admin ./apps/medusa/public/admin
COPY --from=builder /app/apps/medusa/.medusa ./apps/medusa/.medusa
COPY --from=builder /app/apps/medusa/node_modules ./apps/medusa/node_modules
COPY --from=builder /app/apps/medusa/medusa-config.js ./apps/medusa/medusa-config.js

WORKDIR /app/apps/medusa

ENV NODE_ENV=production
ENV PORT=9000
ENV MEDUSA_DISABLE_TELEMETRY=1

EXPOSE 9000

HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=3 \
  CMD curl -f http://localhost:9000/health || exit 1

CMD ["sh", "-c", "node_modules/.bin/medusa db:migrate && node_modules/.bin/medusa start"]
