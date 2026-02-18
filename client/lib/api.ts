export const API = {
  signup: "/auth/signup",
  login: "/auth/login",
  logout: "/auth/logout",
  user: "/user",
  createTask: "/tasks/create",
  updateTask: (id: string) => `/tasks/update/${id}`,
  deleteTask: (id: string) => `/tasks/delete/${id}`,
} as const;
