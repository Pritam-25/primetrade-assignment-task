import { Router } from 'express';
import { requireAuth } from '@middleware/auth.middleware.js';
import {
  createTask,
  getUserTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '@controllers/index.js';
import { validateSchema } from '@middleware/validate.middleware.js';
import { createOrUpdateTaskSchema } from '@schemas/task.schema.js';
import { asyncHandler } from '@utils/asyncHandler.js';

const router: Router = Router();

router.post(
  '/create',
  validateSchema(createOrUpdateTaskSchema),
  asyncHandler(createTask)
);
router.get('/', getUserTasks);
router.get('/:id', getTaskById);
router.patch(
  '/update/:id',
  validateSchema(createOrUpdateTaskSchema),
  asyncHandler(updateTask)
);
router.delete('/delete/:id', asyncHandler(deleteTask));

export default router;
