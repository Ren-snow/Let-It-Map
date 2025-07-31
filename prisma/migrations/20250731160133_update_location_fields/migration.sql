/*
  Warnings:

  - You are about to drop the column `description` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `isPublic` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Location` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Made the column `address` on table `Location` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_userId_fkey";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "description",
DROP COLUMN "isPublic",
DROP COLUMN "title",
DROP COLUMN "userId",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "address" SET NOT NULL;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "date" DROP NOT NULL;
