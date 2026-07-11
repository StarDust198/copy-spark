/*
  Warnings:

  - You are about to drop the column `templateSlug` on the `Generation` table. All the data in the column will be lost.
  - Added the required column `templateId` to the `Generation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Generation" DROP COLUMN "templateSlug",
ADD COLUMN     "templateId" TEXT NOT NULL;
