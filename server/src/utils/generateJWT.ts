import type { Response } from 'express';
import { env } from './env.js';

export const setAuthCookie = (res: Response, token: string) => {
  const isHttps = String(env.USE_HTTPS || '').toLowerCase() === 'true';

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: isHttps,
    sameSite: isHttps ? 'none' : 'lax',
    path: '/',
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });
};
