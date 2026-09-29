-- Ingredients per choice (shake flavors), for ingredient search and allergy lookups. Additive only.
ALTER TABLE "MenuChoice" ADD COLUMN "ingredients" TEXT[] DEFAULT ARRAY[]::TEXT[];
