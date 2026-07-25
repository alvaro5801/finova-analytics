import path from "node:path";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Local dev falls back to a file-based libSQL db (same file Prisma CLI commands use).
// Production points TURSO_DATABASE_URL/TURSO_AUTH_TOKEN at a hosted Turso database —
// same client either way, since libSQL speaks both `file:` and `libsql://` URLs.
const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const url = process.env.TURSO_DATABASE_URL ?? `file:${dbPath}`;
const authToken = process.env.TURSO_AUTH_TOKEN;

const adapter = new PrismaLibSql({ url, authToken });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
