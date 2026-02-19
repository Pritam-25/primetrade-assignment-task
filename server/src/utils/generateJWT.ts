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
  });
  try {
    // Log the Set-Cookie header for debugging in production
    const header = (res.getHeader && res.getHeader('set-cookie')) || null;
    // Avoid leaking the full token in logs; log presence/length only
    if (header) {
      const headerInfo = Array.isArray(header)
        ? header.map(
            h => (h as string).slice(0, 80) + (h.length > 80 ? '...' : '')
          )
        : String(header).slice(0, 160) +
          (String(header).length > 160 ? '...' : '');
      // eslint-disable-next-line no-console
      console.log('Set-Cookie header set by setAuthCookie:', headerInfo);
    } else {
      // eslint-disable-next-line no-console
      console.log('No Set-Cookie header present after setAuthCookie');
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error reading Set-Cookie header for debug:', err);
  }
};
