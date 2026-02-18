import z from 'zod';

export const updateUserProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters'),

  email: z.email('Invalid email format'),
});

export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
