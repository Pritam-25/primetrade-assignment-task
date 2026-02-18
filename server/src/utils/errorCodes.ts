export const ERROR_CODES = {
  NOT_AUTHENTICATED: 'User Not authenticated',
  USER_NOT_FOUND: 'User not found',
  FORBIDDEN: 'Forbidden',
  VALIDATION_ERROR: 'Invalid Request Data',
  INTERNAL_ERROR: 'Internal server error',
  USER_ALREADY_EXISTS: 'User with this email already exists',
  INVALID_CREDENTIALS: 'Invalid email or password',
  TASK_NOT_FOUND: 'Task not found',
  INVALID_TASK_ID: 'Invalid task ID',
} as const;
