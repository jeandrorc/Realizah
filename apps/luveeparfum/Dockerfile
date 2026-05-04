# ── Stage 1: deps ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8 --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY apps/luveeparfum/package.json ./apps/luveeparfum/

RUN pnpm install --frozen-lockfile

# ── Stage 2: builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/luveeparfum/node_modules ./apps/luveeparfum/node_modules

COPY packages/ ./packages/
COPY apps/luveeparfum/ ./apps/luveeparfum/
COPY package.json pnpm-workspace.yaml ./

# Build shared packages
RUN pnpm --filter @realizah/types build
RUN pnpm --filter @realizah/utils build

# Build luveeparfum (standalone output for Docker)
WORKDIR /app/apps/luveeparfum
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_STANDALONE=1

RUN pnpm build

# ── Stage 3: runner ───────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN apk add --no-cache curl

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Standalone output includes everything needed
COPY --from=builder --chown=nextjs:nodejs /app/apps/luveeparfum/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/luveeparfum/.next/static ./apps/luveeparfum/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/luveeparfum/public ./apps/luveeparfum/public

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["node", "apps/luveeparfum/server.js"]
