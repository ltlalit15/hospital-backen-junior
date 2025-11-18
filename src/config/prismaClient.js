// src/config/prismaClient.js
// src/config/prismaClient.js
import { PrismaClient } from "@prisma/client";

// Add this check to ensure DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not defined");
}

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export default prisma;
