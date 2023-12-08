/*
  Warnings:

  - A unique constraint covering the columns `[hash]` on the table `Track` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Track_hash_key" ON "Track"("hash");
