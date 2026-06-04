/*
  Warnings:

  - You are about to drop the column `type` on the `sections` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_sectionId_fkey";

-- AlterTable
ALTER TABLE "questions" ALTER COLUMN "sectionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "sections" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "specializations" ADD COLUMN     "imageUrl" TEXT;

-- DropEnum
DROP TYPE "SectionType";

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;
