-- CreateTable
CREATE TABLE "Generation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "templateSlug" TEXT NOT NULL,
    "input" JSONB NOT NULL,
    "output" JSONB NOT NULL,
    "model" TEXT NOT NULL,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Generation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Generation_userId_createdAt_idx" ON "Generation"("userId", "createdAt");
