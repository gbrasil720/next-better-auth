/*
  Warnings:

  - You are about to drop the column `productId` on the `item` table. All the data in the column will be lost.
  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_productId_fkey";

-- AlterTable
ALTER TABLE "item" DROP COLUMN "productId",
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "product";
