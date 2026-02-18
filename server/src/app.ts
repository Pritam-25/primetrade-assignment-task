import 'dotenv/config';
import express, { Express, Router } from 'express';
import cors from 'cors';
import { env } from '@utils/env.js';
import { errorHandler } from '@middleware/index.js';
import { requireAuth } from '@middleware/auth.middleware.js';
import { userRoutes, authRoutes } from '@routes/index.js';

const app: Express = express();
app.use(express.json());

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

const apiRouter: Router = Router();

// Public routes
apiRouter.use('/auth', authRoutes);

// Protected routes
apiRouter.use('/user', requireAuth, userRoutes);

// Mount v1
app.use('/api/v1', apiRouter);

// Error handler (ALWAYS LAST)
app.use(errorHandler);

export default app;
