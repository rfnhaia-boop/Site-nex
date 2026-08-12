import { PrismaClient } from '@prisma/client';

// Evita múltiplas instâncias em dev (hot reload do Next recarrega o módulo).
const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
