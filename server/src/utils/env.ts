import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(4000),
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    FRONTEND_URL: z.string().default('http://localhost:3000'),
    DATABASE_URL: z.url(),
    JWT_SECRET: z.string(),
    // In development we serve over HTTP; default to 'false' so cookies are set locally
    USE_HTTPS: z.string().default('false'),
    COOKIE_DOMAIN: z.string().default('http://localhost:3000'),
  },

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
