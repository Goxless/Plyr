/*
  Warnings:

  - A unique constraint covering the columns `[title,profileId]` on the table `Playlist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Playlist_title_profileId_key" ON "Playlist"("title", "profileId");
