import 'dotenv/config';
import express, { Express, Router } from 'express';
import cors from 'cors';
import { env } from '@utils/env.js';
import { errorHandler } from '@middleware/index.js';
import { requireAuth } from '@middleware/auth.middleware.js';
import { userRoutes, authRoutes } from '@routes/index.js';
import cookieParser from 'cookie-parser';
import { taskRoutes } from '@routes/index.js';

const app: Express = express();

// Trust first proxy (needed when running behind Render or other proxies)
app.set('trust proxy', 1);

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

const apiRouter: Router = Router();

// Public routes
apiRouter.use('/auth', authRoutes);

// Protected routes
apiRouter.use('/user', requireAuth, userRoutes);
apiRouter.use('/tasks', requireAuth, taskRoutes);

// Mount v1
app.use('/api/v1', apiRouter);

// Error handler
app.use(errorHandler);

export default app;
