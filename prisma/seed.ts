import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultHours = [
  { dayOfWeek: 0, openTime: null, closeTime: null, isClosed: true },       // Sunday
  { dayOfWeek: 1, openTime: "11:00", closeTime: "20:00", isClosed: false }, // Monday
  { dayOfWeek: 2, openTime: "11:00", closeTime: "20:00", isClosed: false }, // Tuesday
  { dayOfWeek: 3, openTime: "11:00", closeTime: "20:00", isClosed: false }, // Wednesday
  { dayOfWeek: 4, openTime: "11:00", closeTime: "20:00", isClosed: false }, // Thursday
  { dayOfWeek: 5, openTime: "11:00", closeTime: "21:00", isClosed: false }, // Friday
  { dayOfWeek: 6, openTime: "11:00", closeTime: "21:00", isClosed: false }, // Saturday
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
  .finally(() => prisma.$disconnect());
