# PrimeTrade Dashboard API (Server)

Backend server for the PrimeTrade frontend assignment. Provides JWT-based authentication, user profile management, and CRUD APIs for tasks.

## 🚀 Tech Stack

- Node.js 20
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcrypt (password hashing)
- Zod (validation)

---

## Requirements

- pnpm (project uses pnpm and a workspace)
- Node.js 20+
- A running PostgreSQL instance and a `DATABASE_URL` connection string

## Environment

Copy `server/.env.example` to `server/.env` and set values. Required env vars (validated in `src/utils/env.ts`):

- `DATABASE_URL` — Postgres connection URL
- `JWT_SECRET` — secret used to sign JWTs
- `PORT` — (optional) server port; defaults to `4000`
- `FRONTEND_URL` — frontend origin for CORS and cookie settings
- `USE_HTTPS` — set to `'true'` in HTTPS environments

## Local development

Install dependencies and run the dev server:

```bash
pnpm install
pnpm dev
```

Dev server runs with `tsx watch` (see `package.json` scripts) and listens on the port configured by `PORT`.

## Build for production

```bash
pnpm build
pnpm start
```

`pnpm build` runs `tsc` and `tsc-alias` to produce `dist/` (the Docker image copies and runs `dist/index.js`).

## Prisma

- Generated Prisma client is placed under `src/generated/prisma` by the `prisma generate` step.
- To run migrations or generate the client locally:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

## Docker

There is a multi-stage `server/Dockerfile` which:

- installs dependencies
- generates the Prisma client
- builds TypeScript into `dist`
- prunes dev dependencies for a smaller runtime image

Build and run example:

```bash
docker build -t primetrade-server -f server/Dockerfile server
docker run --rm -p 4000:4000 \
	-e DATABASE_URL="postgres://user:pass@host:5432/db" \
	-e JWT_SECRET="your_jwt_secret" \
	primetrade-server
```

## Useful scripts

- `pnpm dev` — run in development mode
- `pnpm build` — compile TypeScript and run `tsc-alias`
- `pnpm start` — run the compiled `dist/index.js`
- `pnpm lint` / `pnpm lint:fix` — ESLint

## Notes and troubleshooting

- The codebase uses `tsconfig-paths` for path aliases; the Dockerfile generates JS output to `dist/` and the runtime executes `dist/index.js`.
- If you see errors about `.ts` imports from generated Prisma files, ensure the build step has run `prisma generate` and that `dist/generated/prisma` contains `.js` files.
- When deploying, set `NODE_ENV=production` and provide `DATABASE_URL` and `JWT_SECRET` as secrets.
