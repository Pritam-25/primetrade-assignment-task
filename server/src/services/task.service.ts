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


export const deleteTasksService = async (
  userId: string,
  taskIds: string | string[],
) => {
  const idsArr = Array.isArray(taskIds) ? taskIds : [taskIds];

  if (!Array.isArray(idsArr) || idsArr.length === 0) {
    throw new ApiError(statusCode.badRequest, ERROR_CODES.INVALID_TASK_ID);
  }

  const ownedTasks = await prisma.task.findMany({
    where: { id: { in: idsArr }, userId },
    select: { id: true },
  });

  if (ownedTasks.length === 0) {
    throw new ApiError(statusCode.notFound, ERROR_CODES.TASK_NOT_FOUND);
  }

  const idsToDelete = ownedTasks.map((t) => t.id);

  const result = await prisma.task.deleteMany({
    where: { id: { in: idsToDelete } },
  });

  return { deleted: result.count, ids: idsToDelete };
};
