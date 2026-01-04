-- Add SiteSettings and expand Role enum with hierarchy.
BEGIN;

CREATE TYPE "Role_new" AS ENUM (
  'GUEST',
  'USER',
  'CREATOR',
  'COLLABORATOR',
  'MODERATOR',
  'ADMIN',
  'SUPER_ADMIN',
  'OWNER'
);

ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new"
USING (
  CASE "role"::text
    WHEN 'AUTHOR' THEN 'CREATOR'
    WHEN 'ADMIN_SUPER' THEN 'SUPER_ADMIN'
    ELSE "role"::text
  END
)::"Role_new";

ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';

CREATE TABLE "SiteSettings" (
  "id" TEXT NOT NULL DEFAULT 'default',
  "logoKey" TEXT,
  "logoUrl" TEXT,
  "updatedById" TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "SiteSettings"
ADD CONSTRAINT "SiteSettings_updatedById_fkey"
FOREIGN KEY ("updatedById") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT;
