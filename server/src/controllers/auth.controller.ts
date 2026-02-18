import { loginService, signupService } from '@services/index.js';
import { successResponse } from '@utils/apiResponse.js';
import { statusCode } from '@utils/statusCodes.js';
import { Request, Response } from 'express';
import { generateJWT } from '@utils/jwt.js';
import { setAuthCookie } from '@utils/generateJWT.js';

// -------------- Signup Controller ----------------
export const signup = async (req: Request, res: Response) => {
  const user = await signupService(req.body);

  const token = generateJWT(user.id);
  setAuthCookie(res, token);

  res
    .status(statusCode.created)
    .json(successResponse('User registered successfully', user));
};

// -------------- Login Controller ----------------
export const login = async (req: Request, res: Response) => {
  const user = await loginService(req.body);

  const token = generateJWT(user.id);
  setAuthCookie(res, token);

  res
    .status(statusCode.success)
    .json(successResponse('User logged in successfully', user));
};

// -------------- logout Controller ----------------
export const logout = (_req: Request, res: Response) => {
  const isHttps = process.env.NODE_ENV === 'production';

  res.clearCookie('jwt', {
    httpOnly: true,
    secure: isHttps,
    sameSite: isHttps ? 'none' : 'lax',
    path: '/',
  });

  res
    .status(statusCode.success)
    .json(successResponse('User logged out successfully'));
};
