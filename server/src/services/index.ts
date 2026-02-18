import { loginService, signupService } from './auth.services.js';
import { getProfileService, updateProfileService } from './user.service.js';
import {
  createTaskService,
  getUserTasksService,
  getTaskByIdService,
  updateTaskService,
  deleteTasksService,
} from './task.service.js';

export { getProfileService, updateProfileService };
export { signupService, loginService };
export {
  createTaskService,
  getUserTasksService,
  getTaskByIdService,
  updateTaskService,
  deleteTasksService,
};
