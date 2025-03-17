/*
  Warnings:

  - You are about to drop the column `total` on the `order` table. All the data in the column will be lost.
  - You are about to drop the `item` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `totalPrice` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'DELIVERED');

-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_orderId_fkey";

-- AlterTable
ALTER TABLE "order" DROP COLUMN "total",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "totalPrice" DECIMAL(65,30) NOT NULL;

-- DropTable
DROP TABLE "item";

-- CreateTable
CREATE TABLE "order_item" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
