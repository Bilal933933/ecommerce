-- AlterTable
ALTER TABLE "product_variants" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "product_variants_isDeleted_idx" ON "product_variants"("isDeleted");
