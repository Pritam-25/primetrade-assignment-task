export const API = {
  signup: "/auth/signup",
  login: "/auth/login",
  logout: "/auth/logout",
  user: "/user/profile",
  updateProfile: "/user/profile/update",
  createTask: "/tasks/create",
  getTasks: "/tasks",
  updateTask: (id: string) => `/tasks/update/${id}`,
  deleteTasks: '/tasks/delete',
} as const;
