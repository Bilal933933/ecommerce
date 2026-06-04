-- AlterTable
ALTER TABLE "Session" ADD COLUMN "lookupHash" TEXT;

-- Backfill: existing rows cannot be refreshed (we don't have the raw token)
-- Use 'legacy-<id>' so the unique constraint passes and old sessions become inert
UPDATE "Session"
SET "lookupHash" = 'legacy-' || "id"
WHERE "lookupHash" IS NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Session_lookupHash_key" ON "Session"("lookupHash");

-- CreateIndex
CREATE INDEX "Session_userId_isRevoked_idx" ON "Session"("userId", "isRevoked");
