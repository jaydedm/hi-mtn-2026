-- CreateTable
CREATE TABLE "MenuPdf" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MenuPdf_pkey" PRIMARY KEY ("id")
);
