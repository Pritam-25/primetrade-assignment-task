import { asyncHandler } from '@utils/asyncHandler.js';
import { Router } from 'express';

const router: Router = Router();

router.get('/', asyncHandler(async (_req, res) => {
  res.json({ message: 'User route is working!' });
}));

export default router;
