import { getProfileService, updateProfileService } from '@services/index.js';
import { successResponse } from '@utils/apiResponse.js';
import { statusCode } from '@utils/statusCodes.js';
import { Request, Response } from 'express';

// ------------- user controllers ----------------
export const getProfileInfo = async (req: Request, res: Response) => {
  const profileInfo = await getProfileService(req.userId);

  return res
    .status(statusCode.success)
    .json(successResponse('Profile info retrieved successfully', profileInfo));
};

export const updateProfileInfo = async (req: Request, res: Response) => {
  const updatedProfile = await updateProfileService(req.userId, req.body);
  return res
    .status(statusCode.success)
    .json(successResponse('Profile updated successfully', updatedProfile));
};
