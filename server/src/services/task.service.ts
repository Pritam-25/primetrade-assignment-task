import prisma from 'src/config/db/prisma.js';
import { ApiError } from '@utils/apiError.js';
import { statusCode } from '@utils/statusCodes.js';
import { ERROR_CODES } from '@utils/errorCodes.js';
import { TaskStatus } from '@generated/prisma/enums.js';

export const createTaskService = async (
  userId: string,
  data: {
    title: string;
    description?: string;
    status?: TaskStatus;
  }
) => {
  return prisma.task.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const getUserTasksService = async (userId: string) => {
  return prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getTaskByIdService = async (userId: string, taskId: string) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!task) {
    throw new ApiError(statusCode.notFound, ERROR_CODES.TASK_NOT_FOUND);
  }

  return task;
};

export const updateTaskService = async (
  userId: string,
  taskId: string,
  data: {
    title?: string;
    description?: string;
    status?: TaskStatus;
  }
) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw new ApiError(statusCode.notFound, ERROR_CODES.TASK_NOT_FOUND);
  }

  return prisma.task.update({
    where: { id: taskId },
    data,
  });
};

export const deleteTaskService = async (userId: string, taskId: string) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw new ApiError(statusCode.notFound, ERROR_CODES.TASK_NOT_FOUND);
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  return { message: 'Task deleted successfully' };
};
