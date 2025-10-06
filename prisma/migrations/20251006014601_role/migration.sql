-- CreateEnum
CREATE TYPE "public"."Roles" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "Role" "public"."Roles" NOT NULL DEFAULT 'USER';
