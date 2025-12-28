-- CreateEnum
CREATE TYPE "ProfileVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarKey" TEXT,
ADD COLUMN     "bannedReason" TEXT,
ADD COLUMN     "bannerKey" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "discordTag" TEXT,
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "instagramUrl" TEXT,
ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'es',
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "theme" TEXT NOT NULL DEFAULT 'dark',
ADD COLUMN     "twitterUrl" TEXT,
ADD COLUMN     "username" TEXT,
ADD COLUMN     "websiteUrl" TEXT;

-- CreateTable
CREATE TABLE "UserPrivacy" (
    "userId" TEXT NOT NULL,
    "profileVisibility" "ProfileVisibility" NOT NULL DEFAULT 'PUBLIC',
    "showBio" BOOLEAN NOT NULL DEFAULT true,
    "showWebsite" BOOLEAN NOT NULL DEFAULT true,
    "showDiscord" BOOLEAN NOT NULL DEFAULT false,
    "showTwitter" BOOLEAN NOT NULL DEFAULT true,
    "showInstagram" BOOLEAN NOT NULL DEFAULT true,
    "showEmail" BOOLEAN NOT NULL DEFAULT false,
    "showCreatedAt" BOOLEAN NOT NULL DEFAULT true,
    "showFavorites" BOOLEAN NOT NULL DEFAULT false,
    "showStats" BOOLEAN NOT NULL DEFAULT true,
    "showLastSeen" BOOLEAN NOT NULL DEFAULT false,
    "allowDMs" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserPrivacy_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "UserPrivacy" ADD CONSTRAINT "UserPrivacy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
