import { signup, login, logout } from './auth.controller.js';
import { getProfileInfo, updateProfileInfo } from './user.controller.js';
import {
  createTask,
  getUserTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from './task.controller.js';

export { getProfileInfo, updateProfileInfo };
export { signup, login, logout };
export { createTask, getUserTasks, getTaskById, updateTask, deleteTask };
