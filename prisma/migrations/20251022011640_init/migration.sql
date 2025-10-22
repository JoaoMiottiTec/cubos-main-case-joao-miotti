-- CreateEnum
CREATE TYPE "MovieStatus" AS ENUM ('PLANNED', 'IN_PRODUCTION', 'RELEASED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "originalTitle" TEXT,
    "tagline" TEXT,
    "description" TEXT,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "status" "MovieStatus" NOT NULL DEFAULT 'RELEASED',
    "originalLanguage" TEXT,
    "posterUrl" TEXT,
    "trailerUrl" TEXT,
    "popularity" DOUBLE PRECISION,
    "voteCount" INTEGER,
    "voteAverage" DOUBLE PRECISION,
    "budgetUSD" INTEGER,
    "revenueUSD" INTEGER,
    "profitUSD" INTEGER,
    "genres" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Movie_userId_idx" ON "Movie"("userId");

-- CreateIndex
CREATE INDEX "Movie_releaseDate_idx" ON "Movie"("releaseDate");

-- CreateIndex
CREATE INDEX "Movie_genres_idx" ON "Movie"("genres");

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
