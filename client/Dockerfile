# -----------------------------
# 1) Builder
# -----------------------------
FROM node:20-alpine AS builder

WORKDIR /app
RUN corepack enable

# Build argument (default to server API inside compose/network)
ARG NEXT_PUBLIC_API_URL=http://server:4000/api/v1

# Make available during build (so Next.js inlines it)
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Remove dev dependencies
RUN pnpm prune --prod


# -----------------------------
# 2) Runner
# -----------------------------
FROM node:20-alpine AS runner

WORKDIR /app
RUN corepack enable

ENV NODE_ENV=production

# Runtime env (optional but recommended for server-side usage)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["pnpm", "start"]
