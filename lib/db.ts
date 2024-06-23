import { PrismaClient } from "@prisma/client";

// Extending the global object to include a PrismaClient instance
const globalForPrisma = global as typeof global & {
    prisma?: PrismaClient;
}

// Create a new PrismaClient instance if it doesn't exist
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// In development, store the PrismaClient instance on the global object to avoid creating multiple instances during hot-reloading
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Export the PrismaClient instance for use in your application
export const db = prisma;