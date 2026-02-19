import type { Response } from 'express';
import { env } from './env.js';

export const setAuthCookie = (res: Response, token: string) => {
  const isProduction = env.NODE_ENV === 'production';

  res.cookie('jwt', token, {
    httpOnly: true, // browser JS can't access this cookie
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    maxAge: 15 * 24 * 60 * 60 * 1000,
    domain: isProduction ? env.COOKIE_DOMAIN : undefined,
  });
};
