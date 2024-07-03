import { PrismaClient } from '@prisma/client';

// Declare a global variable for Prisma
const globalForPrisma = global as typeof global & {
  prisma?: PrismaClient;
};

// Instantiate Prisma client or use the existing global instance
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Assign Prisma client to the global variable in non-production environments
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Export the Prisma client instance
export const db = prisma;
