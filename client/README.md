Client (Next.js)

This repository contains the frontend Next.js application for PrimeTrade.

**Stack**: Next.js 16, React 19, TailwindCSS, TypeScript

## Requirements

- Node.js 20+ (Dockerfile uses `node:20-alpine`)
- pnpm (the repo is configured for `pnpm`)

## Local development

1. Install dependencies:

```bash
pnpm install
```

2. Run dev server:

```bash
pnpm dev
```

Open http://localhost:3000

## Environment

- Copy `./.env.example` to `./.env` and update values if needed.
- The app expects `NEXT_PUBLIC_API_URL` (used by the client to reach the server API).

## Build & start

```bash
pnpm build
pnpm start
```

The production server listens on port `3000` by default.

## Docker

Build and run the production image (the `Dockerfile` uses a build + runner stage):

```bash
docker build -t primetrade-client:latest --build-arg NEXT_PUBLIC_API_URL=http://server:4000/api/v1 -f client/Dockerfile client
docker run --rm -p 3000:3000 primetrade-client:latest
```

## Useful scripts

- `pnpm dev` — run Next.js in development mode
- `pnpm build` — build for production
- `pnpm start` — start the built production server
- `pnpm lint` — run ESLint

## Notes

- The project uses `pnpm` and a workspace setup. Use `pnpm` commands from the repo root if you rely on workspace behavior.
- See `client/tsconfig.json`, `client/next.config.ts`, and `client/Dockerfile` for additional runtime/build configuration.

## Links

- Next.js docs: https://nextjs.org/docs
- TailwindCSS: https://tailwindcss.com/
