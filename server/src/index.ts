import { Request, Response } from 'express';
import app from './app.js';
import { env } from '@utils/env.js';
import prisma from '@config/db/prisma.js';
import { statusCode } from '@utils/statusCodes.js';

const PORT = env.PORT || 4000;

app.get('/', (_req: Request, res: Response) => {
  res.send('🚀 PrimeTrade Dashboard API is running');
});

// Simple health check endpoint to verify API and database connectivity
app.get('/api/v1/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(statusCode.success).json({
      status: 'ok',
      db: 'connected',
      uptime: process.uptime(),
    });
  } catch (error) {
    console.error('Health check failed:', error);

    res.status(statusCode.serviceUnavailable).json({
      status: 'degraded',
      db: 'disconnected',
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
