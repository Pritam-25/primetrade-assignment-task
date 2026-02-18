import z from 'zod';
import { TaskStatus } from '@generated/prisma/enums.js';

export const createOrUpdateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(30, 'Title must not exceed 30 characters'),

  description: z.string().optional(),
  status: z.enum(TaskStatus).default(TaskStatus.PENDING),
});

export type CreateTaskInput = z.infer<typeof createOrUpdateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof createOrUpdateTaskSchema>;
