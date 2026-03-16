import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
};

function createClient() {
  let connectionString =
    process.env.DIRECT_DATABASE_URL ||
    "postgres://postgres:postgres@localhost:51214/template1";

  const isRemote = !!process.env.DIRECT_DATABASE_URL;

  // Strip sslmode from URL — we handle SSL via pool config
  if (isRemote) {
    connectionString = connectionString.replace(/[?&]sslmode=[^&]*/g, "");
    // Clean up leftover ? or &
    connectionString = connectionString.replace(/\?$/, "");
  }

  const pool = new pg.Pool({
    connectionString,
    ssl: isRemote ? { rejectUnauthorized: false } : false,
  });
  return new PrismaClient({ adapter: new PrismaPg(pool) });
}

export const prisma = globalForPrisma.prisma || createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
