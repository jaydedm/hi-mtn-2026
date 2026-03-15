import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString =
  process.env.DIRECT_DATABASE_URL ||
  "postgres://postgres:postgres@localhost:51214/template1";

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const defaultHours = [
  { dayOfWeek: 0, openTime: null, closeTime: null, isClosed: true },
  { dayOfWeek: 1, openTime: "11:00", closeTime: "20:00", isClosed: false },
  { dayOfWeek: 2, openTime: "11:00", closeTime: "20:00", isClosed: false },
  { dayOfWeek: 3, openTime: "11:00", closeTime: "20:00", isClosed: false },
  { dayOfWeek: 4, openTime: "11:00", closeTime: "20:00", isClosed: false },
  { dayOfWeek: 5, openTime: "11:00", closeTime: "21:00", isClosed: false },
  { dayOfWeek: 6, openTime: "11:00", closeTime: "21:00", isClosed: false },
];

async function main() {
  for (const hours of defaultHours) {
    await prisma.operatingHours.upsert({
      where: { dayOfWeek: hours.dayOfWeek },
      update: {},
      create: hours,
    });
  }
  console.log("Seeded operating hours");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
