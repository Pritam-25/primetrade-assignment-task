import { asyncHandler } from '@utils/asyncHandler.js';
import { Router } from 'express';
import { getProfileInfo, updateProfileInfo } from '@controllers/index.js';
import { validateSchema } from '@middleware/index.js';
import { updateUserProfileSchema } from '@schemas/index.js';

const router: Router = Router();

router.get('/profile', asyncHandler(getProfileInfo));

router.put(
  '/profile/update',
  validateSchema(updateUserProfileSchema),
  asyncHandler(updateProfileInfo)
);

export default router;
