/*
  Warnings:

  - A unique constraint covering the columns `[userId,code]` on the table `EmailVerificationToken` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "EmailVerificationToken" ADD COLUMN     "code" TEXT;

-- AlterTable
ALTER TABLE "Story" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationToken_userId_code_key" ON "EmailVerificationToken"("userId", "code");
