import z from 'zod';
import { TaskStatus } from '@generated/prisma/enums.js';

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(30, 'Title must not exceed 30 characters'),

  description: z.string().optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(30, 'Title must not exceed 30 characters'),

  description: z.string().optional(),
  status: z.enum(TaskStatus),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
