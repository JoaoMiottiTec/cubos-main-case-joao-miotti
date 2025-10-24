-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('POSTER', 'GALLERY');

-- CreateTable
CREATE TABLE "MovieImage" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "contentType" TEXT,
    "size" INTEGER,
    "etag" TEXT,
    "type" "ImageType" NOT NULL DEFAULT 'GALLERY',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovieImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MovieImage_key_key" ON "MovieImage"("key");

-- CreateIndex
CREATE INDEX "MovieImage_movieId_idx" ON "MovieImage"("movieId");

-- AddForeignKey
ALTER TABLE "MovieImage" ADD CONSTRAINT "MovieImage_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
