-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "users"
  ADD COLUMN "phone"     TEXT,
  ADD COLUMN "bio"       TEXT,
  ADD COLUMN "gender"    "Gender",
  ADD COLUMN "birthDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "File"
  ADD COLUMN "ownerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "File_ownerId_idx" ON "File"("ownerId");
