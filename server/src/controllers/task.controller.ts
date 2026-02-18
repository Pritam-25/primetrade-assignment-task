import { Request, Response } from 'express';
import {
  createTaskService,
  getUserTasksService,
  getTaskByIdService,
  updateTaskService,
  deleteTasksService,
} from '@services/index.js';
import { successResponse } from '@utils/apiResponse.js';
import { ERROR_CODES } from '@utils/errorCodes.js';
import { statusCode } from '@utils/statusCodes.js';
import { ApiError } from '@utils/apiError.js';

export const createTask = async (req: Request, res: Response) => {
  const task = await createTaskService(req.userId, req.body);
  res.status(201).json(successResponse('Task created successfully', task));
};

export const getUserTasks = async (req: Request, res: Response) => {
  const tasks = await getUserTasksService(req.userId);
  res.status(200).json(successResponse('Tasks retrieved successfully', tasks));
};

export const getTaskById = async (req: Request, res: Response) => {
  const taskId = req.params.id as string;
  if (!taskId)
    throw new ApiError(statusCode.badRequest, ERROR_CODES.INVALID_TASK_ID);

  const task = await getTaskByIdService(req.userId, taskId);
  res.status(200).json(successResponse('Task retrieved successfully', task));
};

export const updateTask = async (req: Request, res: Response) => {
  const taskId = req.params.id as string;
  if (!taskId)
    throw new ApiError(statusCode.badRequest, ERROR_CODES.INVALID_TASK_ID);

  const task = await updateTaskService(req.userId, taskId, req.body);
  res.status(200).json(successResponse('Task updated successfully', task));
};

export const deleteTask = async (req: Request, res: Response) => {
  const taskId = req.params.id as string | undefined;
  const ids = (req.body && (req.body.ids as string[])) || undefined;

  if (!taskId && (!ids || ids.length === 0))
    throw new ApiError(statusCode.badRequest, ERROR_CODES.INVALID_TASK_ID);
  const toDelete = taskId ? taskId : (ids as string[]);
  const result = await deleteTasksService(req.userId, toDelete);
  const msg = Array.isArray(toDelete)
    ? 'Tasks deleted successfully'
    : 'Task deleted successfully';
  res.status(200).json(successResponse(msg, result));
};
