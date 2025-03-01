/*
  Warnings:

  - A unique constraint covering the columns `[shareId]` on the table `LearningPath` will be added. If there are existing duplicate values, this will fail.
  - The required column `shareId` was added to the `LearningPath` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "LearningPath" DROP CONSTRAINT "LearningPath_userId_fkey";

-- AlterTable
ALTER TABLE "LearningPath" ADD COLUMN     "shareId" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LearningPath_shareId_key" ON "LearningPath"("shareId");

-- AddForeignKey
ALTER TABLE "LearningPath" ADD CONSTRAINT "LearningPath_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
