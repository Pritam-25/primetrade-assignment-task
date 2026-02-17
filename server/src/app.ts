import 'dotenv/config';
import express, { Express, Router } from 'express';
import { errorHandler } from '@middleware/index.js';
import cors from 'cors';
import { env } from '@utils/env.js';

const app: Express = express();
app.use(express.json());

const apiRouter: Router = Router();

app.use(
  cors({
    origin: env.FRONTEND_URL, // Next.js frontend
    credentials: true,
  })
);

app.use('/api', apiRouter);

// error handling middleware
app.use(errorHandler);

export default app;
