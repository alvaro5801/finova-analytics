import path from "node:path";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// SQLite relative paths resolve inconsistently between the Prisma CLI (schema-relative)
// and the generated client at runtime (cwd-relative), so we always pass an absolute path.
const dbPath = path.join(process.cwd(), "prisma", "dev.db");

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl: `file:${dbPath}` });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
