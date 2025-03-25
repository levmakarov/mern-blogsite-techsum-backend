/*
  Warnings:

  - You are about to drop the column `authorEmail` on the `Blog` table. All the data in the column will be lost.
  - Added the required column `author` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Blog" DROP CONSTRAINT "Blog_authorEmail_fkey";

-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "authorEmail",
ADD COLUMN     "author" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL DEFAULT 'default_blog.png';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT NOT NULL DEFAULT 'default_avatar.png';

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_author_fkey" FOREIGN KEY ("author") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
