import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';

export const app = express();

// Global Middleware
app.use(
  cors({
    origin: [env.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

// Note: Stripe Webhook requires raw body buffer; we handle it cleanly
app.use((req, res, next) => {
  if (req.originalUrl === '/api/billing/webhook') {
    next();
  } else {
    express.json({ limit: '50mb' })(req, res, next);
  }
});
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(requestLogger);

// API Routes
app.use('/api', apiRouter);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🛡️ TenantShield Legal AI API Gateway is active.',
    healthCheck: '/api/health',
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Error handling
app.use(errorHandler);
