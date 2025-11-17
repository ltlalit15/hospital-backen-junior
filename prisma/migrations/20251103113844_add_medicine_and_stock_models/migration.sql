/*
  Warnings:

  - You are about to drop the column `brand` on the `medicine` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `medicine` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `medicine` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `medicine` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `medicine` table. All the data in the column will be lost.
  - You are about to drop the column `unitPrice` on the `medicine` table. All the data in the column will be lost.
  - Added the required column `brandName` to the `Medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genericName` to the `Medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strength` to the `Medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PharmacyStock` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Medicine_publicId_key` ON `medicine`;

-- DropIndex
DROP INDEX `Medicine_sku_key` ON `medicine`;

-- AlterTable
ALTER TABLE `medicine` DROP COLUMN `brand`,
    DROP COLUMN `description`,
    DROP COLUMN `name`,
    DROP COLUMN `publicId`,
    DROP COLUMN `sku`,
    DROP COLUMN `unitPrice`,
    ADD COLUMN `brandName` VARCHAR(191) NOT NULL,
    ADD COLUMN `genericName` VARCHAR(191) NOT NULL,
    ADD COLUMN `manufacturer` VARCHAR(191) NULL,
    ADD COLUMN `notes` VARCHAR(191) NULL,
    ADD COLUMN `reorderLevel` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `strength` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `pharmacystock` ADD COLUMN `status` ENUM('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'CRITICAL') NOT NULL DEFAULT 'IN_STOCK',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
