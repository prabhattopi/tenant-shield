import mongoose from 'mongoose';
import { env } from './env.js';

let isConnected = false;

export async function connectMongo(): Promise<boolean> {
  if (env.MONGODB_URI && env.MONGODB_URI.trim() !== '') {
    try {
      await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      isConnected = true;
      console.log('✅ [MongoDB] Connected to MongoDB Atlas / Local instance');
      return true;
    } catch (err: any) {
      console.warn('⚠️ [MongoDB] Failed to connect to live instance:', err.message);
      console.warn('ℹ️ [MongoDB] Falling back to resilient in-memory document store.');
      isConnected = false;
      return false;
    }
  } else {
    console.log('ℹ️ [MongoDB] No MONGODB_URI provided. Using resilient in-memory document store.');
    isConnected = false;
    return false;
  }
}

export function getMongoStatus() {
  return {
    engine: 'MongoDB',
    connected: isConnected,
    mode: isConnected ? 'mongo_live' : 'in_memory_resilient',
  };
}
