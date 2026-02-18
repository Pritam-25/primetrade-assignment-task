import prisma from '@config/db/prisma.js';
import { LoginInput, SignupInput } from '@schemas/auth.schema.js';
import { ApiError } from '@utils/apiError.js';
import { ERROR_CODES } from '@utils/errorCodes.js';
import { statusCode } from '@utils/statusCodes.js';
import bcrypt from 'bcrypt';

// ------------- signup service ----------------
export const signupService = async (data: SignupInput) => {
  // check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new ApiError(statusCode.conflict, ERROR_CODES.USER_ALREADY_EXISTS);
  }

  // hash password
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // save user to database
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      UserName: data.username,
    },
    select: {
      UserName: true,
      email: true,
      id: true,
    },
  });

  return {
    username: user.UserName,
    email: user.email,
    id: user.id,
  };
};

// ------------- login service ----------------
export const loginService = async (data: LoginInput) => {
  // find user by email
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new ApiError(
      statusCode.unauthorized,
      ERROR_CODES.INVALID_CREDENTIALS
    );
  }

  // compare password
  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(
      statusCode.unauthorized,
      ERROR_CODES.INVALID_CREDENTIALS
    );
  }

  return {
    username: user.UserName,
    email: user.email,
    id: user.id,
  };
};
