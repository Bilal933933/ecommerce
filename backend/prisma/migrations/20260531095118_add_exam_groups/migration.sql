-- AlterTable
ALTER TABLE "exam_answers" ADD COLUMN     "groupOrder" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "exams" ADD COLUMN     "groups" JSONB NOT NULL DEFAULT '[]';
