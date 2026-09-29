-- AlterTable
ALTER TABLE "OperatingHours" ADD COLUMN "afterHoursStart" TEXT;

-- Backfill: keep the current 4pm switch for open days that run past 4pm.
UPDATE "OperatingHours"
SET "afterHoursStart" = '16:00'
WHERE "isClosed" = false
  AND "openTime" IS NOT NULL AND "closeTime" IS NOT NULL
  AND "openTime" < '16:00' AND "closeTime" > '16:00';
