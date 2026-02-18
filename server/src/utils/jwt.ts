import jwt from 'jsonwebtoken';
import { env } from './env.js';

export const generateJWT = (userId: string): string => {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '15d' });
};
