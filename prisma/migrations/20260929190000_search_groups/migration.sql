-- Admin-editable ingredient search groups (Fruit, Chocolate, Nuts…). Additive only.
CREATE TABLE "SearchGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "members" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "showChip" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SearchGroup_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SearchGroup_name_key" ON "SearchGroup"("name");
