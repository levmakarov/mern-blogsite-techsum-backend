/*
  Warnings:

  - You are about to drop the column `userId` on the `Blog` table. All the data in the column will be lost.
  - Added the required column `authorEmail` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Blog" DROP CONSTRAINT "Blog_userId_fkey";

-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "userId",
ADD COLUMN     "authorEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_authorEmail_fkey" FOREIGN KEY ("authorEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
