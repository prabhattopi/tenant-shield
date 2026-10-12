import { app } from './app.js';
import { env } from './config/env.js';
import { connectPostgres } from './config/postgres.js';
import { connectMongo } from './config/mongo.js';

async function bootstrapServer() {
  console.log('🚀 Initializing TenantShield Engine...');

  // Initialize Dual-Databases in parallel
  await Promise.allSettled([connectPostgres(), connectMongo()]);

  const server = app.listen(env.PORT, () => {
    console.log(`🛡️ TenantShield Backend active on http://localhost:${env.PORT}`);
    console.log(`📡 Health Check: http://localhost:${env.PORT}/api/health`);
    console.log(`🤖 Pluggable LLM Provider: ${env.LLM_PROVIDER}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('🔒 HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrapServer().catch((err) => {
  console.error('💥 Fatal error during server bootstrap:', err);
  process.exit(1);
});
