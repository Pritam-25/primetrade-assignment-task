declare namespace Express {
  interface Request {
    userId: string;
    id: string; // this line is for define the `id` property on the Request interface for task routes
  }
}
