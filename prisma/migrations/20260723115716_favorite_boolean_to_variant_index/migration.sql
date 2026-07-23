/*
  Warnings:

  - The `favorite` column on the `Generation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Generation" DROP COLUMN "favorite",
ADD COLUMN     "favorite" INTEGER;
