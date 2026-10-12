import { Request, Response } from 'express';
import { getPostgresStatus } from '../config/postgres.js';
import { getMongoStatus } from '../config/mongo.js';
import { env } from '../config/env.js';

export function getHealthStatus(req: Request, res: Response) {
  const postgresStatus = getPostgresStatus();
  const mongoStatus = getMongoStatus();

  const systemHealth = {
    service: 'TenantShield API Gateway',
    version: '1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: env.NODE_ENV,
    memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    databases: {
      relational: postgresStatus,
      documentStore: mongoStatus,
    },
    llm: {
      activeProvider: env.LLM_PROVIDER,
      geminiKeyConfigured: Boolean(env.GEMINI_API_KEY && env.GEMINI_API_KEY.trim().length > 0),
    },
    billing: {
      stripeConfigured: Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_SECRET_KEY.trim().length > 0),
      mode: 'test_mode',
    },
  };

  res.status(200).json({
    success: true,
    data: systemHealth,
  });
}
