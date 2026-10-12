import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

let pool: pg.Pool | null = null;
let isConnected = false;

// In-memory fallback tables for zero-setup developer convenience
interface MockDB {
  users: any[];
  subscriptions: any[];
  credit_transactions: any[];
  audit_jobs: any[];
}

const mockDb: MockDB = {
  users: [],
  subscriptions: [],
  credit_transactions: [],
  audit_jobs: [],
};

export async function connectPostgres(): Promise<boolean> {
  if (env.POSTGRES_URL && env.POSTGRES_URL.trim() !== '') {
    try {
      pool = new Pool({
        connectionString: env.POSTGRES_URL,
        ssl: env.POSTGRES_URL.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });

      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      isConnected = true;
      console.log('✅ [PostgreSQL] Connected to Neon / PostgreSQL cluster');
      await initPostgresTables();
      return true;
    } catch (err: any) {
      console.warn('⚠️ [PostgreSQL] Failed to connect to live database:', err.message);
      console.warn('ℹ️ [PostgreSQL] Falling back to resilient in-memory relational store.');
      isConnected = false;
      return false;
    }
  } else {
    console.log('ℹ️ [PostgreSQL] No POSTGRES_URL provided. Using resilient in-memory relational store.');
    isConnected = false;
    return false;
  }
}

export async function initPostgresTables(): Promise<void> {
  if (!pool || !isConnected) return;

  const ddl = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(150),
      role VARCHAR(50) DEFAULT 'tenant',
      free_reports_remaining INT DEFAULT 1,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      stripe_customer_id VARCHAR(255) UNIQUE,
      stripe_subscription_id VARCHAR(255) UNIQUE,
      stripe_price_id VARCHAR(255),
      plan_tier VARCHAR(50) DEFAULT 'free',
      status VARCHAR(50) DEFAULT 'active',
      current_period_start TIMESTAMP WITH TIME ZONE,
      current_period_end TIMESTAMP WITH TIME ZONE,
      cancel_at_period_end BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS credit_transactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      amount_cents INT NOT NULL,
      currency VARCHAR(10) DEFAULT 'usd',
      transaction_type VARCHAR(50),
      stripe_payment_intent_id VARCHAR(255),
      status VARCHAR(50) DEFAULT 'succeeded',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS audit_jobs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      mongo_lease_id VARCHAR(100) NOT NULL,
      document_name VARCHAR(255) NOT NULL,
      page_count INT DEFAULT 0,
      file_size_bytes BIGINT DEFAULT 0,
      status VARCHAR(50) DEFAULT 'queued',
      overall_risk_score INT DEFAULT 0,
      total_exposure_usd NUMERIC(10, 2) DEFAULT 0.00,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      completed_at TIMESTAMP WITH TIME ZONE
    );
  `;

  try {
    await pool.query(ddl);
    console.log('✅ [PostgreSQL] Relational tables initialized successfully.');
  } catch (err: any) {
    console.error('❌ [PostgreSQL] Failed to initialize tables:', err.message);
  }
}

export async function dbQuery<T = any>(text: string, params: any[] = []): Promise<{ rows: T[]; rowCount: number }> {
  if (pool && isConnected) {
    const res = await pool.query(text, params);
    return { rows: res.rows as T[], rowCount: res.rowCount ?? 0 };
  }

  // Resilient in-memory query handler for development
  return executeMockQuery<T>(text, params);
}

function executeMockQuery<T>(text: string, params: any[]): { rows: T[]; rowCount: number } {
  const normalized = text.trim().toLowerCase();

  if (normalized.startsWith('select 1')) {
    return { rows: [{ '?column?': 1 }] as unknown as T[], rowCount: 1 };
  }

  // Handle common User queries
  if (normalized.includes('from users') && normalized.includes('where email =')) {
    const email = params[0];
    const user = mockDb.users.find(u => u.email === email);
    return { rows: (user ? [user] : []) as T[], rowCount: user ? 1 : 0 };
  }

  if (normalized.includes('from users') && normalized.includes('where id =')) {
    const id = params[0];
    const user = mockDb.users.find(u => u.id === id);
    return { rows: (user ? [user] : []) as T[], rowCount: user ? 1 : 0 };
  }

  if (normalized.startsWith('insert into users')) {
    const newUser = {
      id: crypto.randomUUID(),
      email: params[0],
      password_hash: params[1],
      full_name: params[2] || 'Tenant User',
      role: 'tenant',
      free_reports_remaining: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockDb.users.push(newUser);
    return { rows: [newUser] as T[], rowCount: 1 };
  }

  if (normalized.startsWith('update users') && normalized.includes('free_reports_remaining')) {
    const id = params[params.length - 1];
    const user = mockDb.users.find(u => u.id === id);
    if (user && user.free_reports_remaining > 0) {
      user.free_reports_remaining -= 1;
    }
    return { rows: (user ? [user] : []) as T[], rowCount: user ? 1 : 0 };
  }

  // Default fallback for jobs or transactions
  return { rows: [] as T[], rowCount: 0 };
}

export function getPostgresStatus() {
  return {
    engine: 'PostgreSQL (Neon)',
    connected: isConnected,
    mode: isConnected ? 'neon_live' : 'in_memory_resilient',
  };
}
