import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { technicalAssetPrisma?: PrismaClient };

export const prisma = globalForPrisma.technicalAssetPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.technicalAssetPrisma = prisma;
