# -----------------------------
# 1️ Builder Stage
# -----------------------------
FROM node:20-alpine AS builder

WORKDIR /app
RUN corepack enable

# Copy package + prisma FIRST (because of postinstall)
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# Install dependencies (postinstall will now succeed)
RUN pnpm install --frozen-lockfile

# Copy rest of the source code
COPY . .

# Generate Prisma client BEFORE building TS
RUN npx prisma generate

# Build TypeScript
RUN pnpm build

# Remove dev dependencies (skip lifecycle scripts so postinstall doesn't run)
RUN pnpm prune --prod --ignore-scripts


# -----------------------------
# 2️ Production Stage
# -----------------------------
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 4000

CMD ["node", "dist/index.js"]

