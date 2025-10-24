/*
  Warnings:

  - A unique constraint covering the columns `[confirmToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "confirmToken" TEXT,
ADD COLUMN     "confirmTokenExpires" TIMESTAMP(3),
ADD COLUMN     "confirmed" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "User_confirmToken_key" ON "User"("confirmToken");
