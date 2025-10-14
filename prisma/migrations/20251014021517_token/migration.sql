/*
  Warnings:

  - Added the required column `tokenSecret` to the `GameSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."GameSession" ADD COLUMN     "tokenSecret" TEXT NOT NULL;
