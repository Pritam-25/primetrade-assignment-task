import type { Response } from 'express';
import { env } from './env.js';

export const setAuthCookie = (res: Response, token: string) => {
  try {
    const isProduction = env.NODE_ENV === 'production';

    console.log('=== Setting Auth Cookie ===');
    console.log('NODE_ENV:', env.NODE_ENV);
    console.log('isProduction:', isProduction);
    console.log('Token length:', token?.length);
    console.log('Token preview:', token?.substring(0, 20));

    if (!token) {
      console.error('❌ No token provided to setAuthCookie');
      return;
    }

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    console.log("✅ Cookie 'jwt' set successfully");
    console.log('Cookie options:', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    console.error('🔥 Error setting auth cookie:', error);
  }
};
