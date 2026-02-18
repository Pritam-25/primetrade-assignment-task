import prisma from 'src/config/db/prisma.js';
import { ApiError } from '@utils/apiError.js';
import { ERROR_CODES } from '@utils/errorCodes.js';
import { Request, Response, NextFunction } from 'express';
import { statusCode } from '@utils/statusCodes.js';
import { env } from '@utils/env.js';
import jwt from 'jsonwebtoken';

export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
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
      throw new ApiError(
        statusCode.unauthorized,
        ERROR_CODES.NOT_AUTHENTICATED
      );
    }

    // attach to request
    req.userId = user.id;

    next();
  } catch {
    throw new ApiError(statusCode.unauthorized, ERROR_CODES.NOT_AUTHENTICATED);
  }
};
