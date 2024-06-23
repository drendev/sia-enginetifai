import { PrismaClient } from '@prisma/client';

declare global {
  // This is necessary to prevent TypeScript from complaining about `global.prisma`
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Optional: logging settings for Prisma
});

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export const db = prisma