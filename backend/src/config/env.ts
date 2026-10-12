import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),

  // Databases
  POSTGRES_URL: z.string().optional(),
  MONGODB_URI: z.string().optional(),

  // Auth
  JWT_SECRET: z.string().default('tenantshield-dev-secret-key-32charslong!'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // LLM Engine
  LLM_PROVIDER: z.enum(['gemini', 'mock', 'ollama']).default('gemini'),
  GEMINI_API_KEY: z.string().optional(),
  OLLAMA_BASE_URL: z.string().default('http://localhost:11434'),

  // Stripe Billing
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_ID_AUDIT: z.string().default('price_one_off_audit_9usd'),
  STRIPE_PRICE_ID_PRO: z.string().default('price_pro_monthly_5usd'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment configuration:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
