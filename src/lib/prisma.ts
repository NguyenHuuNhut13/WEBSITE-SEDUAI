import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Required for Node.js serverless environments (Vercel) to establish
// WebSocket connections to Neon's connection pooler.
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL;

const getPrisma = () => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  if (!connectionString) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
    return globalForPrisma.prisma;
  }

  const adapter = new PrismaNeon({ connectionString });
  globalForPrisma.prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

  return globalForPrisma.prisma;
};

export const prisma = getPrisma();

export default prisma;
