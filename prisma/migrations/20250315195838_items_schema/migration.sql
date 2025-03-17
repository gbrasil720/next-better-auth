-- AlterTable
ALTER TABLE "order_item" ADD COLUMN     "itemId" TEXT;

-- CreateTable
CREATE TABLE "item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "item_name_key" ON "item"("name");

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
