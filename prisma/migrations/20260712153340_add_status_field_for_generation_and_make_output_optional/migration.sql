-- CreateEnum
CREATE TYPE "GenerationStatus" AS ENUM ('PENDING', 'STREAMING', 'COMPLETED', 'ERROR');

-- AlterTable
ALTER TABLE "Generation" ADD COLUMN     "status" "GenerationStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "output" DROP NOT NULL;
