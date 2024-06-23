import { PrismaClient } from '@prisma/client';

declare global {
  // Allow the use of `global` as the namespace for Prisma
  // This is important for avoiding issues with Next.js hot reloading
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export const db = prisma;
