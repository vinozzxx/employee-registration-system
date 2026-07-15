import { PrismaClient } from '@prisma/client';
import { config } from '../config';

/**
 * PrismaClient singleton.
 * One connection pool for the entire application lifetime.
 * The global cache prevents multiple instances during hot-reload in development.
 * Principle: Single Instance, Resource Management, KISS.
 */

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: config.isDevelopment ? ['query', 'error', 'warn'] : ['error'],
  });

if (config.isDevelopment) {
  globalForPrisma.prisma = prisma;
}
