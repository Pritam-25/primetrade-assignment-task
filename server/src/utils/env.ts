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
    USE_HTTPS: z.string().default('true'),
  },

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
