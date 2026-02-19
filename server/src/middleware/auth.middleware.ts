import prisma from 'src/config/db/prisma.js';
import { ApiError } from '@utils/apiError.js';
import { ERROR_CODES } from '@utils/errorCodes.js';
import { Request, Response, NextFunction } from 'express';
import { statusCode } from '@utils/statusCodes.js';
import { env } from '@utils/env.js';
import jwt from 'jsonwebtoken';

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;
    console.log('Received JWT token:', token);

    if (!token) {
      // clear any stale/invalid jwt cookie (match cookie options used when setting it)
      try {
        res.clearCookie('jwt', { httpOnly: true, path: '/' });
      } catch (err) {
        console.error('Failed to clear jwt cookie:', err);
      }

      throw new ApiError(
        statusCode.unauthorized,
        ERROR_CODES.NOT_AUTHENTICATED
      );
    }

    // verify token safely
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      userId: string;
    };

    //  check user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true },
    });

    if (!user) {
      // clear jwt when the referenced user no longer exists
      try {
        res.clearCookie('jwt', { httpOnly: true, path: '/' });
      } catch (err) {
        console.error('Failed to clear jwt cookie for deleted user:', err);
      }

      throw new ApiError(
        statusCode.unauthorized,
        ERROR_CODES.NOT_AUTHENTICATED
      );
    }

    // attach to request
    req.userId = user.id;

    next();
  } catch (err) {
    // ensure cookie is cleared on any auth failure
    try {
      res.clearCookie('jwt', { httpOnly: true, path: '/' });
    } catch (clearErr) {
      console.error('Failed to clear jwt cookie on auth error:', clearErr);
    }

    throw new ApiError(statusCode.unauthorized, ERROR_CODES.NOT_AUTHENTICATED);
  }
};
