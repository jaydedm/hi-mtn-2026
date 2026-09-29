-- Headline-style banner: optional label chip, long details, and a link. Additive only.
ALTER TABLE "GlobalBanner" ADD COLUMN "label" TEXT;
ALTER TABLE "GlobalBanner" ADD COLUMN "details" TEXT;
ALTER TABLE "GlobalBanner" ADD COLUMN "linkUrl" TEXT;
ALTER TABLE "GlobalBanner" ADD COLUMN "linkText" TEXT;
