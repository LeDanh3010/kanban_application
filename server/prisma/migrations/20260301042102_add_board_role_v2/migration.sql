/*
  Warnings:

  - The values [leader,guest,assistant] on the enum `GlobalRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "BoardRole" AS ENUM ('leader', 'assistant', 'user', 'collaborator', 'guest');

-- AlterEnum
BEGIN;
CREATE TYPE "GlobalRole_new" AS ENUM ('admin', 'user');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "GlobalRole_new" USING ("role"::text::"GlobalRole_new");
ALTER TYPE "GlobalRole" RENAME TO "GlobalRole_old";
ALTER TYPE "GlobalRole_new" RENAME TO "GlobalRole";
DROP TYPE "public"."GlobalRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user';
COMMIT;

-- AlterTable
ALTER TABLE "board_members" ADD COLUMN     "role" "BoardRole" NOT NULL DEFAULT 'user';
