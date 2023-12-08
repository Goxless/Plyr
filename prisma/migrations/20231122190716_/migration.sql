-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "artist" TEXT NOT NULL DEFAULT 'unknown',
ADD COLUMN     "hash" TEXT NOT NULL DEFAULT '00000',
ALTER COLUMN "title" SET DEFAULT 'unknown',
ALTER COLUMN "author" SET DEFAULT 'unknown';
