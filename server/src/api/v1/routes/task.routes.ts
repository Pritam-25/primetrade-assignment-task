import { Router } from 'express';
import {
  createTask,
  getUserTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '@controllers/index.js';
import { validateSchema } from '@middleware/validate.middleware.js';
import { createTaskSchema, updateTaskSchema } from '@schemas/task.schema.js';
import { asyncHandler } from '@utils/asyncHandler.js';

const router: Router = Router();

router.post(
  '/create',
  validateSchema(createTaskSchema),
  asyncHandler(createTask)
);
router.get('/', getUserTasks);
router.get('/:id', getTaskById);

router.put(
  '/update/:id',
  validateSchema(updateTaskSchema),
  asyncHandler(updateTask)
);
router.delete('/delete/:id', asyncHandler(deleteTask));

export default router;
