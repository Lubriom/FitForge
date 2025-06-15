import { PrismaClient } from "@prisma/client";

// Exportamos prisma para consultas en base de datos
export const prisma = new PrismaClient();