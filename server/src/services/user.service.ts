import prisma from '@config/db/prisma.js';
import { UpdateUserProfileInput } from '@schemas/user.schema.js';
import { ApiError } from '@utils/apiError.js';
import { ERROR_CODES } from '@utils/errorCodes.js';
import { statusCode } from '@utils/statusCodes.js';

export const getProfileService = async (userId: string) => {
  // check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      UserName: true,
      id: true,
    },
  });

  if (!user) {
    throw new ApiError(statusCode.notFound, ERROR_CODES.USER_NOT_FOUND);
  }

  return {
    id: user.id,
    email: user.email,
    username: user.UserName,
  };
};

export const updateProfileService = async (
  userId: string,
  data: UpdateUserProfileInput
) => {
  // update user profile
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      email: data.email,
      UserName: data.username,
    },
  });

  return {
    id: userId,
    email: updatedUser.email,
    username: updatedUser.UserName,
  };
};
