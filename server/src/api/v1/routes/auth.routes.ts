import { asyncHandler } from '@utils/asyncHandler.js';
import { Router } from 'express';
import { validateSchema } from '@middleware/index.js';
import { signup, login, logout } from '@controllers/index.js';
import { signupSchema, loginSchema } from '@schemas/index.js';

// -------------- Auth Routes ----------------
const router: Router = Router();

router.post('/signup', validateSchema(signupSchema), asyncHandler(signup));

router.post('/login', validateSchema(loginSchema), asyncHandler(login));

router.post('/logout', asyncHandler(logout));

export default router;
